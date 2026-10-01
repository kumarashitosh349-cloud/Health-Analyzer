import React, { useState, useEffect } from 'react';
import { BodyRegion } from '../types';
import { 
  ShieldAlert,
  Target,
  User,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Eye,
  Crosshair,
  Radio,
  Flame,
  Maximize2
} from 'lucide-react';

export interface OrganNode2D {
  id: BodyRegion;
  name: string;
  category: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  glowColor: string;
  defectColor: string;
  description: string;
  defectLabel: string;
  severityLevel: 'High' | 'Moderate' | 'Critical';
  pathologyDetails: string;
}

export const ORGAN_NODES_2D: OrganNode2D[] = [
  {
    id: 'head',
    name: 'Brain & Head',
    category: 'Head & Nerves',
    cx: 200,
    cy: 78,
    r: 28,
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    defectColor: '#f43f5e',
    description: 'Headache, tension, migraine throbbing, or head pressure',
    defectLabel: 'Headache & Nerve Pressure',
    severityLevel: 'High',
    pathologyDetails: 'Sensitive nerves and blood vessels around your head are irritated, causing throbbing pain, light sensitivity, or stress tension.'
  },
  {
    id: 'eyes_ears',
    name: 'Eyes & Sinuses',
    category: 'Face & Sinus',
    cx: 200,
    cy: 98,
    r: 22,
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    defectColor: '#38bdf8',
    description: 'Eye strain, stuffy nose, sinus pressure, or facial ache',
    defectLabel: 'Stuffy Sinuses & Eye Strain',
    severityLevel: 'Moderate',
    pathologyDetails: 'Swelling and trapped fluid in your sinus pockets cause pressure around your forehead, nose, and behind your eyes.'
  },
  {
    id: 'throat_neck',
    name: 'Throat & Neck',
    category: 'Throat & Glands',
    cx: 200,
    cy: 135,
    r: 20,
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    defectColor: '#f97316',
    description: 'Sore throat, pain when swallowing, cough, or swollen neck glands',
    defectLabel: 'Sore Throat & Swollen Glands',
    severityLevel: 'Moderate',
    pathologyDetails: 'The tissue in your throat is red and irritated, making swallowing scratchy or painful, often accompanied by hoarseness.'
  },
  {
    id: 'chest_lungs',
    name: 'Lungs & Breathing',
    category: 'Lungs & Chest',
    cx: 200,
    cy: 195,
    r: 34,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    defectColor: '#0284c7',
    description: 'Shortness of breath, chest tightness, wheezing, or deep cough',
    defectLabel: 'Chest Tightness & Breathing Trouble',
    severityLevel: 'High',
    pathologyDetails: 'Breathing tubes inside your lungs are irritated and narrowed (like a pinched straw), making it harder to pull in full breaths.'
  },
  {
    id: 'heart',
    name: 'Heart & Pulse',
    category: 'Heart & Circulation',
    cx: 182,
    cy: 202,
    r: 24,
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.7)',
    defectColor: '#ff0055',
    description: 'Fast heartbeat, palpitations, high blood pressure, or chest strain',
    defectLabel: 'Fast Heartbeat & Blood Pressure Strain',
    severityLevel: 'Critical',
    pathologyDetails: 'Your heart is pumping extra hard under stress or high pressure, causing fluttering sensations or tightness.'
  },
  {
    id: 'stomach_digestive',
    name: 'Stomach & Digestion',
    category: 'Stomach & Gut',
    cx: 206,
    cy: 260,
    r: 26,
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    defectColor: '#22c55e',
    description: 'Acid reflux, heartburn, bloating, nausea, or stomach ache',
    defectLabel: 'Acid Reflux & Stomach Heartburn',
    severityLevel: 'Moderate',
    pathologyDetails: 'Stomach acid is leaking upward into your food pipe, creating a burning chest sensation and sour taste after meals.'
  },
  {
    id: 'liver_gallbladder',
    name: 'Liver & Gallbladder',
    category: 'Digestion & Filters',
    cx: 226,
    cy: 252,
    r: 26,
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    defectColor: '#facc15',
    description: 'Sluggish digestion, feeling full quickly, or side pain',
    defectLabel: 'Liver & Digestion Strain',
    severityLevel: 'Moderate',
    pathologyDetails: 'Your body is working overtime to break down heavy foods, fats, or medications, causing belly fullness or fatigue.'
  },
  {
    id: 'kidneys_urinary',
    name: 'Kidneys & Bladder',
    category: 'Hydration & Waste Filters',
    cx: 172,
    cy: 285,
    r: 22,
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    defectColor: '#f43f5e',
    description: 'Low hydration, frequent bathroom trips, or lower back ache',
    defectLabel: 'Kidney Filter Strain & Low Hydration',
    severityLevel: 'High',
    pathologyDetails: 'Your kidneys need more water to filter out waste smoothly, which can cause dull lower back aches or dark urine.'
  },
  {
    id: 'spine_back',
    name: 'Spine & Back',
    category: 'Back & Spine',
    cx: 200,
    cy: 288,
    r: 20,
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.6)',
    defectColor: '#818cf8',
    description: 'Lower back stiffness, bad posture ache, or pinched nerve',
    defectLabel: 'Back Muscle Tightness & Nerve Ache',
    severityLevel: 'Moderate',
    pathologyDetails: 'Tight back muscles or compressed spinal cushions are pressing on nearby nerves, causing aches when bending or sitting.'
  },
  {
    id: 'joints_muscles',
    name: 'Joints & Muscles',
    category: 'Arms, Legs & Joints',
    cx: 270,
    cy: 340,
    r: 24,
    color: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.6)',
    defectColor: '#06b6d4',
    description: 'Knee pain, stiff morning joints, swelling, or muscle soreness',
    defectLabel: 'Stiff Joints & Muscle Soreness',
    severityLevel: 'Moderate',
    pathologyDetails: 'Swelling and reduced cushioning in your joints make moving around feel stiff, creaky, or painful.'
  },
  {
    id: 'skin',
    name: 'Skin & Rashes',
    category: 'Skin & Allergies',
    cx: 130,
    cy: 340,
    r: 24,
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    defectColor: '#fb923c',
    description: 'Itchy bumps, red patches, dry skin, or allergic rashes',
    defectLabel: 'Allergic Skin Rash & Itchiness',
    severityLevel: 'Moderate',
    pathologyDetails: 'Your skin barrier reacted to an allergy, heat, or dry weather, causing red itchy bumps and irritation.'
  }
];

