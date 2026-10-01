import React, { useState } from 'react';
import { Disease } from '../types';
import { 
  Lightbulb, 
  BookOpen, 
  Layers, 
  AlertOctagon, 
  Volume2, 
  VolumeX, 
  Stethoscope, 
  Sparkles, 
  Activity,
  Zap
} from 'lucide-react';

interface DiseaseExplainerProps {
  disease: Disease;
}

export const DiseaseExplainer: React.FC<DiseaseExplainerProps> = ({ disease }) => {
  const [explanationMode, setExplanationMode] = useState<'plain' | 'clinical'>('plain');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${disease.name}. ${disease.simpleSummary}. Here is an everyday analogy: ${disease.everydayAnalogy}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Mild':
        return 'bg-[#DEF7EC] text-emerald-800 shadow-[inset_2px_2px_4px_#b8cfc3,inset_-2px_-2px_4px_#ffffff] border border-emerald-300';
      case 'Moderate':
        return 'bg-[#FEF08A] text-amber-900 shadow-[inset_2px_2px_4px_#d4c572,inset_-2px_-2px_4px_#ffffff] border border-amber-300';
      case 'Severe':
        return 'bg-[#FED7AA] text-orange-900 shadow-[inset_2px_2px_4px_#d6b085,inset_-2px_-2px_4px_#ffffff] border border-orange-300';
      case 'Critical / Emergency':
        return 'bg-[#FEE2E2] text-rose-900 shadow-[inset_2px_2px_4px_#d9b8b8,inset_-2px_-2px_4px_#ffffff] border border-rose-300 animate-pulse';
      default:
        return 'bg-[#E0E5EC] text-slate-700 shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40';
    }
  };

  return (
    <div id={`disease-explainer-${disease.id}`} className="space-y-6">
      {/* Top Header & Plain-English Switcher */}
      <div className="bg-[#E0E5EC] rounded-3xl p-6 sm:p-7 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadge(disease.severity)}`}>
                {disease.severity} Severity
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E0E5EC] text-slate-700 shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40">
                {disease.category}
              </span>
              {disease.icdCode && (
                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono text-blue-700 bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40">
                  ICD: {disease.icdCode}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>{disease.name}</span>
            </h2>
            <p className="text-sm text-slate-500 font-mono mt-0.5">Clinical Term: {disease.medicalTerm}</p>
          </div>

          {/* Mode Toggle & Audio Narration */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Audio Reader */}
            <button
              id="btn-voice-read"
              onClick={handleToggleSpeech}
              className={`p-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold transition ${
                isSpeaking
                  ? 'bg-blue-600 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(37,99,235,0.35)] animate-pulse'
                  : 'bg-[#E0E5EC] text-slate-700 shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/50'
              }`}
              title="Listen to Plain English Narration"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>

            {/* Plain English vs Clinical Mode */}
            <div className="flex items-center bg-[#E0E5EC] p-1 rounded-2xl shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/40">
              <button
                id="btn-mode-plain"
                onClick={() => setExplanationMode('plain')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  explanationMode === 'plain'
                    ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Simple English</span>
              </button>
              <button
                id="btn-mode-clinical"
                onClick={() => setExplanationMode('clinical')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  explanationMode === 'clinical'
                    ? 'bg-purple-600 text-white shadow-[0_2px_8px_rgba(147,51,234,0.35)]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Clinical Depth</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plain Language Summary vs Clinical Breakdown */}
        <div className="mt-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>In Simple Terms:</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              {disease.simpleSummary}
            </p>
          </div>

          {/* Everyday Analogy Card (The Visual Metaphor) */}
          {disease.everydayAnalogy && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#E1EFFE] shadow-[6px_6px_12px_#b8c8db,-6px_-6px_12px_#ffffff] border border-blue-200/80 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-white shadow-[2px_2px_5px_#b8c8db,-2px_-2px_5px_#ffffff] flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-600">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Visual Real-World Analogy:
                </h4>
                <p className="text-xs sm:text-sm text-blue-950 mt-1 italic leading-relaxed font-medium">
                  "{disease.everydayAnalogy}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Biological Mechanism: "What's Happening Inside Your Body" */}
      {disease.whatHappensInside && disease.whatHappensInside.length > 0 && (
        <div className="bg-[#E0E5EC] rounded-3xl p-6 sm:p-7 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>What Happens Inside Your Body (Step-by-Step)</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono font-semibold">Pathophysiology Made Easy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {disease.whatHappensInside.map((item) => (
              <div
                key={item.step}
                className="relative p-5 rounded-2xl bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/60 flex flex-col justify-between hover:shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] text-blue-700 flex items-center justify-center text-xs font-bold font-mono border border-white/30">
                      0{item.step}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">Phase {item.step}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Symptoms & Triggers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className="bg-[#E0E5EC] rounded-3xl p-6 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Classic Signs & Symptoms</span>
          </h3>
          <ul className="space-y-2.5">
            {disease.commonSymptoms.map((sym, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                <span className="font-medium">{sym}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Triggers & Root Causes */}
        <div className="bg-[#E0E5EC] rounded-3xl p-6 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Common Triggers & Risk Factors</span>
          </h3>
          <ul className="space-y-2.5">
            {disease.triggersAndCauses.map((trigger, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                <span className="font-medium">{trigger}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Red Flags & Recommended Specialist Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Emergency Red Flags */}
        <div className="md:col-span-8 p-6 rounded-3xl bg-[#FDE8E8] shadow-[8px_8px_16px_#d1b0b0,-8px_-8px_16px_#ffffff] border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertOctagon className="w-5 h-5 animate-pulse flex-shrink-0 text-rose-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-900">
              Emergency Warning Signs (Seek ER Care Immediately)
            </h3>
          </div>
          <p className="text-xs text-rose-800">
            Do not wait for regular doctor hours if you or a family member experience any of the following:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {disease.emergencyRedFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-rose-950 bg-white/70 p-2.5 rounded-xl shadow-[inset_1px_1px_3px_#e5baba] border border-rose-200 font-medium">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Specialist Doctor */}
        <div className="md:col-span-4 p-6 rounded-3xl bg-[#E0E5EC] shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Recommended Specialist</span>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60 flex items-center justify-center text-blue-600">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{disease.recommendedSpecialist || 'General Physician'}</h4>
                <p className="text-xs text-slate-500 font-medium">Primary Care or Sub-Specialist</p>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-600 bg-[#E0E5EC] p-3 rounded-2xl shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40">
            Schedule a routine appointment if symptoms persist for more than 48-72 hours.
          </div>
        </div>
      </div>
    </div>
  );
};
