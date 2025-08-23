'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { CheckCircle2, FileText, Loader2, Settings, Sparkles, BookOpen, Target, Palette, GraduationCap } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Essay Generator</h1>
              <p className="text-sm text-gray-600 font-medium">Create professional essays with AI assistance</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-6">
              <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-lg transition-all duration-300 ${
                  activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {activeStep > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
                </div>
                <span className="ml-3 text-sm font-semibold">Configure</span>
              </div>
              <div className={`w-20 h-1 rounded-full transition-all duration-500 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-lg transition-all duration-300 ${
                  activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : '2'}
                </div>
                <span className="ml-3 text-sm font-semibold">Generate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60">
            <div className="px-8 py-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Essay Configuration</h2>
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">Fill in the details to generate your essay</p>
            </div>

            <div className="p-8 space-y-8">
              {/* Topic Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Essay Topic
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('topic', { required: 'Topic is required' })}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 font-semibold placeholder-gray-400 bg-white text-gray-900 ${
                    errors.topic ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300'
                  }`}
                  placeholder="e.g., Climate change and its global impact"
                />
                {errors.topic && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">!</span>
                    {errors.topic.message}
                  </p>
                )}
              </div>

              {/* Word Count */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Target className="w-4 h-4 text-blue-600" />
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
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 font-semibold placeholder-gray-400 bg-white text-gray-900 ${
                    errors.wordCount ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-300'
                  }`}
                  placeholder="500"
                />
                {errors.wordCount && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">!</span>
                    {errors.wordCount.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 font-medium bg-blue-50/50 px-3 py-1 rounded-lg">Recommended: 300-1000 words for most essays</p>
              </div>

              {/* Tone and Level */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Palette className="w-4 h-4 text-blue-600" />
                    Writing Tone
                  </label>
                  <select 
                    {...register('tone')} 
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 font-semibold bg-white text-gray-900 hover:border-blue-300"
                  >
                    <option value="academic" className="font-semibold">Academic</option>
                    <option value="formal" className="font-semibold">Formal</option>
                    <option value="informal" className="font-semibold">Conversational</option>
                    <option value="persuasive" className="font-semibold">Persuasive</option>
                    <option value="creative" className="font-semibold">Creative</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Complexity Level
                  </label>
                  <select 
                    {...register('level')} 
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 font-semibold bg-white text-gray-900 hover:border-blue-300"
                  >
                    <option value="beginner" className="font-semibold">High School</option>
                    <option value="intermediate" className="font-semibold">Undergraduate</option>
                    <option value="advanced" className="font-semibold">Graduate</option>
                  </select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <input 
                    type="checkbox" 
                    {...register('outlineFirst')} 
                    className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <label className="text-sm font-semibold text-gray-900">Generate outline first</label>
                    <p className="text-xs text-gray-600 font-medium mt-1">Create a structured outline before writing</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Citation Style</label>
                  <select 
                    {...register('citations')} 
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 font-semibold bg-white text-gray-900 hover:border-blue-300"
                  >
                    <option value="none" className="font-semibold">No citations</option>
                    <option value="apa" className="font-semibold">APA Style</option>
                    <option value="mla" className="font-semibold">MLA Style</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Additional Instructions</label>
                  <textarea
                    {...register('extras')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 resize-none font-semibold placeholder-gray-400 bg-white text-gray-900 hover:border-blue-300"
                    placeholder="Any specific requirements or focus areas..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isFormComplete || isGenerating}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Essay...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Essay
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60">
            {preview ? (
              <>
                <div className="px-8 py-6 border-b border-gray-200/60 bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-green-600" />
                      <h2 className="text-xl font-bold text-gray-900">Generated Essay</h2>
                    </div>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-sm text-gray-700 font-semibold hover:text-gray-900 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      New Essay
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 font-medium">
                    <span className="bg-white/70 px-3 py-1 rounded-lg">~{preview.essay.split(/\s+/).filter(Boolean).length} words</span>
                    <span>•</span>
                    <span className="bg-blue-100/70 px-3 py-1 rounded-lg">Target: {preview.wordCount}</span>
                  </div>
                </div>
                
                <div className="p-8 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Outline */}
                  {preview.outline && preview.outline.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Essay Outline</h3>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <ol className="space-y-3">
                          {preview.outline.map((item, index) => (
                            <li key={index} className="flex gap-4 text-sm">
                              <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                                {index + 1}
                              </span>
                              <span className="text-gray-800 font-medium leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {/* Essay Content */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Essay Content</h3>
                    <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap bg-gray-50/50 p-6 rounded-xl border border-gray-200 font-medium">
                      {preview.essay}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to Generate</h3>
                  <p className="text-gray-600 max-w-sm font-medium leading-relaxed">
                    Fill out the configuration form and click Generate Essay to create your AI-powered essay.
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