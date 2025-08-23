import { NextRequest, NextResponse } from "next/server";
import { essaySchema, EssayInput } from "@/lib/schema";
import { generateWithOpenAI, generateWithAnthropic } from "@/lib/llm";

// POST /api/essay
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // validate with zod
    const input: EssayInput = essaySchema.parse(body);

    const sys = `You are an expert essay writer.
- Tone: ${input.tone}
- Level: ${input.level}
- Citation style: ${input.citations}
- Outline first: ${input.outlineFirst}`;

    const uprompt = `Write an essay on "${input.topic}".
Target length: ${input.wordCount} words.
Extra instructions: ${input.extras || "None"}.`;

    // Call LLM (OpenAI preferred, fallback Anthropic)
    const result = process.env.OPENAI_API_KEY
      ? await generateWithOpenAI({
          apiKey: process.env.OPENAI_API_KEY!,
          model: process.env.MODEL_FALLBACK || "gpt-4o-mini", // ✅ added model
          system: sys,
          prompt: uprompt,
        })
      : await generateWithAnthropic({
          apiKey: process.env.ANTHROPIC_API_KEY!,
          model: "claude-3-5-sonnet-20240620", // ✅ added model
          system: sys,
          prompt: uprompt,
        });

    // normalize word count
    const normalized = await ensureWordCount(
      result.essay,
      input.wordCount,
      0.08,
      sys
    );

    return NextResponse.json({
      outline: result.outline,
      essay: normalized,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// --- helpers ---

async function ensureWordCount(
  text: string,
  target: number,
  tol = 0.08,
  system: string
): Promise<string> {
  const wc = countWords(text);
  const lo = Math.round(target * (1 - tol));
  const hi = Math.round(target * (1 + tol));

  if (wc >= lo && wc <= hi) return text;

  const diff = target - wc;
  const instruction =
    diff > 0
      ? `The essay is ${Math.abs(
          diff
        )} words short. Expand with additional evidence and nuance, keeping coherence.`
      : `The essay is ${Math.abs(
          diff
        )} words long. Trim redundancy and tighten prose without losing key points.`;

  const prompt = `${instruction}\n\nRewrite the essay to meet ${target} words ±${Math.round(
    tol * 100
  )}%. Keep the same tone and structure.\n\nEssay:\n${text}`;

  // Soft-fallback to OpenAI
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.MODEL_FALLBACK || "gpt-4o-mini",
      input: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) return text; // fail soft

  const data = await res.json();
  const revised =
    data?.output?.[0]?.content?.[0]?.text ||
    data?.choices?.[0]?.message?.content ||
    data?.content?.[0]?.text ||
    text;

  return revised.trim();
}

function countWords(s: string): number {
  return (s.trim().match(/\b\w+\b/g) || []).length;
}
