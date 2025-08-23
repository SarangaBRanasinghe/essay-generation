'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { essaySchema } from '@/lib/schema';
import { useState } from 'react';
import type { z } from 'zod';

type EssayInput = z.infer<typeof essaySchema>;

export default function Home() {
  const [preview, setPreview] = useState<EssayInput | null>(null);


const { register, handleSubmit, formState: { errors, isSubmitting } } =
  useForm<z.output<typeof essaySchema>>({
    resolver: zodResolver(essaySchema),
    defaultValues: {
      tone: 'academic',
      level: 'intermediate',
      outlineFirst: true,
      citations: 'none',
    },
  });



  const onSubmit = (data: Partial<EssayInput>) => {
    // zodResolver ensures all required fields are present
    const validData = essaySchema.parse(data);
    setPreview(validData);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Essay Form</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded-2xl shadow-md"
      >
        {/* Topic */}
        <div>
          <label className="block font-medium">Topic</label>
          <input
            {...register('topic')}
            className="w-full border rounded p-2"
            placeholder="Enter essay topic"
          />
          {errors.topic && (
            <p className="text-red-500 text-sm">{errors.topic.message}</p>
          )}
        </div>

        {/* Word Count */}
        <div>
          <label className="block font-medium">Word Count</label>
          <input
            type="number"
            {...register('wordCount', { valueAsNumber: true })}
            className="w-full border rounded p-2"
            placeholder="e.g. 500"
          />
          {errors.wordCount && (
            <p className="text-red-500 text-sm">{errors.wordCount.message}</p>
          )}
        </div>

        {/* Tone */}
        <div>
          <label className="block font-medium">Tone</label>
          <select {...register('tone')} className="w-full border rounded p-2">
            <option value="academic">Academic</option>
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
            <option value="persuasive">Persuasive</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block font-medium">Level</label>
          <select {...register('level')} className="w-full border rounded p-2">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Outline First */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register('outlineFirst')} />
          <span>Generate Outline First</span>
        </div>

        {/* Citations */}
        <div>
          <label className="block font-medium">Citations</label>
          <select {...register('citations')} className="w-full border rounded p-2">
            <option value="none">None</option>
            <option value="apa">APA</option>
            <option value="mla">MLA</option>
          </select>
        </div>

        {/* Extras */}
        <div>
          <label className="block font-medium">Extras</label>
          <textarea
            {...register('extras')}
            className="w-full border rounded p-2"
            placeholder="Additional instructions..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {/* Preview */}
      {preview && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-2">Preview</h2>
          <pre className="whitespace-pre-wrap text-gray-700">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
