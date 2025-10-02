export type LLMResult = { outline?: string[]; essay: string };
export type LLMProvider = 'openai' | 'gemini';

// --- Gemini response types ---
type GeminiPart = { text?: string };
type GeminiContent = { parts?: GeminiPart[] };
type GeminiCandidate = { content?: GeminiContent };
type GeminiResponse = { candidates?: GeminiCandidate[] };

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
   const estimatedTokens = Math.min(Math.round(wordCount * 2), 4000);
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

  // Parse outline and essay from response
  const lines = text.split('\n');
  let outline: string[] | undefined;
  let essayStart = 0;

  // Check if response starts with outline
  if (text.includes('Outline:') || lines.some((line: string) => line.match(/^\d+\.|^[-•*]/))) {
    const outlineLines: string[] = [];
    let foundOutline = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line: string = lines[i].trim();
      
      if (line.toLowerCase().includes('outline') || line.match(/^\d+\.|^[-•*]/)) {
        foundOutline = true;
        if (!line.toLowerCase().includes('outline')) {
          outlineLines.push(line.replace(/^\d+\.\s*|^[-•*]\s*/, ''));
        }
      } else if (foundOutline && line.match(/^\d+\.|^[-•*]/)) {
        outlineLines.push(line.replace(/^\d+\.\s*|^[-••*]\s*/, ''));
      } else if (foundOutline && line.length > 20 && !line.match(/^\d+\.|^[-•*]/)) {
        essayStart = i;
        break;
      }
    }
    
    if (outlineLines.length > 0) {
      outline = outlineLines.filter(Boolean);
    }
  }

  const essay = lines.slice(essayStart).join('\n').trim();
  
  return { outline, essay };
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

  // Estimate tokens for Gemini
const estimatedTokens = Math.min(Math.round(wordCount * 2), 4000);


  const res = await fetch(
   `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
        }
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${errorText}`);
  }

  const data: GeminiResponse = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!text) {
    throw new Error('No content received from Gemini');
  }

  // --- NEW: declare lines, outline, essayStart ---
  const lines: string[] = text.split('\n');
  let outline: string[] | undefined;
  let essayStart = 0;

  // Check if response starts with outline
  if (text.includes('Outline:') || lines.some((line: string) => line.match(/^\d+\.|^[-•*]/))) {
    const outlineLines: string[] = [];
    let foundOutline = false;

    for (let i = 0; i < lines.length; i++) {
      const line: string = lines[i].trim();

      if (line.toLowerCase().includes('outline') || line.match(/^\d+\.|^[-•*]/)) {
        foundOutline = true;
        if (!line.toLowerCase().includes('outline')) {
          outlineLines.push(line.replace(/^\d+\.\s*|^[-•*]\s*/, ''));
        }
      } else if (foundOutline && line.match(/^\d+\.|^[-•*]/)) {
        outlineLines.push(line.replace(/^\d+\.\s*|^[-•*]\s*/, ''));
      } else if (foundOutline && line.length > 20 && !line.match(/^\d+\.|^[-•*]/)) {
        essayStart = i;
        break;
      }
    }

    if (outlineLines.length > 0) {
      outline = outlineLines.filter(Boolean);
    }
  }

  const essay = lines.slice(essayStart).join('\n').trim();

  return { outline, essay };
}
