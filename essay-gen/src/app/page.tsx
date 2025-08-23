'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { essaySchema } from '@/lib/schema';
import { useState } from 'react';
import type { z } from 'zod';

type EssayInput = z.infer<typeof essaySchema>;
type Preview = EssayInput & {
  essay: string;
  outline?: string[];
};

export default function Home() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    setIsGenerating(true);
    try {
      const res = await fetch('/api/essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate essay');
      }

      const result = await res.json();
      
      setPreview({
        ...data, // spread all form data
        essay: result.essay,
        outline: result.outline,
      });

    } catch (err: unknown) {
      console.error('Essay generation error:', err);
      if (err instanceof Error) {
        alert(err.message || 'Something went wrong!');
      } else {
        alert('Something went wrong!');
      }
    } finally {
      setIsGenerating(false);
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

      <div className="max-w-6xl mx-auto px-6 py-8">
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
                disabled={isSubmitting || isGenerating}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {(isSubmitting || isGenerating) ? (
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

          {/* Results Section */}
          {preview ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
                <h2 className="text-xl font-semibold text-white">Generated Essay</h2>
                <p className="text-emerald-100 text-sm mt-1">Your AI-generated essay</p>
              </div>
              
              <div className="p-8 max-h-[80vh] overflow-y-auto">
                {/* Show outline if present */}
                {preview.outline && preview.outline.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Outline</h3>
                    <div className="bg-slate-50 rounded-xl p-6">
                      <ol className="space-y-2">
                        {preview.outline.map((item, index) => (
                          <li key={index} className="text-sm text-slate-700 flex">
                            <span className="text-blue-600 font-medium mr-2">{index + 1}.</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
                
                {/* Essay content */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Essay</h3>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {preview.essay}
                    </div>
                  </div>
                </div>
                
                {/* Word count info */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Word count: ~{preview.essay.split(/\s+/).filter(Boolean).length} words</span>
                    <span>Target: {preview.wordCount} words</span>
                  </div>
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
                  <p className="text-slate-500 text-sm">Fill out the form and click Generate Essay to see your AI-generated essay here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}