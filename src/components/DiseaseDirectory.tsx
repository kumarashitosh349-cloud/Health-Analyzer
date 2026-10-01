import React, { useState } from 'react';
import { Disease } from '../types';
import { SAMPLE_DISEASES } from '../data/sampleDiseases';
import { Search, Sparkles, BookOpen, ChevronRight, Activity, Filter, Pill } from 'lucide-react';

interface DiseaseDirectoryProps {
  onSelectDisease: (disease: Disease) => void;
  onExploreCustomQuery: (query: string) => void;
  isExploring: boolean;
}

export const DiseaseDirectory: React.FC<DiseaseDirectoryProps> = ({
  onSelectDisease,
  onExploreCustomQuery,
  isExploring
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Gastroenterology', 'Neurology', 'Pulmonology', 'Endocrinology', 'Cardiology', 'Dermatology'];

  const filteredDiseases = SAMPLE_DISEASES.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.medicalTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.simpleSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.medications.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onExploreCustomQuery(searchQuery.trim());
  };

  return (
    <div id="disease-directory-section" className="space-y-6">
      {/* Search & Custom AI Prompt Bar */}
      <div className="bg-[#E0E5EC] rounded-3xl p-6 sm:p-7 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>3D Disease & Medication Encyclopedia</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Explore simplified visual explanations and targeted pharmaceutical treatments for any condition
            </p>
          </div>

          <span className="text-xs text-blue-700 font-mono font-bold bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] px-3 py-1 rounded-full border border-white/40">
            Gemini 3.7 Medical Knowledge Base
          </span>
        </div>

        {/* Search input */}
        <form onSubmit={handleCustomSearchSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              id="input-disease-search"
              type="text"
              placeholder="Search or ask AI about any disease (e.g. Hypertension, Pneumonia, Eczema, Sciatica, Strep Throat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
            />
          </div>
          <button
            id="btn-ai-explain-custom"
            type="submit"
            disabled={isExploring || !searchQuery.trim()}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(37,99,235,0.35)]"
          >
            {isExploring ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>AI Deep Dive</span>
          </button>
        </form>

        {/* Categories Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_2px_8px_rgba(37,99,235,0.35)]'
                  : 'bg-[#E0E5EC] text-slate-600 border-white/50 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#b8b9be,-1px_-1px_3px_#ffffff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
            id={`disease-card-${disease.id}`}
            onClick={() => onSelectDisease(disease)}
            className="p-6 rounded-3xl bg-[#E0E5EC] shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/70 transition flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase bg-[#E0E5EC] shadow-[inset_1px_1px_2px_#b8b9be,inset_-1px_-1px_2px_#ffffff] text-blue-700 border border-white/40">
                  {disease.category}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {disease.severity}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center justify-between">
                  <span>{disease.name}</span>
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{disease.medicalTerm}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                {disease.simpleSummary}
              </p>

              {/* Pill Preview Badge List */}
              <div className="pt-2 border-t border-slate-300 flex items-center gap-1.5 flex-wrap">
                <Pill className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="text-[11px] text-slate-500 font-bold">Meds:</span>
                {disease.medications.slice(0, 2).map((m, i) => (
                  <span key={i} className="text-[11px] font-bold text-slate-700 px-2 py-0.5 rounded-lg bg-[#E0E5EC] shadow-[inset_1px_1px_2px_#b8b9be,inset_-1px_-1px_2px_#ffffff] border border-white/40">
                    {m.name}
                  </span>
                ))}
                {disease.medications.length > 2 && (
                  <span className="text-[10px] text-slate-500 font-bold">+{disease.medications.length - 2} more</span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-xs text-blue-600 font-bold">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>3D Diagnosis & Treatment</span>
              </span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
