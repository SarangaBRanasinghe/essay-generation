'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { essaySchema } from '@/lib/schema';
import { useState } from 'react';
import type { z } from 'zod';


type EssayInput = z.infer<typeof essaySchema>;
type Preview = EssayInput & {
  essay: string;
  outline?: string;
};



export default function Home() {
  const [preview, setPreview] = useState<Preview | null>(null);


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

 const onSubmit = async (data: EssayInput) => {
  try {
    const res = await fetch('/api/essay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to generate essay');

    const result = await res.json();
 setPreview({
  topic: data.topic,
  wordCount: data.wordCount,
  tone: data.tone,
  level: data.level,
  outlineFirst: data.outlineFirst,
  citations: data.citations,
  extras: data.extras,
  essay: result.essay,       // ❌ not in EssayInput
  outline: result.outline,   // ❌ not in EssayInput
});

  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      alert(err.message || 'Something went wrong!');
    } else {
      alert('Something went wrong!');
    }
  }
};


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Essay Generator</h1>
              <p className="text-slate-600 text-sm">Create professional essays with AI assistance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-xl font-semibold text-white">Essay Configuration</h2>
              <p className="text-blue-100 text-sm mt-1">Fill in the details to generate your essay</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              {/* Topic */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Essay Topic <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('topic')}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                      errors.topic 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="Enter your essay topic..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
                {errors.topic && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.topic.message}</span>
                  </p>
                )}
              </div>

              {/* Word Count */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Word Count <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register('wordCount', { valueAsNumber: true })}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                      errors.wordCount 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="e.g. 500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {errors.wordCount && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.wordCount.message}</span>
                  </p>
                )}
              </div>

              {/* Tone and Level Row */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Tone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Tone</label>
                  <select 
                    {...register('tone')} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                  >
                    <option value="academic">📚 Academic</option>
                    <option value="formal">🎩 Formal</option>
                    <option value="informal">💬 Informal</option>
                    <option value="persuasive">🎯 Persuasive</option>
                    <option value="creative">🎨 Creative</option>
                  </select>
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Level</label>
                  <select 
                    {...register('level')} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                  >
                    <option value="beginner">🟢 Beginner</option>
                    <option value="intermediate">🟡 Intermediate</option>
                    <option value="advanced">🔴 Advanced</option>
                  </select>
                </div>
              </div>

              {/* Outline First */}
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <input 
                  type="checkbox" 
                  {...register('outlineFirst')} 
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="text-sm font-medium text-slate-700">Generate Outline First</span>
                  <p className="text-xs text-slate-500">Create a structured outline before writing the essay</p>
                </div>
              </div>

              {/* Citations */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Citation Style</label>
                <select 
                  {...register('citations')} 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                >
                  <option value="none">🚫 None</option>
                  <option value="apa">📝 APA Style</option>
                  <option value="mla">📄 MLA Style</option>
                </select>
              </div>

              {/* Extras */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Additional Instructions</label>
                <textarea
                  {...register('extras')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                  placeholder="Any specific requirements or instructions..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating Essay...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Essay</span>
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          {preview ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
                <h2 className="text-xl font-semibold text-white">Configuration Preview</h2>
                <p className="text-emerald-100 text-sm mt-1">Review your essay settings</p>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Topic:</span>
                    <span className="text-sm text-slate-800 font-medium text-right flex-1 ml-4">{preview.topic}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Word Count:</span>
                    <span className="text-sm text-slate-800 font-medium">{preview.wordCount.toLocaleString()} words</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Tone:</span>
                    <span className="text-sm text-slate-800 font-medium capitalize">{preview.tone}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Level:</span>
                    <span className="text-sm text-slate-800 font-medium capitalize">{preview.level}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Outline First:</span>
                    <span className="text-sm text-slate-800 font-medium">
                      {preview.outlineFirst ? (
                        <span className="text-green-600 flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">No</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Citations:</span>
                    <span className="text-sm text-slate-800 font-medium uppercase">{preview.citations}</span>
                  </div>
                  {preview.extras && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <span className="text-sm font-medium text-slate-600 block mb-2">Additional Instructions:</span>
                      <p className="text-sm text-slate-800">{preview.extras}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm">Fill out the form to see a preview of your essay configuration</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}