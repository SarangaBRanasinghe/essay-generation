'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { CheckCircle2, FileText, Loader2, Settings, Sparkles, BookOpen, Target, Palette, GraduationCap, Zap, Star, Wand2 } from 'lucide-react';

// Mock schema types - replace with your actual schema
type EssayInput = {
  topic: string;
  wordCount: number;
  tone: 'academic' | 'formal' | 'informal' | 'persuasive' | 'creative';
  level: 'beginner' | 'intermediate' | 'advanced';
  outlineFirst: boolean;
  citations: 'none' | 'apa' | 'mla';
  extras?: string;
};

type Preview = EssayInput & {
  essay: string;
  outline?: string[];
};

export default function ImprovedEssayGenerator() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<EssayInput>({
    defaultValues: {
      tone: 'academic',
      level: 'intermediate',
      outlineFirst: true,
      citations: 'none',
      wordCount: 500,
      topic: ''
    },
    mode: 'onChange'
  });

  const watchedFields = watch();
  const isFormComplete = watchedFields.topic && watchedFields.wordCount;

  const onSubmit = async (data: EssayInput) => {
    setIsGenerating(true);
    setActiveStep(2);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        ...data,
        essay: `Air pollution, a pervasive global challenge, poses a significant threat to human health and the environment. Its impact extends far beyond localized smog events, affecting ecosystems, economies, and ultimately, the well-being of billions. This essay will examine the multifaceted nature of air pollution, exploring its sources, health consequences, and potential mitigation strategies.

The sheer scale of air pollution's impact is undeniable. From the densely populated megacities of Asia to the seemingly pristine landscapes of the Arctic, the presence of pollutants in the atmosphere is a global phenomenon. Particulate matter, ozone, nitrogen oxides, and sulfur dioxide, among others, contaminate the air we breathe, impacting air quality worldwide. This widespread contamination necessitates a comprehensive understanding of its sources and effects to develop effective solutions.

Industrial activities represent one of the most significant contributors to air pollution. Manufacturing processes, power generation, and chemical production release vast quantities of pollutants into the atmosphere. The burning of fossil fuels for energy production is particularly problematic, as it releases not only carbon dioxide but also a complex mixture of harmful substances. Similarly, transportation systems, particularly those relying on internal combustion engines, contribute substantially to urban air pollution through exhaust emissions.

The health implications of prolonged exposure to polluted air are severe and well-documented. Respiratory diseases, cardiovascular problems, and even certain cancers have been linked to poor air quality. Vulnerable populations, including children, elderly individuals, and those with pre-existing health conditions, face heightened risks. The economic burden of air pollution-related healthcare costs further underscores the urgency of addressing this issue.`,
        outline: [
          "Introduction to air pollution as a global challenge",
          "Scale and scope of air pollution worldwide", 
          "Industrial sources and fossil fuel combustion",
          "Health impacts and vulnerable populations",
          "Economic costs and mitigation strategies",
          "Conclusion and call for action"
        ]
      };
      setPreview(mockResult);
      setIsGenerating(false);
    }, 3000);
  };

  const resetForm = () => {
    setPreview(null);
    setActiveStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-50 to-cyan-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-20 animate-bounce delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-xl shadow-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 tracking-tight">
                  AI Essay Generator
                </h1>
                <p className="text-base text-gray-600 font-semibold mt-1">
                  ✨ Create professional essays with AI assistance
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full border border-emerald-200">
                <Star className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8">
              <div className={`flex items-center transition-all duration-500 ${activeStep >= 1 ? 'text-violet-600' : 'text-gray-400'}`}>
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-xl transition-all duration-500 transform ${
                  activeStep >= 1 ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white scale-110' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {activeStep > 1 ? <CheckCircle2 className="w-7 h-7" /> : '1'}
                  {activeStep >= 1 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl opacity-20 animate-pulse"></div>
                  )}
                </div>
                <span className="ml-4 text-base font-black">Configure</span>
              </div>
              <div className={`w-24 h-2 rounded-full transition-all duration-1000 ${activeStep >= 2 ? 'bg-gradient-to-r from-violet-500 to-purple-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center transition-all duration-500 ${activeStep >= 2 ? 'text-violet-600' : 'text-gray-400'}`}>
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-xl transition-all duration-500 transform ${
                  activeStep >= 2 ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white scale-110' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {isGenerating ? <Loader2 className="w-7 h-7 animate-spin" /> : '2'}
                  {activeStep >= 2 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl opacity-20 animate-pulse"></div>
                  )}
                </div>
                <span className="ml-4 text-base font-black">Generate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Configuration Panel */}
          <div className="group bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="px-8 py-6 border-b border-gray-100/80 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Essay Configuration</h2>
                  <p className="text-sm text-gray-600 font-semibold mt-1">🚀 Fill in the details to generate your masterpiece</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Topic Input */}
              <div className="space-y-4 group">
                <label className="flex items-center gap-3 text-sm font-black text-gray-900">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-white" />
                  </div>
                  Essay Topic
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('topic', { required: 'Topic is required' })}
                  className={`w-full px-5 py-4 border-2 rounded-2xl shadow-lg focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all duration-300 font-semibold placeholder-gray-400 bg-white text-gray-900 hover:shadow-xl transform hover:-translate-y-0.5 ${
                    errors.topic ? 'border-red-400 bg-red-50 ring-4 ring-red-100' : 'border-gray-200 hover:border-violet-300'
                  }`}
                  placeholder="✨ e.g., Climate change and its global impact"
                />
                {errors.topic && (
                  <div className="flex items-center gap-2 text-sm text-red-600 font-bold bg-red-50 px-3 py-2 rounded-lg animate-shake">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                    {errors.topic.message}
                  </div>
                )}
              </div>

              {/* Word Count */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-sm font-black text-gray-900">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  Word Count
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('wordCount', { 
                    required: 'Word count is required',
                    min: { value: 100, message: 'Minimum 100 words' },
                    max: { value: 5000, message: 'Maximum 5000 words' }
                  })}
                  className={`w-full px-5 py-4 border-2 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 font-semibold placeholder-gray-400 bg-white text-gray-900 hover:shadow-xl transform hover:-translate-y-0.5 ${
                    errors.wordCount ? 'border-red-400 bg-red-50 ring-4 ring-red-100' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  placeholder="500"
                />
                {errors.wordCount && (
                  <div className="flex items-center gap-2 text-sm text-red-600 font-bold bg-red-50 px-3 py-2 rounded-lg animate-shake">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                    {errors.wordCount.message}
                  </div>
                )}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-700 font-bold">💡 Recommended: 300-1000 words for most essays</p>
                </div>
              </div>

              {/* Tone and Level */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-black text-gray-900">
                    <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <Palette className="w-3 h-3 text-white" />
                    </div>
                    Writing Tone
                  </label>
                  <select 
                    {...register('tone')} 
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all duration-300 font-semibold bg-white text-gray-900 hover:border-pink-300 hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <option value="academic" className="font-semibold">🎓 Academic</option>
                    <option value="formal" className="font-semibold">👔 Formal</option>
                    <option value="informal" className="font-semibold">💬 Conversational</option>
                    <option value="persuasive" className="font-semibold">🎯 Persuasive</option>
                    <option value="creative" className="font-semibold">🎨 Creative</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-black text-gray-900">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-3 h-3 text-white" />
                    </div>
                    Complexity Level
                  </label>
                  <select 
                    {...register('level')} 
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all duration-300 font-semibold bg-white text-gray-900 hover:border-orange-300 hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <option value="beginner" className="font-semibold">🏫 High School</option>
                    <option value="intermediate" className="font-semibold">🎓 Undergraduate</option>
                    <option value="advanced" className="font-semibold">👨‍🎓 Graduate</option>
                  </select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-6">
                <div className="group relative">
                  <input 
                    type="checkbox" 
                    {...register('outlineFirst')} 
                    className="sr-only"
                  />
                  <div 
                    onClick={() => {
                      const checkbox = document.querySelector('input[name="outlineFirst"]') as HTMLInputElement;
                      checkbox.click();
                    }}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl ${
                      watchedFields.outlineFirst 
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 shadow-lg' 
                        : 'bg-white border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        watchedFields.outlineFirst 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {watchedFields.outlineFirst && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <label className="text-base font-black text-gray-900 cursor-pointer">📋 Generate outline first</label>
                        <p className="text-sm text-gray-600 font-medium mt-1">Create a structured outline before writing</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-900">📚 Citation Style</label>
                  <select 
                    {...register('citations')} 
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-300 font-semibold bg-white text-gray-900 hover:border-indigo-300 hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <option value="none" className="font-semibold">🚫 No citations</option>
                    <option value="apa" className="font-semibold">📖 APA Style</option>
                    <option value="mla" className="font-semibold">📝 MLA Style</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-900">💭 Additional Instructions</label>
                  <textarea
                    {...register('extras')}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all duration-300 resize-none font-semibold placeholder-gray-400 bg-white text-gray-900 hover:border-purple-300 hover:shadow-xl transform hover:-translate-y-0.5"
                    placeholder="✨ Any specific requirements or focus areas..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isFormComplete || isGenerating}
                className="group relative w-full flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-black text-lg rounded-2xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating Your Masterpiece...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6" />
                    ✨ Generate Essay
                    <Zap className="w-5 h-5 animate-pulse" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="group bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            {preview ? (
              <>
                <div className="px-8 py-6 border-b border-gray-100/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">Generated Essay</h2>
                        <p className="text-sm text-gray-600 font-semibold">🎉 Your masterpiece is ready!</p>
                      </div>
                    </div>
                    <button
                      onClick={resetForm}
                      className="px-5 py-3 text-sm text-gray-700 font-bold hover:text-gray-900 border-2 border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      🔄 New Essay
                    </button>

                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm font-bold">
                    <span className="bg-white/80 px-4 py-2 rounded-xl shadow-md border border-emerald-200">
                      📊 ~{preview.essay.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-xl shadow-md border border-emerald-200">
                      🎯 Target: {preview.wordCount}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Outline */}
                  {preview.outline && preview.outline.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-black">📋</span>
                        </div>
                        Essay Outline
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 shadow-xl">
                        <ol className="space-y-4">
                          {preview.outline.map((item, index) => (
                            <li key={index} className="flex gap-5 text-sm group">
                              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg group-hover:scale-110 transition-transform duration-200">
                                {index + 1}
                              </span>
                              <span className="text-gray-800 font-bold leading-relaxed group-hover:text-blue-700 transition-colors duration-200">{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {/* Essay Content */}
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-black">📝</span>
                      </div>
                      Essay Content
                    </h3>
                    <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-gray-200 font-medium shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      {preview.essay}
                    </div>
                  </div>
                  <button
  onClick={() => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF();
      const outlineText = preview.outline?.length
        ? "Outline:\n" + preview.outline.map((o, i) => `${i + 1}. ${o}`).join("\n") + "\n\n"
        : "";
      doc.setFontSize(12);
      doc.text(outlineText + preview.essay, 10, 10, { maxWidth: 190 });
      doc.save(`${preview.topic.replace(/\s+/g, "_") || "essay"}.pdf`);
    });
  }}
  className="mt-6 w-full px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
>
  ⬇️ Download as PDF
</button>

                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 via-blue-200 to-purple-200 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">🚀 Ready to Generate</h3>
                  <p className="text-gray-600 max-w-sm font-semibold leading-relaxed">
                    Fill out the configuration form and click <span className="font-black text-violet-600">Generate Essay</span> to create your AI-powered masterpiece! ✨
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}