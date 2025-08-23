import type { EssayInput } from './schema';

export function systemPrompt(input: EssayInput): string {
  const basePrompt = [
    'You are an expert essay writing assistant.',
    'Write original, well-structured essays with clear introductions, body paragraphs, and conclusions.',
    `Use a ${input.tone} tone and write at a ${input.level} level.`,
    'Ensure proper paragraph structure with topic sentences and supporting evidence.',
    'Use varied sentence structures and smooth transitions between ideas.',
    'Never include meta-commentary about being an AI or the writing process.',
  ];

  // Add citation instructions if needed
  if (input.citations !== 'none') {
    basePrompt.push(
      `Include in-text citations in ${input.citations.toUpperCase()} format where appropriate.`,
      'Add a brief references section at the end with plausible academic sources.',
      'Do not fabricate real URLs or specific publication details.'
    );
  }

  // Add outline instructions if needed
  if (input.outlineFirst) {
    basePrompt.push(
      'Start your response with a brief outline (3-6 main points) using bullet points.',
      'Follow the outline with the complete essay.',
      'Separate the outline and essay with a clear line break.'
    );
  }

  return basePrompt.join(' ');
}

export function userPrompt(input: EssayInput): string {
  const prompt = [
    `Topic: "${input.topic}"`,
    `Target length: ${input.wordCount} words (aim for ±5% of target)`,
    `Writing level: ${input.level}`,
    `Tone: ${input.tone}`,
  ];

  if (input.citations !== 'none') {
    prompt.push(`Citations: Use ${input.citations.toUpperCase()} format`);
  }

  if (input.extras && input.extras.trim()) {
    prompt.push(`Additional requirements: ${input.extras.trim()}`);
  }

  prompt.push(
    '',
    'Structure your essay with:',
    '- An engaging introduction with a clear thesis statement',
    '- 2-4 well-developed body paragraphs with evidence and analysis',
    '- A strong conclusion that reinforces your main argument',
    '',
    input.outlineFirst 
      ? 'Please provide a brief outline first, then write the full essay.'
      : 'Write the complete essay directly.'
  );

  return prompt.join('\n');
}