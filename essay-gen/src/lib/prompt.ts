import type { EssayInput } from './schema';


export function systemPrompt(): string {
return [
'You are an expert essay writing and editing engine.',
'Write original, non-plagiarized essays with clear structure (intro, body, conclusion).',
'Meet the requested word count within ±5% tolerance.',
'Prefer concise sentences, varied transitions, and active voice.',
'If citations are requested, use the specified style on in-text markers and a short references list with plausible placeholders (no fabrications like fake URLs).',
'Never include meta commentary about being an AI.',
].join(' ');
}


export function userPrompt(input: EssayInput): string {
const base = `Topic: "${input.topic}"\n` +
`Target words: ${input.wordCount} (±5%)\n` +
`Tone: ${input.tone}; Level: ${input.level}\n` +
`Structure: introduction, 2–5 body paragraphs, conclusion.\n` +
(input.citations !== 'none' ? `Citations style: ${input.citations.toUpperCase()} (use in-text markers + a short references list).\n` : '') +
(input.outlineFirst ? 'Start with a brief outline (3–6 bullets), then the full essay.\n' : '') +
(input.extras ? `Extra constraints: ${input.extras}\n` : '');


return base + '\nReturn only the outline (if requested) and essay, no meta notes.';
}