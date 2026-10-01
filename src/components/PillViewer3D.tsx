import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Medication } from '../types';
import { Sparkles, RotateCw, ShieldCheck, Pill as PillIcon } from 'lucide-react';

interface PillViewer3DProps {
  medication: Medication;
  className?: string;
}

export const PillViewer3D: React.FC<PillViewer3DProps> = ({ medication, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 280;
    const height = container.clientHeight || 240;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep slate

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Pill Group
    const pillGroup = new THREE.Group();
    groupRef.current = pillGroup;
    scene.add(pillGroup);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
    light1.position.set(4, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    light2.position.set(-4, -3, -3);
    scene.add(light2);

    // Convert hex colors
    const primaryColorHex = parseInt((medication.pillVisual?.color || '#3b82f6').replace('#', ''), 16);
    const secondaryColorHex = parseInt((medication.pillVisual?.secondaryColor || '#93c5fd').replace('#', ''), 16);

    const primaryMaterial = new THREE.MeshPhysicalMaterial({
      color: primaryColorHex,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const secondaryMaterial = new THREE.MeshPhysicalMaterial({
      color: secondaryColorHex,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const shape = medication.pillVisual?.shape || 'capsule';

    if (shape === 'capsule') {
      // Half 1
      const capGeo1 = new THREE.CylinderGeometry(0.7, 0.7, 1.0, 32);
      const capMesh1 = new THREE.Mesh(capGeo1, primaryMaterial);
      capMesh1.position.y = 0.5;

      const domeGeo1 = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMesh1 = new THREE.Mesh(domeGeo1, primaryMaterial);
      domeMesh1.position.y = 1.0;
      capMesh1.add(domeMesh1);

      // Half 2
      const capGeo2 = new THREE.CylinderGeometry(0.7, 0.7, 1.0, 32);
      const capMesh2 = new THREE.Mesh(capGeo2, secondaryMaterial);
      capMesh2.position.y = -0.5;

      const domeGeo2 = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMesh2 = new THREE.Mesh(domeGeo2, secondaryMaterial);
      domeMesh2.rotation.x = Math.PI;
      domeMesh2.position.y = -1.0;
      capMesh2.add(domeMesh2);

      // Join ring band
      const ringGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.08, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0;

      pillGroup.add(capMesh1);
      pillGroup.add(capMesh2);
      pillGroup.add(ringMesh);
    } else if (shape === 'round') {
      // Round Tablet with bevel
      const roundGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.45, 32);
      const roundMesh = new THREE.Mesh(roundGeo, primaryMaterial);
      
      // Center score line
      const scoreGeo = new THREE.BoxGeometry(2.3, 0.08, 0.05);
      const scoreMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const scoreMesh = new THREE.Mesh(scoreGeo, scoreMat);
      scoreMesh.position.y = 0.23;
      roundMesh.add(scoreMesh);

      pillGroup.add(roundMesh);
    } else {
      // Oval Tablet
      const ovalGeo = new THREE.CapsuleGeometry(0.8, 1.2, 16, 32);
      const ovalMesh = new THREE.Mesh(ovalGeo, primaryMaterial);
      ovalMesh.rotation.z = Math.PI / 2;
      ovalMesh.scale.set(1.1, 0.6, 0.8);
      pillGroup.add(ovalMesh);
    }

    // Floating molecular particles around pill
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.6 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particlePos[i] = radius * Math.cos(theta) * Math.cos(phi);
      particlePos[i + 1] = radius * Math.sin(phi);
      particlePos[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    pillGroup.add(particles);

    // Slight tilt initial angle
    pillGroup.rotation.x = 0.4;
    pillGroup.rotation.z = 0.5;

    // Mouse drag handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setAutoRotate(false);
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !groupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      groupRef.current.rotation.y += deltaX * 0.01;
      groupRef.current.rotation.x += deltaY * 0.01;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (autoRotate && pillGroup) {
        pillGroup.rotation.y += 0.01;
        pillGroup.rotation.x = 0.3 + Math.sin(elapsed * 1.5) * 0.15;
      }

      particles.rotation.y -= 0.005;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [medication, autoRotate]);

  return (
    <div id={`pill-3d-viewer-${medication.id}`} className={`relative rounded-2xl overflow-hidden bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/70 flex flex-col items-center justify-center p-3 select-none ${className}`}>
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-44 cursor-grab active:cursor-grabbing rounded-xl overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]" />

      {/* Pill Imprint & Badge Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#E0E5EC]/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] border border-white/50 text-[11px] font-mono font-bold text-blue-700">
        <PillIcon className="w-3.5 h-3.5 text-blue-600" />
        <span>3D Pill Inspector</span>
      </div>

      <button
        id={`btn-pill-rotate-${medication.id}`}
        onClick={() => setAutoRotate(!autoRotate)}
        className="absolute top-4 right-4 p-1.5 bg-[#E0E5EC]/90 backdrop-blur-md rounded-xl shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] border border-white/50 text-slate-700 hover:text-slate-900 transition"
        title="Toggle Rotation"
      >
        <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
      </button>

      {/* Pill Imprint Specs */}
      <div className="w-full mt-2.5 pt-2 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <Sparkles className="w-3 h-3 text-amber-600" />
          {medication.pillVisual?.imprint ? `Imprint: "${medication.pillVisual.imprint}"` : 'Standard Form'}
        </span>
        <span className="capitalize px-2.5 py-0.5 rounded-lg bg-[#E0E5EC] shadow-[inset_1px_1px_2px_#b8b9be,inset_-1px_-1px_2px_#ffffff] text-[11px] font-bold text-slate-700 border border-white/40">
          {medication.pillVisual?.shape || 'Capsule'}
        </span>
      </div>
    </div>
  );
};
