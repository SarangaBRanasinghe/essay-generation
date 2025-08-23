export type LLMResult = { outline?: string[]; essay: string };
export type LLMProvider = 'openai' | 'anthropic';

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


export async function generateWithAnthropic({
apiKey,
system,
prompt,
maxTokens = 2048,
model = 'claude-3-5-sonnet-20240620'
}: { apiKey: string; system: string; prompt: string; maxTokens?: number; model?: string }): Promise<LLMResult> {
const res = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: {
'x-api-key': apiKey,
'anthropic-version': '2023-06-01',
'content-type': 'application/json',
},
body: JSON.stringify({
model,
max_tokens: maxTokens,
system,
messages: [{ role: 'user', content: prompt }],
})
});
if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
const data = await res.json();
const text = data?.content?.[0]?.text ?? JSON.stringify(data);
const [maybeOutline, ...rest] = text.split('\n\n');
const outline = maybeOutline.startsWith('- ') || maybeOutline.includes('•')
? maybeOutline.split('\n').map((s: string) => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
: undefined;
const essay = outline ? rest.join('\n\n').trim() : text.trim();
return { outline, essay };
}