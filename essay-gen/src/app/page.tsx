'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { CheckCircle2, FileText, Loader2, Settings, Sparkles, BookOpen, Target, Palette, GraduationCap, Zap, Star, Wand2, Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Professional PDF generation function with Material Design principles
  const generatePDF = async () => {
    if (!preview) return;

    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      let currentY = margin;

      // Header with Material Design styling
      doc.setFillColor(103, 58, 183); // Material Purple 500
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(preview.topic, contentWidth - 20);
      doc.text(titleLines, margin + 10, 25);
      
      // Subtitle
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('AI Generated Essay', margin + 10, 40);

      // Essay metadata
      doc.setFontSize(10);
      const metadata = `${preview.tone.charAt(0).toUpperCase() + preview.tone.slice(1)} • ${preview.level.charAt(0).toUpperCase() + preview.level.slice(1)} Level • ${preview.essay.split(/\s+/).filter(Boolean).length} words`;
      doc.text(metadata, margin + 10, 50);

      currentY = 80; // Start content after header

      // Add outline if exists
      if (preview.outline && preview.outline.length > 0) {
        // Outline header
        doc.setTextColor(63, 81, 181); // Material Indigo 500
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Essay Outline', margin, currentY);
        currentY += 15;

        // Outline content
        doc.setTextColor(66, 66, 66);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        preview.outline.forEach((item, index) => {
          if (currentY > pageHeight - 40) {
            doc.addPage();
            currentY = margin;
          }
          
          const outlineText = `${index + 1}. ${item}`;
          const outlineLines = doc.splitTextToSize(outlineText, contentWidth - 10);
          doc.text(outlineLines, margin + 5, currentY);
          currentY += outlineLines.length * 6;
        });
        
        currentY += 15; // Space after outline
      }

      // Essay content header
      if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = margin;
      }

      doc.setTextColor(63, 81, 181); // Material Indigo 500
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Essay Content', margin, currentY);
      currentY += 15;

      // Essay body
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const paragraphs = preview.essay.split('\n\n');
      
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          const lines = doc.splitTextToSize(paragraph.trim(), contentWidth);
          
          // Check if we need a new page
          if (currentY + (lines.length * 6) > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
          }
          
          doc.text(lines, margin, currentY);
          currentY += lines.length * 6 + 8; // Line height + paragraph spacing
        }
      });

      // Footer on last page
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(224, 224, 224);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
        
        // Footer text
        doc.setTextColor(117, 117, 117);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        const date = new Date().toLocaleDateString();
        doc.text(`Generated on ${date}`, margin, pageHeight - 15);
        
        const pageText = `Page ${i} of ${totalPages}`;
        const pageTextWidth = doc.getTextWidth(pageText);
        doc.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 15);
      }

      // Save the PDF
      const fileName = preview.topic.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50) || 'essay';
      doc.save(`${fileName}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to simple text download
      const content = `${preview.topic}\n\n${preview.outline?.map((item, i) => `${i + 1}. ${item}`).join('\n') || ''}\n\n${preview.essay}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${preview.topic.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'essay'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
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

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-6">
              <div className="relative">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 tracking-tight">
                  AI Essay Generator
                </h1>
                <p className="text-xs lg:text-base text-gray-600 font-semibold mt-1 hidden sm:block">
                  Create professional essays with AI assistance
                </p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full border border-emerald-200">
                  <Star className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">Premium Quality</span>
                </div>
              </div>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 animate-in slide-in-from-top-5 duration-300">
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 rounded-xl border border-emerald-200">
                  <Star className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">Premium Quality</span>
                </div>
                <p className="text-sm text-gray-600 font-semibold px-2">
                  Create professional essays with AI assistance
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content with responsive top padding */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 pt-24 lg:pt-40">
        {/* Progress Steps - Responsive */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 lg:space-x-8">
              <div className={`flex items-center transition-all duration-500 ${activeStep >= 1 ? 'text-violet-600' : 'text-gray-400'}`}>
                <div className={`relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center text-sm font-black shadow-xl transition-all duration-500 transform ${
                  activeStep >= 1 ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white scale-110' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {activeStep > 1 ? <CheckCircle2 className="w-5 h-5 lg:w-7 lg:h-7" /> : '1'}
                  {activeStep >= 1 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl lg:rounded-2xl opacity-20 animate-pulse"></div>
                  )}
                </div>
                <span className="ml-2 lg:ml-4 text-sm lg:text-base font-black">Configure</span>
              </div>
              <div className={`w-16 lg:w-24 h-1 lg:h-2 rounded-full transition-all duration-1000 ${activeStep >= 2 ? 'bg-gradient-to-r from-violet-500 to-purple-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center transition-all duration-500 ${activeStep >= 2 ? 'text-violet-600' : 'text-gray-400'}`}>
                <div className={`relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center text-sm font-black shadow-xl transition-all duration-500 transform ${
                  activeStep >= 2 ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white scale-110' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {isGenerating ? <Loader2 className="w-5 h-5 lg:w-7 lg:h-7 animate-spin" /> : '2'}
                  {activeStep >= 2 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl lg:rounded-2xl opacity-20 animate-pulse"></div>
                  )}
                </div>
                <span className="ml-2 lg:ml-4 text-sm lg:text-base font-black">Generate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Configuration Panel */}
          <div className="group bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="px-6 lg:px-8 py-4 lg:py-6 border-b border-gray-100/80 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 rounded-t-2xl lg:rounded-t-3xl">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-black text-gray-900">Essay Configuration</h2>
                  <p className="text-xs lg:text-sm text-gray-600 font-semibold mt-1">Fill in the details to generate your masterpiece</p>
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8 space-y-6 lg:space-y-8">
              {/* Topic Input */}
              <div className="space-y-3 lg:space-y-4 group">
                <label className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md lg:rounded-lg flex items-center justify-center">
                    <BookOpen className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                  </div>
                  Essay Topic
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('topic', { required: 'Topic is required' })}
                  className={`w-full px-4 lg:px-5 py-3 lg:py-4 border-2 rounded-xl lg:rounded-2xl shadow-lg focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all duration-300 font-medium placeholder-gray-400 bg-white text-gray-900 hover:shadow-xl transform hover:-translate-y-0.5 ${
                    errors.topic ? 'border-red-400 bg-red-50 ring-4 ring-red-100' : 'border-gray-200 hover:border-violet-300'
                  }`}
                  placeholder="e.g., Climate change and its global impact"
                />
                {errors.topic && (
                  <div className="flex items-center gap-2 text-sm text-red-600 font-bold bg-red-50 px-3 py-2 rounded-lg animate-shake">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                    {errors.topic.message}
                  </div>
                )}
              </div>

              {/* Word Count */}
              <div className="space-y-3 lg:space-y-4">
                <label className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md lg:rounded-lg flex items-center justify-center">
                    <Target className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
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
                  className={`w-full px-4 lg:px-5 py-3 lg:py-4 border-2 rounded-xl lg:rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 font-medium placeholder-gray-400 bg-white text-gray-900 hover:shadow-xl transform hover:-translate-y-0.5 ${
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
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-700 font-bold">Recommended: 300-1000 words for most essays</p>
                </div>
              </div>

              {/* Tone and Level - Stacked on mobile, side by side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-3 lg:space-y-4">
                  <label className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-md lg:rounded-lg flex items-center justify-center">
                      <Palette className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                    </div>
                    Writing Tone
                  </label>
                  <div className="relative">
                    <select 
                      {...register('tone')} 
                      className="w-full px-4 lg:px-5 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl shadow-lg focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all duration-300 font-medium bg-white text-gray-900 hover:border-pink-300 hover:shadow-xl transform hover:-translate-y-0.5 appearance-none cursor-pointer"
                    >
                      <option value="academic" className="font-medium py-2">📚 Academic</option>
                      <option value="formal" className="font-medium py-2">👔 Formal</option>
                      <option value="informal" className="font-medium py-2">💬 Conversational</option>
                      <option value="persuasive" className="font-medium py-2">🎯 Persuasive</option>
                      <option value="creative" className="font-medium py-2">🎨 Creative</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 lg:pr-4 pointer-events-none">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-md lg:rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <label className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-md lg:rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                    </div>
                    Complexity Level
                  </label>
                  <div className="relative">
                    <select 
                      {...register('level')} 
                      className="w-full px-4 lg:px-5 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl shadow-lg focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all duration-300 font-medium bg-white text-gray-900 hover:border-orange-300 hover:shadow-xl transform hover:-translate-y-0.5 appearance-none cursor-pointer"
                    >
                      <option value="beginner" className="font-medium py-2">🎓 High School</option>
                      <option value="intermediate" className="font-medium py-2">🏛️ Undergraduate</option>
                      <option value="advanced" className="font-medium py-2">🎖️ Graduate</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 lg:pr-4 pointer-events-none">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-md lg:rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-5 lg:space-y-6">
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
                    className={`cursor-pointer p-4 lg:p-5 rounded-xl lg:rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl ${
                      watchedFields.outlineFirst 
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 shadow-lg' 
                        : 'bg-white border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3 lg:space-x-4">
                      <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-md lg:rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        watchedFields.outlineFirst 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {watchedFields.outlineFirst && <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4 text-white" />}
                      </div>
                      <div>
                        <label className="text-sm lg:text-base font-black text-gray-900 cursor-pointer">Generate outline first</label>
                        <p className="text-xs lg:text-sm text-gray-600 font-medium mt-1">Create a structured outline before writing</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <label className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md lg:rounded-lg flex items-center justify-center">
                      <FileText className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                    </div>
                    Citation Style
                  </label>
                  <div className="relative">
                    <select 
                      {...register('citations')} 
                      className="w-full px-4 lg:px-5 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl shadow-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-300 font-medium bg-white text-gray-900 hover:border-indigo-300 hover:shadow-xl transform hover:-translate-y-0.5 appearance-none cursor-pointer"
                    >
                      <option value="none" className="font-medium py-2">No citations</option>
                      <option value="apa" className="font-medium py-2">APA Style</option>
                      <option value="mla" className="font-medium py-2">MLA Style</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 lg:pr-4 pointer-events-none">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-md lg:rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <label className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md lg:rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">✏️</span>
                    </div>
                    Additional Instructions
                  </label>
                  <textarea
                    {...register('extras')}
                    className="w-full px-4 lg:px-5 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all duration-300 resize-none font-medium placeholder-gray-400 bg-white text-gray-900 hover:border-purple-300 hover:shadow-xl transform hover:-translate-y-0.5"
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
                className="group relative w-full flex items-center justify-center gap-3 lg:gap-4 px-6 lg:px-8 py-4 lg:py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-black text-base lg:text-lg rounded-xl lg:rounded-2xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" />
                    <span className="text-sm lg:text-lg">Generating Your Masterpiece...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 lg:w-6 lg:h-6" />
                    <span className="text-sm lg:text-lg">Generate Essay</span>
                    <Zap className="w-4 h-4 lg:w-5 lg:h-5 animate-pulse" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="group bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            {preview ? (
              <>
                <div className="px-6 lg:px-8 py-4 lg:py-6 border-b border-gray-100/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-t-2xl lg:rounded-t-3xl">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-black text-gray-900">Generated Essay</h2>
                        <p className="text-xs lg:text-sm text-gray-600 font-semibold">Your masterpiece is ready!</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-3">
                      <button
                        onClick={generatePDF}
                        className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
                        title="Download as PDF"
                      >
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-4 lg:px-5 py-2 lg:py-3 text-sm text-gray-700 font-bold hover:text-gray-900 border-2 border-gray-200 rounded-lg lg:rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        New Essay
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4 mt-4 text-sm lg:text-base font-black">
                    <span className="bg-white px-4 lg:px-5 py-2 lg:py-3 rounded-lg lg:rounded-xl shadow-lg border-2 border-emerald-300 text-gray-800">
                      ~{preview.essay.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span className="text-gray-500 text-xl hidden sm:block">•</span>
                    <span className="bg-gradient-to-r from-emerald-100 to-teal-100 px-4 lg:px-5 py-2 lg:py-3 rounded-lg lg:rounded-xl shadow-lg border-2 border-emerald-300 text-gray-800">
                      Target: {preview.wordCount}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 lg:p-8 max-h-[60vh] lg:max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Outline */}
                  {preview.outline && preview.outline.length > 0 && (
                    <div className="mb-8 lg:mb-10">
                      <h3 className="text-lg lg:text-xl font-black text-gray-900 mb-4 lg:mb-6 flex items-center gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md lg:rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs lg:text-sm font-black">📋</span>
                        </div>
                        Essay Outline
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl lg:rounded-2xl p-6 lg:p-8 border-2 border-blue-200 shadow-xl">
                        <ol className="space-y-3 lg:space-y-4">
                          {preview.outline.map((item, index) => (
                            <li key={index} className="flex gap-3 lg:gap-5 text-sm group">
                              <span className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg group-hover:scale-110 transition-transform duration-200">
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
                    <h3 className="text-lg lg:text-xl font-black text-gray-900 mb-4 lg:mb-6 flex items-center gap-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md lg:rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs lg:text-sm font-black">📝</span>
                      </div>
                      Essay Content
                    </h3>
                    <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap bg-gradient-to-br from-gray-50 to-blue-50 p-6 lg:p-8 rounded-xl lg:rounded-2xl border-2 border-gray-200 font-medium shadow-xl hover:shadow-2xl transition-shadow duration-300 text-sm lg:text-base">
                      {preview.essay}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 lg:h-96">
                <div className="text-center">
                  <div className="relative mb-6 lg:mb-8">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-200 via-blue-200 to-purple-200 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <FileText className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-3 lg:mb-4">Ready to Generate</h3>
                  <p className="text-gray-600 max-w-sm font-semibold leading-relaxed text-sm lg:text-base px-4">
                    Fill out the configuration form and click <span className="font-black text-violet-600">Generate Essay</span> to create your AI-powered masterpiece!
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