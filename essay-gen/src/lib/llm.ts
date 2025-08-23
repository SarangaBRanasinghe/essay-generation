export type LLMResult = { outline?: string[]; essay: string };
export type LLMProvider = 'openai' | 'anthropic';

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
}: { apiKey: string; model: string; system: string; prompt: string }): Promise<LLMResult> {
const res = await fetch('https://api.openai.com/v1/responses', {
method: 'POST',
headers: {
'Authorization': `Bearer ${apiKey}`,
'Content-Type': 'application/json',
},
body: JSON.stringify({
model,
input: [
{ role: 'system', content: system },
{ role: 'user', content: prompt },
],
// Optional: ask for structured output
// response_format: {
// type: 'json_schema',
// json_schema: {
// name: 'essay_payload',
// schema: {
// type: 'object',
// additionalProperties: false,
// properties: {
// outline: { type: 'array', items: { type: 'string' } },
// essay: { type: 'string' },
// },
// required: ['essay']
// },
// strict: true,
// }
// }
})
});
if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
const data = await res.json();


// If using plain text responses
const text = data?.output?.[0]?.content?.[0]?.text
|| data?.choices?.[0]?.message?.content
|| data?.content?.[0]?.text
|| JSON.stringify(data);


// naive split if outline included as bullets
const [maybeOutline, ...rest] = text.split('\n\n');
const outline = maybeOutline.startsWith('- ') || maybeOutline.includes('•')
? maybeOutline.split('\n').map((s: string) => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
: undefined;
const essay = outline ? rest.join('\n\n').trim() : text.trim();
return { outline, essay };
}


export async function generateWithGemini({
  apiKey,
  system,
  prompt,
}: {
  apiKey: string;
  system: string;
  prompt: string;
}) {


  if (!apiKey) {
    throw new Error("Missing Gemini API key");
  }

const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,  // ✅ correct way for Gemini
    },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: `${system}\n\n${prompt}` }] }
      ]
    }),
  }
);


  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}
