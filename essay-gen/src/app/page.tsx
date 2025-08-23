'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { CheckCircle2, FileText, Loader2, Settings, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Essay Generator</h1>
              <p className="text-sm text-gray-600">Create professional essays with AI assistance</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {activeStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Configure</span>
              </div>
              <div className={`w-16 h-1 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">Generate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Essay Configuration</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Fill in the details to generate your essay</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Topic Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Essay Topic
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register('topic', { required: 'Topic is required' })}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.topic ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Climate change and its global impact"
                />
                {errors.topic && (
                  <p className="text-sm text-red-600">{errors.topic.message}</p>
                )}
              </div>

              {/* Word Count */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Word Count
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  {...register('wordCount', { 
                    required: 'Word count is required',
                    min: { value: 100, message: 'Minimum 100 words' },
                    max: { value: 5000, message: 'Maximum 5000 words' }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.wordCount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="500"
                />
                {errors.wordCount && (
                  <p className="text-sm text-red-600">{errors.wordCount.message}</p>
                )}
                <p className="text-xs text-gray-500">Recommended: 300-1000 words for most essays</p>
              </div>

              {/* Tone and Level */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Writing Tone</label>
                  <select 
                    {...register('tone')} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="academic">Academic</option>
                    <option value="formal">Formal</option>
                    <option value="informal">Conversational</option>
                    <option value="persuasive">Persuasive</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Complexity Level</label>
                  <select 
                    {...register('level')} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="beginner">High School</option>
                    <option value="intermediate">Undergraduate</option>
                    <option value="advanced">Graduate</option>
                  </select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    {...register('outlineFirst')} 
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-900">Generate outline first</label>
                    <p className="text-xs text-gray-500">Create a structured outline before writing</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Citation Style</label>
                  <select 
                    {...register('citations')} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="none">No citations</option>
                    <option value="apa">APA Style</option>
                    <option value="mla">MLA Style</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Additional Instructions</label>
                  <textarea
                    {...register('extras')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Any specific requirements or focus areas..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isFormComplete || isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {preview ? (
              <>
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Generated Essay</h2>
                    </div>
                    <button
                      onClick={resetForm}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      New Essay
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>~{preview.essay.split(/\s+/).filter(Boolean).length} words</span>
                    <span>•</span>
                    <span>Target: {preview.wordCount}</span>
                  </div>
                </div>
                
                <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Outline */}
                  {preview.outline && preview.outline.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-md font-semibold text-gray-900 mb-3">Essay Outline</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <ol className="space-y-2">
                          {preview.outline.map((item, index) => (
                            <li key={index} className="flex gap-3 text-sm">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {/* Essay Content */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Essay Content</h3>
                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {preview.essay}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
                  <p className="text-gray-600 max-w-sm">
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