import React, { useState } from 'react';
import { Pill, ShieldCheck, ShieldAlert, Sparkles, Plus, X, ArrowRight, AlertTriangle } from 'lucide-react';

interface InteractionResult {
  riskLevel: 'None / Low' | 'Moderate Caution' | 'Severe Contraindication';
  summary: string;
  mechanism: string;
  recommendation: string;
  foodInteractions: string[];
}

export const MedicationChecker: React.FC = () => {
  const [drugList, setDrugList] = useState<string[]>(['Omeprazole', 'Naproxen']);
  const [newDrug, setNewDrug] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InteractionResult | null>({
    riskLevel: 'Moderate Caution',
    summary: 'Combining NSAIDs (Naproxen) with PPIs (Omeprazole) is often clinically done to protect the stomach, but prolonged use may reduce magnesium levels and impact renal blood flow.',
    mechanism: 'Omeprazole alters gastric pH which slightly delays the dissolution rate of enteric-coated NSAIDs. Both drugs undergo partial hepatic metabolism via CYP2C19/CYP2C9.',
    recommendation: 'Take naproxen with food. Maintain regular hydration and monitor for any swelling or blood pressure changes.',
    foodInteractions: ['Avoid heavy alcohol consumption which drastically multiplies gastrointestinal bleeding risk.', 'Avoid taking with grapefruit juice.']
  });

  const handleAddDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDrug.trim() && !drugList.includes(newDrug.trim())) {
      setDrugList([...drugList, newDrug.trim()]);
      setNewDrug('');
    }
  };

  const handleRemoveDrug = (drug: string) => {
    setDrugList(drugList.filter((d) => d !== drug));
  };

  const handleCheckInteractions = async () => {
    if (drugList.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch('/api/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drugs: drugList })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'None / Low':
        return 'bg-[#DEF7EC] text-emerald-800 shadow-[inset_2px_2px_4px_#b8cfc3,inset_-2px_-2px_4px_#ffffff] border border-emerald-300';
      case 'Moderate Caution':
        return 'bg-[#FEF08A] text-amber-900 shadow-[inset_2px_2px_4px_#d4c572,inset_-2px_-2px_4px_#ffffff] border border-amber-300';
      case 'Severe Contraindication':
        return 'bg-[#FEE2E2] text-rose-900 shadow-[inset_2px_2px_4px_#d9b8b8,inset_-2px_-2px_4px_#ffffff] border border-rose-300 animate-pulse';
      default:
        return 'bg-[#E0E5EC] text-slate-700 shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40';
    }
  };

  return (
    <div id="medication-checker-section" className="bg-[#E0E5EC] rounded-3xl p-6 sm:p-8 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Drug Safety & Contraindications Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Drug-to-Drug Interaction Analyzer</h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Add 2 or more medicines to check pharmacological compatibility and timing precautions
          </p>
        </div>
      </div>

      {/* Drug Input & Tag List */}
      <div className="space-y-3">
        <form onSubmit={handleAddDrug} className="flex gap-2.5">
          <input
            id="input-add-drug-checker"
            type="text"
            placeholder="Add medication (e.g. Aspirin, Metformin, Lisinopril, Albuterol)..."
            value={newDrug}
            onChange={(e) => setNewDrug(e.target.value)}
            className="flex-1 bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-[#E0E5EC] hover:bg-[#d8dde4] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] text-slate-800 text-xs font-bold border border-white/60 transition"
          >
            Add Drug
          </button>
        </form>

        {/* Selected Drugs Chips */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {drugList.map((drug) => (
            <span
              key={drug}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E0E5EC] text-slate-800 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60 text-xs font-bold"
            >
              <Pill className="w-3.5 h-3.5 text-blue-600" />
              <span>{drug}</span>
              <button
                onClick={() => handleRemoveDrug(drug)}
                className="p-0.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Trigger Analyze Interactions Button */}
      <button
        id="btn-run-drug-interaction-check"
        onClick={handleCheckInteractions}
        disabled={loading || drugList.length < 2}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] ${
          loading || drugList.length < 2
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)]'
        }`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span>{loading ? 'Evaluating Biochemical Interactions...' : 'Analyze Pharmacological Interactions'}</span>
      </button>

      {/* Results Output Box */}
      {result && (
        <div className="space-y-4 pt-2">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Result</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskBadge(result.riskLevel)}`}>
                Risk Level: {result.riskLevel}
              </span>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-semibold">
              {result.summary}
            </p>

            <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase block">Pharmacological Mechanism:</span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{result.mechanism}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#E1EFFE] shadow-[4px_4px_8px_#b8c8db,-4px_-4px_8px_#ffffff] border border-blue-200 space-y-1.5">
              <span className="text-xs font-bold text-blue-900 uppercase block">Clinical Doctor Recommendation:</span>
              <p className="text-xs text-blue-950 leading-relaxed font-medium">{result.recommendation}</p>
            </div>

            {result.foodInteractions && result.foodInteractions.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#FEF08A]/60 shadow-[4px_4px_8px_#d4c572,-4px_-4px_8px_#ffffff] border border-amber-300 space-y-1.5">
                <span className="text-xs font-bold text-amber-900 uppercase block">Food & Diet Interactions:</span>
                <ul className="text-xs text-amber-950 list-disc list-inside space-y-1 font-medium">
                  {result.foodInteractions.map((food, i) => (
                    <li key={i}>{food}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
