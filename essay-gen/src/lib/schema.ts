import { z } from 'zod';


export const essaySchema = z.object({
	topic: z.string().min(3, "Topic must be at least 3 characters"),
	wordCount: z.number().min(100, "Minimum 100 words").max(2000, "Max 2000 words"),
	tone: z.enum(['academic','formal','informal','persuasive','creative']).default('academic').nonoptional(),
	level: z.enum(['beginner','intermediate','advanced']).default('intermediate').nonoptional(),
	outlineFirst: z.boolean().default(true).nonoptional(),
	citations: z.enum(['none','apa','mla']).default('none').nonoptional(),
	extras: z.string().max(2000).optional(),
});
export type EssayInput = z.infer<typeof essaySchema>;
