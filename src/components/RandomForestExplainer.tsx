import React from 'react';
import { MLModelInfo } from '../types';
import { Trees, Brain, CheckCircle2, TrendingUp, Info, HelpCircle } from 'lucide-react';

interface RandomForestExplainerProps {
  mlInfo?: MLModelInfo;
}

export const RandomForestExplainer: React.FC<RandomForestExplainerProps> = ({ mlInfo }) => {
  if (!mlInfo) return null;

  return (
    <div className="rounded-3xl bg-[#E0E5EC] p-6 sm:p-7 shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] border border-white/70 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300/70 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center text-emerald-600">
            <Trees className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider text-emerald-700 uppercase bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                Random Forest ML Diagnostic
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                150 Decision Trees
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              Ensemble Machine Learning Decision
            </h4>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statistical Confidence</div>
            <div className="text-lg font-black text-emerald-700">
              {mlInfo.confidencePercentage ? mlInfo.confidencePercentage.toFixed(1) : (mlInfo.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Probability Distribution & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Disease Probability Distribution */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-blue-600" />
              Predicted Disease Probabilities
            </span>
            <span className="text-[11px] text-slate-500">Tree Vote Share</span>
          </div>

          <div className="space-y-2.5">
            {mlInfo.topPredictions && mlInfo.topPredictions.length > 0 ? (
              mlInfo.topPredictions.map((pred, idx) => {
                const pct = pred.confidence_percentage ?? (pred.probability * 100);
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/40 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        {idx === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />}
                        {pred.disease}
                      </span>
                      <span className="font-extrabold text-slate-700">{pct.toFixed(1)}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          idx === 0
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-slate-400 to-slate-500'
                        }`}
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500">Single disease matched.</p>
            )}
          </div>
        </div>

        {/* Right: Explainable Feature Importance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              Explainable AI: Driving Symptoms
            </span>
            <span className="text-[11px] text-slate-500">Feature Weight</span>
          </div>

          <div className="space-y-2">
            {mlInfo.featureContributions && mlInfo.featureContributions.length > 0 ? (
              mlInfo.featureContributions.map((contrib, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/10 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {contrib.symptom_name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-700">
                    +{contrib.importance_score}% weight
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-500 italic">
                Clinical symptom weights active across all input features.
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/30 text-[11px] text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-700">How Random Forest works here:</span> 150 independent decision trees analyze your symptom vector simultaneously. The final prediction aggregates the majority vote, preventing overfitting and eliminating LLM hallucinations.
          </div>
        </div>
      </div>
    </div>
  );
};
