import React, { useState } from 'react';
import { PrescribedMedication } from '../types';
import { PillViewer3D } from './PillViewer3D';
import { 
  Pill, 
  Plus, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  QrCode, 
  Layers, 
  ShieldAlert, 
  FileText, 
  HelpCircle,
  Eye
} from 'lucide-react';

interface PrescriptionColumnProps {
  prescriptions: PrescribedMedication[];
  onAddPrescription?: (newMed: PrescribedMedication) => void;
  onRemovePrescription?: (medId: string) => void;
  onToggleActive?: (medId: string) => void;
  readOnly?: boolean;
}

export const PrescriptionColumn: React.FC<PrescriptionColumnProps> = ({
  prescriptions,
  onAddPrescription,
  onRemovePrescription,
  onToggleActive,
  readOnly = false
}) => {
  const [selectedPillFor3D, setSelectedPillFor3D] = useState<PrescribedMedication | null>(
    prescriptions.length > 0 ? prescriptions[0] : null
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // New medication form state
  const [newMedName, setNewMedName] = useState('');
  const [newMedGeneric, setNewMedGeneric] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('500 mg');
  const [newMedFrequency, setNewMedFrequency] = useState('Twice daily with meals');
  const [newMedRoute, setNewMedRoute] = useState<'Oral' | 'Inhalation' | 'Topical' | 'Sublingual'>('Oral');
  const [newMedDuration, setNewMedDuration] = useState('7 Days');
  const [newMedQuantity, setNewMedQuantity] = useState('14 Capsules');
  const [newMedType, setNewMedType] = useState<'Prescription' | 'OTC'>('Prescription');
  const [newMedPurpose, setNewMedPurpose] = useState('Targeted relief of inflammatory symptoms');
  const [newMedPillShape, setNewMedPillShape] = useState<'capsule' | 'round' | 'oval'>('capsule');
  const [newMedPillColor, setNewMedPillColor] = useState('#3b82f6');
  const [newMedPillSecondary, setNewMedPillSecondary] = useState('#93c5fd');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newPrescription: PrescribedMedication = {
      id: `rx-${Date.now()}`,
      name: newMedName,
      genericName: newMedGeneric || newMedName,
      brandNames: [newMedName],
      drugClass: 'Targeted Clinical Formulation',
      prescriptionType: newMedType,
      purpose: newMedPurpose,
      mechanismOfAction: 'Selective therapeutic binding to target receptors to stabilize organ homeostasis.',
      typicalDosage: newMedDosage,
      dosage: newMedDosage,
      route: newMedRoute,
      frequency: newMedFrequency,
      timingInstructions: 'Take with a full 8 oz glass of water as directed by your physician.',
      duration: newMedDuration,
      quantity: newMedQuantity,
      refills: 0,
      prescribingNotes: 'Dispense as written. Take full course of therapy.',
      isPrescribedActive: true,
      commonSideEffects: ['Mild nausea', 'Drowsiness', 'Dry mouth'],
      seriousWarnings: ['Discontinue and call doctor if rash or allergic swelling occurs.'],
      contraindications: ['Known hypersensitivity to active compound'],
      drugInteractions: ['Stagger with antacids by 2 hours'],
      dietaryPrecautions: ['Avoid taking with alcohol'],
      pillVisual: {
        color: newMedPillColor,
        secondaryColor: newMedPillSecondary,
        shape: newMedPillShape,
        imprint: 'RX 500'
      }
    };

    if (onAddPrescription) {
      onAddPrescription(newPrescription);
    }
    setSelectedPillFor3D(newPrescription);
    setShowAddModal(false);
    setNewMedName('');
    setNewMedGeneric('');
  };

  return (
    <div id="prescription-column-block" className="w-full rounded-3xl bg-[#E0E5EC] shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/80 p-6 space-y-6">
      {/* Header with Title and Prescribe Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-blue-600 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]">
              <Pill className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Prescriptions & Medicines
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  {prescriptions.length} Prescribed
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Recommended medicines with clear schedules, easy instructions, and 3D pill models
              </p>
            </div>
          </div>
        </div>

        {!readOnly && onAddPrescription && (
          <button
            id="btn-prescribe-medicine"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:bg-blue-700 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        )}
      </div>

      {/* Main Grid: Medicine Rows & Selected 3D Pill Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Comprehensive Medication Table */}
        <div className="lg:col-span-8 space-y-4">
          {prescriptions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/40">
              <Pill className="w-10 h-10 mx-auto text-slate-400 mb-2 animate-bounce" />
              <p className="text-sm font-bold text-slate-700">No medicines added yet</p>
              <p className="text-xs text-slate-500 mt-1">Click "Add Medicine" above to add prescription or over-the-counter drugs.</p>
            </div>
          ) : (
            prescriptions.map((med, index) => {
              const isSelected = selectedPillFor3D?.id === med.id;
              return (
                <div
                  key={med.id}
                  id={`prescription-row-${med.id}`}
                  className={`p-5 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border-blue-500/80 ring-2 ring-blue-500/20'
                      : 'bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border-white/70 hover:shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 border border-slate-300">
                          Med #{index + 1}
                        </span>
                        <h4 className="text-base font-black text-slate-900">{med.name}</h4>
                        <span className="text-xs font-semibold text-slate-500 italic">({med.genericName})</span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            med.prescriptionType === 'OTC'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          }`}
                        >
                          {med.prescriptionType === 'OTC' ? 'Over the Counter (OTC)' : 'Prescription (Rx)'}
                        </span>

                        {med.route && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
                            {med.route}
                          </span>
                        )}
                      </div>

                      {/* Dosage, Timing & Frequency Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                        <div className="p-2 rounded-xl bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#b8b9be,inset_-1px_-1px_3px_#ffffff] border border-white/50">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Dose</span>
                          <span className="font-bold text-blue-700">{med.dosage || med.typicalDosage}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#b8b9be,inset_-1px_-1px_3px_#ffffff] border border-white/50">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">When to Take</span>
                          <span className="font-bold text-slate-800">{med.frequency}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#b8b9be,inset_-1px_-1px_3px_#ffffff] border border-white/50">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">How Long</span>
                          <span className="font-bold text-slate-800">{med.duration} ({med.quantity || 'Standard pack'})</span>
                        </div>
                      </div>

                      {/* Purpose & Mechanism */}
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">What it helps with: </strong>
                        {med.purpose}
                      </p>

                      {/* Timing rules */}
                      {med.timingInstructions && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span><strong>How to take:</strong> {med.timingInstructions}</span>
                        </div>
                      )}
                    </div>

                    {/* Right Actions & Mini 3D Preview Trigger */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 shrink-0">
                      <button
                        id={`btn-inspect-3d-${med.id}`}
                        onClick={() => setSelectedPillFor3D(med)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-inner'
                            : 'bg-[#E0E5EC] text-slate-700 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] hover:text-blue-600'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>3D View</span>
                      </button>

                      {!readOnly && onRemovePrescription && (
                        <button
                          id={`btn-remove-med-${med.id}`}
                          onClick={() => onRemovePrescription(med.id)}
                          className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Remove prescription"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: 3D Interactive Pill Station & Pharmacy Stamp */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPillFor3D ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  3D Pill Model
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  Interactive 360°
                </span>
              </div>

              {/* 3D Pill Component */}
              <PillViewer3D medication={selectedPillFor3D} />

              {/* Detailed Drug Breakdown Card */}
              <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 space-y-2.5 text-xs text-slate-700">
                <div>
                  <span className="font-bold text-slate-900 block">{selectedPillFor3D.name}</span>
                  <span className="text-[11px] text-slate-500">{selectedPillFor3D.drugClass}</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-slate-900">How it works: </strong>
                    {selectedPillFor3D.mechanismOfAction}
                  </p>
                </div>

                {selectedPillFor3D.commonSideEffects && selectedPillFor3D.commonSideEffects.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Possible Side Effects</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPillFor3D.commonSideEffects.slice(0, 3).map((se, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 text-[10px] font-medium border border-amber-200">
                          {se}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40">
              <Pill className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Select any medication from the list to see its 3D model</p>
            </div>
          )}

          {/* Pharmacy Dispensing QR & Safety Seal */}
          <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/70 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
              <QrCode className="w-9 h-9 text-slate-900" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-900">Pharmacy Ready</p>
              <p className="text-[11px] text-slate-600 font-mono">RX-AUTH-{Math.floor(100000 + Math.random() * 900000)}</p>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Valid digital medicine record
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prescribe Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#E0E5EC] shadow-[20px_20px_40px_#9d9fa3,-20px_-20px_40px_#ffffff] border border-white p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">Prescribe New Medication</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Medication Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amoxicillin, Metformin"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Generic / Chemical Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Amoxicillin Clavulanate"
                    value={newMedGeneric}
                    onChange={(e) => setNewMedGeneric(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dosage / Strength</label>
                  <input
                    type="text"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Route</label>
                  <select
                    value={newMedRoute}
                    onChange={(e) => setNewMedRoute(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Oral">Oral</option>
                    <option value="Inhalation">Inhalation</option>
                    <option value="Topical">Topical</option>
                    <option value="Sublingual">Sublingual</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Prescription Type</label>
                  <select
                    value={newMedType}
                    onChange={(e) => setNewMedType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Prescription">Rx Prescription</option>
                    <option value="OTC">OTC (Over the Counter)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Frequency & Schedule</label>
                <input
                  type="text"
                  value={newMedFrequency}
                  onChange={(e) => setNewMedFrequency(e.target.value)}
                  placeholder="e.g. Once daily in the morning after breakfast"
                  className="w-full px-3 py-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newMedDuration}
                    onChange={(e) => setNewMedDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dispense Quantity</label>
                  <input
                    type="text"
                    value={newMedQuantity}
                    onChange={(e) => setNewMedQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* 3D Visual Customizer */}
              <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 space-y-2">
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  3D Pill Appearance
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Shape</label>
                    <select
                      value={newMedPillShape}
                      onChange={(e) => setNewMedPillShape(e.target.value as any)}
                      className="w-full p-1.5 rounded-lg bg-white text-xs font-semibold text-slate-800 border border-slate-300"
                    >
                      <option value="capsule">Capsule</option>
                      <option value="round">Round Tablet</option>
                      <option value="oval">Oval Tablet</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Primary Color</label>
                    <input
                      type="color"
                      value={newMedPillColor}
                      onChange={(e) => setNewMedPillColor(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Secondary Color</label>
                    <input
                      type="color"
                      value={newMedPillSecondary}
                      onChange={(e) => setNewMedPillSecondary(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition"
                >
                  Add to Rx Column
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