interface BodyViewer3DProps {
  selectedRegion: BodyRegion;
  onSelectRegion: (region: BodyRegion) => void;
  isScanning?: boolean;
  highlightedRegion?: BodyRegion | null;
}

export const BodyViewer3D: React.FC<BodyViewer3DProps> = ({
  selectedRegion,
  onSelectRegion,
  isScanning = false,
  highlightedRegion
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<OrganNode2D | null>(null);
  const [renderMode, setRenderMode] = useState<'hologram' | 'xray' | 'thermal'>('hologram');
  const [scanY, setScanY] = useState(40);
  const [showWireframe, setShowWireframe] = useState(true);

  // Active Defect Node
  const activeDefectNode = ORGAN_NODES_2D.find(o => o.id === selectedRegion) || ORGAN_NODES_2D[0];

  // Animated laser scan effect
  useEffect(() => {
    let animationId: number;
    let currentY = 40;
    let direction = 1;

    const loop = () => {
      currentY += direction * (isScanning ? 3.2 : 0.85);
      if (currentY > 520) {
        currentY = 520;
        direction = -1;
      } else if (currentY < 40) {
        currentY = 40;
        direction = 1;
      }
      setScanY(currentY);
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isScanning]);

  // Color schemes based on 2D Hologram mode
  const isXRay = renderMode === 'xray';
  const isThermal = renderMode === 'thermal';

  const themeColors = {
    bg: isXRay ? '#060d19' : isThermal ? '#0f081c' : '#0a1424',
    silhouetteFill: isXRay ? 'rgba(56, 189, 248, 0.08)' : isThermal ? 'rgba(244, 63, 94, 0.12)' : 'rgba(14, 165, 233, 0.12)',
    silhouetteStroke: isXRay ? '#38bdf8' : isThermal ? '#f43f5e' : '#00e5ff',
    gridLines: isXRay ? 'rgba(56, 189, 248, 0.12)' : isThermal ? 'rgba(244, 63, 94, 0.15)' : 'rgba(0, 229, 255, 0.15)',
    scanLaser: isXRay ? '#38bdf8' : isThermal ? '#f59e0b' : '#00f0ff',
    textAccent: isXRay ? 'text-cyan-400' : isThermal ? 'text-rose-400' : 'text-cyan-300',
  };

  return (
    <div id="hologram-2d-human-body-scanner" className="relative w-full rounded-3xl overflow-hidden bg-[#E0E5EC] shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 p-4 sm:p-5 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/60 flex items-center justify-center text-blue-600">
            <User className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                2D Hologram Human Silhouette & Defect Radar
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                Defect Highlighted
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Hover & click internal anatomical organs to inspect clinical pathology and localized defects
            </p>
          </div>
        </div>

        {/* 2D Hologram Visual Shader Switcher */}
        <div className="flex items-center gap-1 bg-[#E0E5EC] p-1.5 rounded-2xl shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/60">
          <button
            id="btn-holo-mode-cyber"
            onClick={() => setRenderMode('hologram')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              renderMode === 'hologram'
                ? 'bg-cyan-600 text-white shadow-[0_2px_8px_rgba(6,182,212,0.4)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Cyber Holo</span>
          </button>
          <button
            id="btn-holo-mode-xray"
            onClick={() => setRenderMode('xray')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              renderMode === 'xray'
                ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>X-Ray</span>
          </button>
          <button
            id="btn-holo-mode-thermal"
            onClick={() => setRenderMode('thermal')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              renderMode === 'thermal'
                ? 'bg-rose-600 text-white shadow-[0_2px_8px_rgba(225,29,72,0.4)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Thermal</span>
          </button>
        </div>
      </div>

      {/* Main Holographic 2D Display Screen */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl transition-colors duration-500"
        style={{ backgroundColor: themeColors.bg, minHeight: '440px' }}
      >
        {/* Background Digital Matrix & Scanline Grid Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

        {/* Top HUD Telemetry Stream */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-cyan-400/80 pointer-events-none z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>SYS.2D_ANATOMY_SCAN // V4.9</span>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline">RESOLUTION: 1080p VECTOR</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              RADAR: ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/50 text-rose-400 font-bold animate-pulse">
              DEFECT: {activeDefectNode.name.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 2D Holographic SVG Canvas */}
        <div className="relative w-full flex items-center justify-center py-6 px-2 sm:px-6">
          <div className="relative w-full max-w-[420px] aspect-[400/560]">
            <svg
              viewBox="0 0 400 560"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(6,182,212,0.25)] select-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Glow Filter for Organs */}
                <filter id="holoGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur1" />
                  <feGaussianBlur stdDeviation="14" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Defect Pulse Glow Filter */}
                <filter id="defectGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feColorMatrix
                    type="matrix"
                    values="1 0 0 0 0  0 0.1 0 0 0  0 0 0.2 0 0  0 0 0 2 0"
                  />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Linear Gradients */}
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={themeColors.silhouetteStroke} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={themeColors.silhouetteStroke} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={themeColors.silhouetteStroke} stopOpacity="0.25" />
                </linearGradient>

                <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor={themeColors.scanLaser} stopOpacity="0.9" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* 1. Holographic Cybernetic Coordinate Reticles & Scale Rings */}
              <g opacity="0.35">
                <circle cx="200" cy="280" r="190" fill="none" stroke={themeColors.gridLines} strokeWidth="1" strokeDasharray="4 6" />
                <circle cx="200" cy="280" r="130" fill="none" stroke={themeColors.gridLines} strokeWidth="1" strokeDasharray="2 8" />
                <line x1="200" y1="20" x2="200" y2="540" stroke={themeColors.gridLines} strokeWidth="1" strokeDasharray="3 5" />
                <line x1="20" y1="280" x2="380" y2="280" stroke={themeColors.gridLines} strokeWidth="1" strokeDasharray="3 5" />
                
                {/* Holographic Height Scale Rulers */}
                {[80, 140, 200, 260, 320, 380, 440, 500].map((h, i) => (
                  <g key={`scale-${i}`}>
                    <line x1="45" y1={h} x2="55" y2={h} stroke={themeColors.gridLines} strokeWidth="1.5" />
                    <text x="32" y={h + 3} fill={themeColors.silhouetteStroke} fontSize="7" fontFamily="monospace" textAnchor="end">
                      {560 - h}mm
                    </text>
                    <line x1="345" y1={h} x2="355" y2={h} stroke={themeColors.gridLines} strokeWidth="1.5" />
                  </g>
                ))}
              </g>

              {/* 2. Anatomical 2D Human Silhouette Body Path */}
              <g id="human-body-silhouette-2d">
                {/* Full Human Body Silhouette Outline (Sculpted Head, Torso, Arms, Pelvis, Legs) */}
                <path
                  d="
                    M 200 48
                    C 218 48, 226 62, 226 82
                    C 226 98, 218 112, 212 120
                    C 218 126, 235 136, 252 144
                    C 264 150, 276 160, 280 182
                    C 284 204, 290 248, 292 278
                    C 294 300, 298 335, 296 350
                    C 294 360, 286 364, 280 358
                    C 274 348, 270 310, 268 288
                    C 264 250, 258 220, 250 200
                    C 246 220, 244 250, 242 275
                    C 240 300, 236 325, 232 345
                    C 228 375, 226 415, 224 450
                    C 222 485, 222 515, 224 532
                    C 224 538, 214 540, 208 538
                    C 204 532, 204 500, 204 460
                    C 204 420, 203 380, 201 345
                    C 200 345, 199 345, 199 345
                    C 197 380, 196 420, 196 460
                    C 196 500, 196 532, 192 538
                    C 186 540, 176 538, 176 532
                    C 178 515, 178 485, 176 450
                    C 174 415, 172 375, 168 345
                    C 164 325, 160 300, 158 275
                    C 156 250, 154 220, 150 200
                    C 142 220, 136 250, 132 288
                    C 130 310, 126 348, 120 358
                    C 114 364, 106 360, 104 350
                    C 102 335, 106 300, 108 278
                    C 110 248, 116 204, 120 182
                    C 124 160, 136 150, 148 144
                    C 165 136, 182 126, 188 120
                    C 182 112, 174 98, 174 82
                    C 174 62, 182 48, 200 48 Z
                  "
                  fill="url(#bodyGradient)"
                  stroke={themeColors.silhouetteStroke}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  className="transition-colors duration-500"
                />

                {/* Internal Wireframe Anatomical Contours & Muscle Striations */}
                <g opacity={showWireframe ? 0.35 : 0.1} stroke={themeColors.silhouetteStroke} strokeWidth="1" fill="none">
                  {/* Cranium contour */}
                  <ellipse cx="200" cy="84" rx="22" ry="28" strokeDasharray="3 3" />
                  {/* Clavicle bones */}
                  <path d="M 160 148 Q 200 156 240 148" />
                  {/* Ribcage arcs */}
                  <path d="M 164 175 Q 200 185 236 175" />
                  <path d="M 160 195 Q 200 210 240 195" />
                  <path d="M 162 215 Q 200 230 238 215" />
                  <path d="M 166 235 Q 200 250 234 235" />
                  {/* Sternum */}
                  <line x1="200" y1="150" x2="200" y2="245" strokeWidth="1.5" />
                  {/* Pelvic arch */}
                  <path d="M 168 285 Q 200 310 232 285" />
                  {/* Knees */}
                  <circle cx="178" cy="420" r="8" strokeDasharray="2 2" />
                  <circle cx="222" cy="420" r="8" strokeDasharray="2 2" />
                </g>
              </g>

              {/* 3. 2D Interactive Anatomical Organs & Glowing Hotspots */}
              <g id="anatomical-internal-organs-2d">
                {ORGAN_NODES_2D.map((organ) => {
                  const isSelected = selectedRegion === organ.id || highlightedRegion === organ.id;
                  const isHovered = hoveredRegion?.id === organ.id;
                  const organColor = isSelected ? organ.defectColor : organ.color;

                  return (
                    <g 
                      key={organ.id}
                      id={`organ-node-2d-${organ.id}`}
                      className="cursor-pointer group"
                      onClick={() => onSelectRegion(organ.id)}
                      onMouseEnter={() => setHoveredRegion(organ)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      {/* Pulsing Defect Target Radar Rings (When Organ is Selected as Defect) */}
                      {isSelected && (
                        <g>
                          {/* Outer Expanding Defect Wave */}
                          <circle
                            cx={organ.cx}
                            cy={organ.cy}
                            r={organ.r + 24}
                            fill="none"
                            stroke={organ.defectColor}
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                            className="animate-spin"
                            style={{ transformOrigin: `${organ.cx}px ${organ.cy}px`, animationDuration: '6s' }}
                            opacity="0.75"
                          />
                          <circle
                            cx={organ.cx}
                            cy={organ.cy}
                            r={organ.r + 14}
                            fill="none"
                            stroke={organ.defectColor}
                            strokeWidth="2"
                            opacity="0.9"
                          />
                          <circle
                            cx={organ.cx}
                            cy={organ.cy}
                            r={organ.r + 6}
                            fill="rgba(244, 63, 94, 0.25)"
                            stroke={organ.defectColor}
                            strokeWidth="1.5"
                          />

                          {/* Crosshair Brackets */}
                          <path
                            d={`
                              M ${organ.cx - organ.r - 8} ${organ.cy - 6} L ${organ.cx - organ.r - 8} ${organ.cy - organ.r - 8} L ${organ.cx - 6} ${organ.cy - organ.r - 8}
                              M ${organ.cx + organ.r + 8} ${organ.cy - 6} L ${organ.cx + organ.r + 8} ${organ.cy - organ.r - 8} L ${organ.cx + 6} ${organ.cy - organ.r - 8}
                              M ${organ.cx - organ.r - 8} ${organ.cy + 6} L ${organ.cx - organ.r - 8} ${organ.cy + organ.r + 8} L ${organ.cx - 6} ${organ.cy + organ.r + 8}
                              M ${organ.cx + organ.r + 8} ${organ.cy + 6} L ${organ.cx + organ.r + 8} ${organ.cy + organ.r + 8} L ${organ.cx + 6} ${organ.cy + organ.r + 8}
                            `}
                            fill="none"
                            stroke={organ.defectColor}
                            strokeWidth="2"
                          />
                        </g>
                      )}

                      {/* Organ Vector Graphics (Anatomical 2D Shapes) */}
                      {organ.id === 'head' && (
                        // Brain Hemispheres
                        <g>
                          <path
                            d="M 188 78 C 184 65, 194 58, 200 62 C 206 58, 216 65, 212 78 C 216 86, 208 96, 200 95 C 192 96, 184 86, 188 78 Z"
                            fill={isSelected ? '#f43f5e' : '#a855f7'}
                            fillOpacity={isSelected ? 0.9 : 0.75}
                            stroke={isSelected ? '#ffffff' : '#c084fc'}
                            strokeWidth="1.5"
                            filter="url(#holoGlow)"
                          />
                          <line x1="200" y1="62" x2="200" y2="94" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                        </g>
                      )}

                      {organ.id === 'eyes_ears' && (
                        // Sinuses & Eyes
                        <g>
                          <circle cx="192" cy="98" r="4" fill={isSelected ? '#f43f5e' : '#06b6d4'} stroke="#ffffff" strokeWidth="1" />
                          <circle cx="208" cy="98" r="4" fill={isSelected ? '#f43f5e' : '#06b6d4'} stroke="#ffffff" strokeWidth="1" />
                          <path d="M 194 104 Q 200 108 206 104" stroke={isSelected ? '#f43f5e' : '#06b6d4'} strokeWidth="1.5" fill="none" />
                        </g>
                      )}

                      {organ.id === 'throat_neck' && (
                        // Throat & Thyroid
                        <g>
                          <rect x="196" y="126" width="8" height="18" rx="2" fill={isSelected ? '#f97316' : '#f59e0b'} fillOpacity="0.8" stroke="#ffffff" strokeWidth="1" />
                          <path d="M 192 136 Q 200 142 208 136" fill={isSelected ? '#f43f5e' : '#f97316'} stroke="#ffffff" strokeWidth="1" />
                        </g>
                      )}

                      {organ.id === 'chest_lungs' && (
                        // Bilateral Lungs
                        <g>
                          {/* Left Lung */}
                          <path
                            d="M 188 178 C 174 180, 168 196, 172 216 C 176 226, 186 226, 188 220 Z"
                            fill={isSelected ? '#0284c7' : '#38bdf8'}
                            fillOpacity={isSelected ? 0.85 : 0.65}
                            stroke={isSelected ? '#ffffff' : '#7dd3fc'}
                            strokeWidth="1.5"
                            filter="url(#holoGlow)"
                          />
                          {/* Right Lung */}
                          <path
                            d="M 212 178 C 226 180, 232 196, 228 216 C 224 226, 214 226, 212 220 Z"
                            fill={isSelected ? '#0284c7' : '#38bdf8'}
                            fillOpacity={isSelected ? 0.85 : 0.65}
                            stroke={isSelected ? '#ffffff' : '#7dd3fc'}
                            strokeWidth="1.5"
                            filter="url(#holoGlow)"
                          />
                        </g>
                      )}

                      {organ.id === 'heart' && (
                        // 4-Chamber Heart
                        <g>
                          <path
                            d="M 182 192 C 176 188, 170 196, 176 204 L 182 212 L 188 204 C 194 196, 188 188, 182 192 Z"
                            fill={isSelected ? '#ff0055' : '#ef4444'}
                            fillOpacity={0.95}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            filter="url(#holoGlow)"
                          />
                          {/* Aorta Arch */}
                          <path d="M 180 190 Q 182 184 186 188" stroke="#ff8888" strokeWidth="2" fill="none" />
                        </g>
                      )}

                      {organ.id === 'stomach_digestive' && (
                        // C-Shaped Stomach
                        <path
                          d="M 198 248 C 192 254, 192 268, 204 272 C 214 274, 218 262, 212 252 Z"
                          fill={isSelected ? '#22c55e' : '#10b981'}
                          fillOpacity={0.85}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          filter="url(#holoGlow)"
                        />
                      )}

                      {organ.id === 'liver_gallbladder' && (
                        // Wedge Liver
                        <path
                          d="M 216 242 L 238 246 C 240 256, 234 264, 222 262 Z"
                          fill={isSelected ? '#facc15' : '#eab308'}
                          fillOpacity={0.85}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          filter="url(#holoGlow)"
                        />
                      )}

                      {organ.id === 'kidneys_urinary' && (
                        // Bilateral Kidneys
                        <g>
                          <ellipse cx="178" cy="285" rx="5" ry="9" fill={isSelected ? '#f43f5e' : '#ec4899'} stroke="#ffffff" strokeWidth="1" />
                          <ellipse cx="222" cy="285" rx="5" ry="9" fill={isSelected ? '#f43f5e' : '#ec4899'} stroke="#ffffff" strokeWidth="1" />
                        </g>
                      )}

                      {organ.id === 'spine_back' && (
                        // Spine Vertebral Discs
                        <g>
                          {[255, 268, 281, 294, 307].map((sy, idx) => (
                            <rect
                              key={`disc-${idx}`}
                              x="196"
                              y={sy}
                              width="8"
                              height="5"
                              rx="1.5"
                              fill={isSelected ? '#818cf8' : '#6366f1'}
                              stroke="#ffffff"
                              strokeWidth="0.8"
                            />
                          ))}
                        </g>
                      )}

                      {organ.id === 'joints_muscles' && (
                        // Joint Hotspots
                        <g>
                          <circle cx="270" cy="340" r="7" fill={isSelected ? '#06b6d4' : '#14b8a6'} stroke="#ffffff" strokeWidth="1.5" />
                          <circle cx="130" cy="340" r="7" fill={isSelected ? '#06b6d4' : '#14b8a6'} stroke="#ffffff" strokeWidth="1.5" />
                        </g>
                      )}

                      {organ.id === 'skin' && (
                        // Dermal Barrier Nodes
                        <g>
                          <circle cx="112" cy="260" r="6" fill={isSelected ? '#fb923c' : '#f97316'} stroke="#ffffff" strokeWidth="1.5" />
                          <circle cx="288" cy="260" r="6" fill={isSelected ? '#fb923c' : '#f97316'} stroke="#ffffff" strokeWidth="1.5" />
                        </g>
                      )}

                      {/* Organ Interactive Center Dot with Beacon Ripple */}
                      <circle
                        cx={organ.cx}
                        cy={organ.cy}
                        r={isSelected ? 5 : isHovered ? 4.5 : 3.5}
                        fill={isSelected ? '#ffffff' : organColor}
                        stroke={isSelected ? organ.defectColor : '#ffffff'}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />

                      {/* Hover / Active Label Tag */}
                      {(isHovered || isSelected) && (
                        <g>
                          <rect
                            x={organ.cx > 200 ? organ.cx + 12 : organ.cx - 96}
                            y={organ.cy - 12}
                            width="84"
                            height="24"
                            rx="6"
                            fill="rgba(15, 23, 42, 0.92)"
                            stroke={isSelected ? organ.defectColor : '#38bdf8'}
                            strokeWidth="1"
                          />
                          <text
                            x={organ.cx > 200 ? organ.cx + 54 : organ.cx - 54}
                            y={organ.cy + 3}
                            fill="#ffffff"
                            fontSize="8"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                            textAnchor="middle"
                          >
                            {organ.name.split(' ')[0]}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* 4. Real-time Animated Scanning Laser Bar */}
              <g pointerEvents="none">
                <line
                  x1="60"
                  y1={scanY}
                  x2="340"
                  y2={scanY}
                  stroke="url(#laserGradient)"
                  strokeWidth="2.5"
                />
                <circle cx="60" cy={scanY} r="3" fill={themeColors.scanLaser} />
                <circle cx="340" cy={scanY} r="3" fill={themeColors.scanLaser} />
                {/* Laser scan beam gradient */}
                <rect
                  x="60"
                  y={scanY - 14}
                  width="280"
                  height="14"
                  fill="url(#laserGradient)"
                  opacity="0.15"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Floating Real-Time Defect Telemetry Box (Bottom of Hologram Screen) */}
        {activeDefectNode && (
          <div className="p-3 sm:p-4 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-wider">
                    TARGET ORGAN DETECTED
                  </span>
                  <span className="px-2 py-0.2 rounded bg-rose-950 text-rose-300 text-[10px] font-mono border border-rose-800">
                    SEVERITY: {activeDefectNode.severityLevel.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeDefectNode.name}</span>
                  <span className="text-slate-400 text-xs font-normal">({activeDefectNode.category})</span>
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  <strong className="text-rose-300">What's happening: </strong>
                  {activeDefectNode.defectLabel} — {activeDefectNode.pathologyDetails}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <button
                id="btn-holo-highlight-confirm"
                onClick={() => onSelectRegion(activeDefectNode.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-[0_2px_10px_rgba(225,29,72,0.4)]"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Select Organ</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Organ Selector Chips (Underneath the 2D Hologram) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-blue-600" />
            <span>Click any body part to inspect & target issue</span>
          </span>
          <span className="text-blue-600 font-mono text-[10px] normal-case">
            Tap to highlight in 2D scan
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-x-auto pb-1 no-scrollbar">
          {ORGAN_NODES_2D.map((organ) => {
            const isSelected = selectedRegion === organ.id;
            return (
              <button
                key={organ.id}
                id={`btn-2d-organ-${organ.id}`}
                onClick={() => onSelectRegion(organ.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-500 shadow-[0_4px_12px_rgba(225,29,72,0.4)] scale-105'
                    : 'bg-[#E0E5EC] text-slate-700 border-white/60 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#b8b9be,-1px_-1px_3px_#ffffff]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isSelected ? 'animate-ping bg-white' : ''}`}
                  style={{ backgroundColor: isSelected ? '#ffffff' : organ.color }}
                />
                <span>{organ.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
