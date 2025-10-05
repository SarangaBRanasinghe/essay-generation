export type LLMResult = { outline?: string[]; essay: string };
export type LLMProvider = 'openai' | 'gemini';

// --- Gemini response types ---
type GeminiPart = { text?: string };
type GeminiContent = { parts?: GeminiPart[] };
type GeminiCandidate = { 
  content?: GeminiContent;
  finishReason?: string;
  safetyRatings?: Array<{
    category: string;
    probability: string;
  }>;
};
type GeminiResponse = { 
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  };
};

export async function generateWithOpenAI({
  apiKey,
  model,
  system,
  prompt,
  wordCount,
}: {
  apiKey: string;
  model: string;
  system: string;
  prompt: string;
  wordCount: number;
}): Promise<LLMResult> {
  // Increase token estimation - roughly 1.5 tokens per word, plus buffer
  const estimatedTokens = Math.min(Math.round(wordCount * 1.5 + 500), 8000);
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: estimatedTokens,
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  
  // Extract the content from OpenAI response
  const text = data?.choices?.[0]?.message?.content || '';
  
  if (!text) {
    throw new Error('No content received from OpenAI');
  }

  return parseResponse(text);
}

export async function generateWithGemini({
  apiKey,
  system,
  prompt,
  wordCount,
}: {
  apiKey: string;
  system: string;
  prompt: string;
  wordCount: number;
}): Promise<LLMResult> {
  if (!apiKey) {
    throw new Error("Missing Gemini API key");
  }

  // More generous token estimation for Gemini
  const estimatedTokens = Math.min(Math.round(wordCount * 2 + 1000), 8000);

  // Use correct Gemini model from env or default
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          { 
            role: "user", 
            parts: [{ text: `${system}\n\n${prompt}` }] 
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: estimatedTokens,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ]
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Gemini API Error:', errorText);
    throw new Error(`Gemini API error: ${res.status} - ${errorText}`);
  }

  const data: GeminiResponse = await res.json();
  
  // Log the full response for debugging
  console.log('Gemini full response:', JSON.stringify(data, null, 2));
  
  // Check if the prompt itself was blocked
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the prompt. Reason: ${data.promptFeedback.blockReason}. Try a different topic or use OpenAI.`);
  }
  
  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text || '';

  if (!text) {
    // Check if content was blocked
    const finishReason = candidate?.finishReason;
    if (finishReason === 'SAFETY') {
      const safetyRatings = candidate?.safetyRatings || [];
      const blockedCategories = safetyRatings
        .filter(r => r.probability === 'HIGH' || r.probability === 'MEDIUM')
        .map(r => r.category)
        .join(', ');
      
      throw new Error(
        `Gemini blocked this content due to safety filters${blockedCategories ? `: ${blockedCategories}` : ''}. Try a different topic or use OpenAI instead.`
      );
    }
    
    console.error('Gemini response:', JSON.stringify(data, null, 2));
    throw new Error(`No content received from Gemini. Finish reason: ${finishReason || 'unknown'}`);
  }

  return parseResponse(text);
}

// Shared parser for both OpenAI and Gemini responses
function parseResponse(text: string): LLMResult {
  const lines: string[] = text.split('\n');
  let outline: string[] | undefined;
  let essayStart = 0;

  // Check if response starts with outline
  if (text.includes('Outline:') || text.includes('outline:') || 
      lines.some((line: string) => line.trim().match(/^\d+\.|^[-•*]/))) {
    const outlineLines: string[] = [];
    let foundOutline = false;

    for (let i = 0; i < lines.length; i++) {
      const line: string = lines[i].trim();

      // Detect outline start
      if (line.toLowerCase().includes('outline') || line.match(/^\d+\.|^[-•*]/)) {
        foundOutline = true;
        // Don't include the "Outline:" header itself
        if (!line.toLowerCase().includes('outline') && line.length > 0) {
          outlineLines.push(line.replace(/^\d+\.\s*|^[-•*]\s*/, ''));
        }
      } 
      // Continue collecting outline items
      else if (foundOutline && line.match(/^\d+\.|^[-•*]/)) {
        outlineLines.push(line.replace(/^\d+\.\s*|^[-•*]\s*/, ''));
      } 
      // End of outline when we hit substantial text
      else if (foundOutline && line.length > 30 && !line.match(/^\d+\.|^[-•*]/)) {
        essayStart = i;
        break;
      }
      // Skip empty lines
      else if (foundOutline && line.length === 0) {
        continue;
      }
    }

    if (outlineLines.length > 0) {
      outline = outlineLines.filter(Boolean);
    }
  }

  // Extract essay content
  const essay = lines.slice(essayStart)
    .join('\n')
    .trim()
    // Remove any remaining "Essay:" or "Content:" headers
    .replace(/^(Essay|Content|Introduction):\s*/i, '');

  return { outline, essay };
}