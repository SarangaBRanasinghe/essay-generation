import { NextRequest, NextResponse } from "next/server";
import { essaySchema, EssayInput } from "@/lib/schema";
import { generateWithGemini, generateWithOpenAI } from "@/lib/llm";
import { systemPrompt, userPrompt } from "@/lib/prompt";

// POST /api/essay
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate with zod
    const input: EssayInput = essaySchema.parse(body);
    
    // Generate prompts using the improved prompt functions
    const system = systemPrompt(input);
    const prompt = userPrompt(input);
    
    console.log("Generating essay with:", {
      topic: input.topic,
      wordCount: input.wordCount,
      tone: input.tone,
      level: input.level,
      outlineFirst: input.outlineFirst,
      citations: input.citations
    });
    
    // Debug environment variables (without exposing the full keys)
    console.log("Environment check:", {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasGemini: !!process.env.GEMINI_API_KEY,
      openAIPrefix: process.env.OPENAI_API_KEY?.substring(0, 7),
      geminiPrefix: process.env.GEMINI_API_KEY?.substring(0, 7)
    });
    
    // Call LLM (Check which API keys are available)
    let result;
    
    if (process.env.OPENAI_API_KEY) {
      console.log("Using OpenAI API");
      try {
        result = await generateWithOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          model: process.env.MODEL_FALLBACK || "gpt-4o-mini",
          system ,
          prompt ,
          wordCount: input.wordCount,
        });
      } catch (openAIError) {
        console.log("OpenAI failed, trying Gemini fallback:", openAIError);
        if (process.env.GEMINI_API_KEY) {
          console.log("Falling back to Gemini API");
          result = await generateWithGemini({
            apiKey: process.env.GEMINI_API_KEY,
            system ,
            prompt ,
            wordCount: input.wordCount,
          });
        } else {
          throw openAIError; // Re-throw if no fallback available
        }
      }
    } else if (process.env.GEMINI_API_KEY) {
      console.log("Using Gemini API");
      result = await generateWithGemini({
        apiKey: process.env.GEMINI_API_KEY,
        system ,
        prompt ,
        wordCount: input.wordCount,
      });
    } else {
      throw new Error("No API key found. Please set OPENAI_API_KEY or GEMINI_API_KEY in your .env.local file");
    }
    
    // Ensure we have content
    if (!result.essay || result.essay.trim().length === 0) {
      throw new Error("No essay content was generated");
    }
    
    // Normalize word count if needed
    const normalized = await ensureWordCount(
      result.essay,
      input.wordCount,
      0.1, // Allow 10% tolerance
      system
    );
    
    const wordCount = countWords(normalized);
    console.log(`Generated essay: ${wordCount} words (target: ${input.wordCount})`);
    
    return NextResponse.json({
      outline: result.outline ?? [],
      essay: normalized,
      actualWordCount: wordCount,
      targetWordCount: input.wordCount,
    });
    
  } catch (e) {
    console.error("Error in /api/essay:", e);
    
    // Return more specific error messages
    if (e instanceof Error) {
      if (e.message.includes("API key")) {
        return NextResponse.json(
          { error: "API configuration error. Please check your environment variables." },
          { status: 500 }
        );
      } else if (e.message.includes("quota") || e.message.includes("billing")) {
        return NextResponse.json(
          { error: "API quota exceeded. Please check your API billing status." },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate essay" },
      { status: 500 }
    );
  }
}

// Helper functions
async function ensureWordCount(
  text: string,
  target: number,
  tolerance = 0.1,
  system: string
): Promise<string> {
  const currentCount = countWords(text);
  const minWords = Math.round(target * (1 - tolerance));
  const maxWords = Math.round(target * (1 + tolerance));
  
  // If within tolerance, return as-is
  if (currentCount >= minWords && currentCount <= maxWords) {
    console.log(`Word count ${currentCount} is within tolerance (${minWords}-${maxWords})`);
    return text;
  }
  
  console.log(`Word count ${currentCount} outside tolerance, attempting to adjust...`);
  
  // Try to adjust word count
  const diff = target - currentCount;
  const instruction = diff > 0
    ? `This essay is ${Math.abs(diff)} words short of the ${target}-word target. Please expand it by adding more detailed examples, analysis, and supporting evidence while maintaining coherence and flow.`
    : `This essay is ${Math.abs(diff)} words over the ${target}-word target. Please trim it by removing redundancy and condensing ideas while preserving all key points and arguments.`;
  
  const adjustPrompt = `${instruction}\n\nOriginal essay:\n${text}`;
  
  try {
    if (process.env.OPENAI_API_KEY) {
      const result = await generateWithOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.MODEL_FALLBACK || "gpt-4o-mini",
        system: system + " Focus on precise word count adjustment.",
        prompt: adjustPrompt,
        wordCount: target,
      });
      
      const adjustedCount = countWords(result.essay);
      console.log(`Adjusted essay: ${adjustedCount} words`);
      return result.essay.trim();
    }
    
    // If no adjustment possible, return original
    return text;
  } catch (error) {
    console.error("Error adjusting word count:", error);
    return text; // Return original if adjustment fails
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}