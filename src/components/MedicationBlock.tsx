import React, { useState } from 'react';
import { Medication, Disease } from '../types';
import { PillViewer3D } from './PillViewer3D';
import { 
  Pill, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Info, 
  Utensils, 
  HeartHandshake, 
  Sparkles
} from 'lucide-react';

interface MedicationBlockProps {
  disease: Disease;
  onPrint?: () => void;
}

export const MedicationBlock: React.FC<MedicationBlockProps> = ({ disease }) => {
  const [selectedMedIndex, setSelectedMedIndex] = useState(0);
  const medications = disease.medications || [];
  const currentMed = medications[selectedMedIndex] || medications[0];

  if (!medications || medications.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-[#E0E5EC] shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 text-center">
        <Pill className="w-8 h-8 text-blue-600 mx-auto mb-2 opacity-70" />
        <h4 className="text-base font-bold text-slate-900">No Specific Medication Required</h4>
        <p className="text-sm text-slate-600 mt-1">This condition is primarily managed through supportive rest, hydration, and non-pharmacological care.</p>
      </div>
    );
  }

  return (
    <section id="medication-treatment-block" className="w-full bg-[#E0E5EC] rounded-3xl p-6 sm:p-8 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-6 relative overflow-hidden">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-5">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Targeted Pharmacotherapy & Therapeutics</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Pill className="w-6 h-6 text-blue-600" />
            <span>Medication & Treatment Guide</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Clinically referenced medications for <span className="text-blue-700 font-semibold">{disease.name}</span>
          </p>
        </div>

        {/* Quick Prescription Type Summary Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DEF7EC] text-emerald-800 shadow-[inset_2px_2px_4px_#b8cfc3,inset_-2px_-2px_4px_#ffffff] border border-emerald-300">
            {medications.filter(m => m.prescriptionType === 'OTC').length} Over-The-Counter (OTC)
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E1EFFE] text-blue-800 shadow-[inset_2px_2px_4px_#b8c8db,inset_-2px_-2px_4px_#ffffff] border border-blue-300">
            {medications.filter(m => m.prescriptionType === 'Prescription').length} Rx Prescription
          </span>
        </div>
      </div>

      {/* Medication Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        {medications.map((med, idx) => {
          const isActive = idx === selectedMedIndex;
          const isOTC = med.prescriptionType === 'OTC';
          return (
            <button
              key={med.id || idx}
              id={`med-tab-${idx}`}
              onClick={() => setSelectedMedIndex(idx)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left min-w-[210px] flex-shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border-blue-400 scale-[1.01]'
                  : 'bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] border-white/50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div
                className="w-4 h-8 rounded-full border border-slate-300 shadow-sm flex-shrink-0"
                style={{
                  background: `linear-gradient(180deg, ${med.pillVisual?.color || '#3b82f6'} 50%, ${med.pillVisual?.secondaryColor || '#e2e8f0'} 50%)`
                }}
              />
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-bold truncate ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>{med.name}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                    isOTC ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {med.prescriptionType}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate font-medium">{med.drugClass}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Selected Medication Detailed Card */}
      {currentMed && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#E0E5EC] rounded-3xl p-5 sm:p-6 shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/50">
          {/* Left Column: 3D Pill Inspector & Quick Facts */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <PillViewer3D medication={currentMed} className="w-full" />

            {/* Brand Names & Generic */}
            <div className="bg-[#E0E5EC] rounded-2xl p-4 shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Generic Name:</span>
                <span className="font-mono font-bold text-blue-700">{currentMed.genericName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Popular Brands:</span>
                <span className="font-bold text-slate-800">{currentMed.brandNames?.join(', ') || 'Various'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Drug Class:</span>
                <span className="font-bold text-purple-700">{currentMed.drugClass}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-300">
                <span className="text-slate-500 font-medium">Access:</span>
                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                  currentMed.prescriptionType === 'OTC' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentMed.prescriptionType === 'OTC' ? 'Available Over-The-Counter' : 'Requires Doctor Prescription (Rx)'}
                </span>
              </div>
            </div>

            {/* Timing & Administration Tips */}
            <div className="bg-[#E1EFFE] rounded-2xl p-4 shadow-[4px_4px_8px_#b8c8db,-4px_-4px_8px_#ffffff] border border-blue-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-900">Administration Rule</p>
                <p className="text-xs text-blue-950 mt-0.5 font-medium">{currentMed.timingInstructions || 'Take with a full glass of water as directed.'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: In-Depth Clinical & Dosage Guidance */}
          <div className="lg:col-span-7 flex flex-col space-y-4 justify-between">
            <div className="space-y-4">
              {/* Primary Purpose & Mechanism */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentMed.name}</span>
                  <span className="text-xs font-normal text-slate-500 font-mono">({currentMed.genericName})</span>
                </h4>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed font-medium">{currentMed.purpose}</p>
              </div>

              {/* How it works in simple terms */}
              <div className="bg-[#E0E5EC] rounded-2xl p-4 shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>How This Medicine Works in Your Body</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{currentMed.mechanismOfAction}</p>
              </div>

              {/* Dosage & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Typical Dosage</span>
                  <p className="text-sm font-bold text-slate-900">{currentMed.typicalDosage}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{currentMed.frequency}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Course Duration</span>
                  <p className="text-sm font-bold text-blue-700">{currentMed.duration}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Follow prescribed duration strictly</p>
                </div>
              </div>

              {/* Side Effects & Serious Warnings */}
              <div className="space-y-3">
                {currentMed.commonSideEffects && currentMed.commonSideEffects.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-600 block mb-1.5">Common Mild Side Effects:</span>
                    <div className="flex flex-wrap gap-2">
                      {currentMed.commonSideEffects.map((effect, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-xl bg-[#E0E5EC] text-slate-700 shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] border border-white/50 font-medium">
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentMed.seriousWarnings && currentMed.seriousWarnings.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FDE8E8] shadow-[4px_4px_8px_#d1b0b0,-4px_-4px_8px_#ffffff] border border-rose-200 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-rose-900">Important Safety Caution</p>
                      <ul className="text-xs text-rose-950 list-disc list-inside mt-0.5 space-y-0.5 font-medium">
                        {currentMed.seriousWarnings.map((warning, i) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Contraindications / Avoid if... */}
                {currentMed.contraindications && currentMed.contraindications.length > 0 && (
                  <div className="text-xs text-slate-600 flex items-start gap-2 pt-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800">Avoid if:</strong> {currentMed.contraindications.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Non-Pharmacological, Home Remedies & Dietary Protocol */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Home & Supportive Remedies */}
        <div className="p-5 rounded-3xl bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/70 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Home Remedies & Supportive Care</span>
          </h4>
          <ul className="space-y-2.5">
            {disease.homeRemedies?.map((remedy, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{remedy}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dietary Recommendations */}
        <div className="p-5 rounded-3xl bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/70 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Dietary Nutrition Protocol</span>
          </h4>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-emerald-700 font-bold flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3" /> Beneficial Foods:
              </span>
              <p className="text-slate-700 font-medium">{disease.dietaryAdvice?.recommended?.join(', ') || 'Balanced whole foods diet, ample hydration'}</p>
            </div>
            <div className="pt-2 border-t border-slate-300">
              <span className="text-rose-700 font-bold flex items-center gap-1 mb-1">
                <XCircle className="w-3 h-3" /> Foods to Avoid / Restrict:
              </span>
              <p className="text-slate-700 font-medium">{disease.dietaryAdvice?.avoid?.join(', ') || 'Highly processed foods, excess refined sugars'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Medical Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-amber-300/60 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong className="text-amber-800 font-bold">Medical Safety Disclaimer:</strong> This medication information is provided for educational reference and clinical literacy only. It does not replace direct professional medical diagnosis or a physical prescription. Always consult a licensed medical doctor or certified pharmacist before starting, changing, or discontinuing any medication.
        </p>
      </div>
    </section>
  );
};
