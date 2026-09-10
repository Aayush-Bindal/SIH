import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CadastralBuilding } from '../types';
import {
  Box,
  Compass,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Maximize2,
  ChevronDown
} from 'lucide-react';

interface HomePageProps {
  buildings: CadastralBuilding[];
  selectedBuilding: CadastralBuilding;
  onSelectBuilding: (id: string) => void;
  onLaunchDemo: (tab?: '3d_cadastre' | 'split_view' | 'utilities' | 'ai_pipeline' | 'governance' | 'citizen') => void;
  onOpenPlaybook: () => void;
  onOpenExport: () => void;
}

// Aceternity-style Mouse Spotlight Card Wrapper
const SpotlightCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden bg-white border border-[#e5e7eb] rounded-[10px] transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* 21st.dev / Aceternity Subtle Radial Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, rgba(226, 230, 125, 0.18), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

// Aceternity 3D Tilting Perspective Card with LiDAR Laser Scan
const Hero3DAnimation: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(10);
  const [rotateY, setRotateY] = useState<number>(-12);
  const [activeLayer, setActiveLayer] = useState<number>(2); // default to residential

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Gentle tilt
    setRotateX(((y - centerY) / centerY) * -12);
    setRotateY(((x - centerX) / centerX) * 14);
  };

  const handleMouseLeave = () => {
    setRotateX(8);
    setRotateY(-10);
  };

  const layers = [
    {
      id: 'air',
      title: 'Air Rights & Solar Envelope',
      level: '+54.0m',
      color: 'border-[#cfd45e] bg-[#fafafa]',
      accent: 'text-[#171717]',
      tag: 'Air Rights',
      sub: 'Sanctioned municipal height limit'
    },
    {
      id: 'encroach',
      title: 'Floor 14 (Penthouse Extension)',
      level: '+42.0m',
      color: 'border-red-300 bg-red-50/70',
      accent: 'text-red-600',
      tag: 'Violation',
      sub: 'Exceeds DTCP approved height'
    },
    {
      id: 'res',
      title: 'Floors 02–13 (Residential Units)',
      level: '+6m to +42m',
      color: 'border-[#171717]/20 bg-white',
      accent: 'text-[#171717]',
      tag: '80 Units',
      sub: 'Centimeter-precise 3D titles'
    },
    {
      id: 'podium',
      title: 'Ground Commercial & Parking',
      level: '0.0m to -6.0m',
      color: 'border-[#171717]/20 bg-white',
      accent: 'text-[#171717]',
      tag: 'Basement Bay P-B2',
      sub: 'Geotagged underground parking'
    },
    {
      id: 'util',
      title: 'Subsurface Utility Corridor',
      level: '-6.0m to -12.0m',
      color: 'border-amber-300 bg-amber-50/50',
      accent: 'text-amber-700',
      tag: 'Dig-Safe',
      sub: 'PNG Gas & 11kV Power cables'
    }
  ];

  return (
    <div
      className="relative w-full max-w-md lg:max-w-md xl:max-w-lg mx-auto py-1"
      style={{ perspective: '1200px' }}
    >
      {/* Aceternity Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#e2e67d]/20 rounded-full blur-3xl pointer-events-none animate-glow" />

      {/* Tilting Container */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="relative bg-white/95 backdrop-blur-md border border-[#e5e7eb] rounded-[14px] p-4 sm:p-5 shadow-xl space-y-3.5 select-none overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Aceternity Laser Scan Beam */}
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#171717] to-transparent pointer-events-none z-30 animate-laser-scan">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-3 bg-[#e2e67d]/40 blur-sm rounded-full" />
        </div>

        {/* Top Header inside 3D Card */}
        <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-mono text-[11px] font-medium text-[#171717]">
              LiDAR 3D CADASTRE STACK
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#171717]/60 bg-[#f3f4f6] px-2 py-0.5 rounded">
            ULPIN-3D • GURUGRAM
          </span>
        </div>

        {/* 3D Stack Slices */}
        <div className="space-y-2 relative z-10">
          {layers.map((layer, index) => {
            const isSelected = activeLayer === index;
            return (
              <div
                key={layer.id}
                onClick={() => setActiveLayer(index)}
                className={`p-2.5 rounded-[8px] border transition-all duration-200 cursor-pointer flex items-center justify-between text-left ${layer.color} ${
                  isSelected
                    ? 'ring-2 ring-[#171717] shadow-sm translate-x-1'
                    : 'hover:translate-x-0.5 opacity-90 hover:opacity-100'
                }`}
                style={{
                  transform: `translateZ(${isSelected ? '28px' : `${(layers.length - index) * 5}px`})`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/80 border border-[#e5e7eb] ${layer.accent} font-medium`}>
                    {layer.level}
                  </span>
                  <div>
                    <div className="text-[12px] font-['Geist'] font-medium text-[#171717] leading-tight">
                      {layer.title}
                    </div>
                    <div className="text-[10px] text-[#171717]/60 leading-tight">
                      {layer.sub}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isSelected ? 'bg-[#171717] text-white' : 'bg-white/80 text-[#171717]/70 border border-[#e5e7eb]'}`}>
                  {layer.tag}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Interactive Trigger inside Card */}
        <div className="pt-2 border-t border-[#f0f0f0] flex items-center justify-between">
          <span className="text-[11px] text-[#171717]/50 font-sans">
            Hover to tilt 3D angle • Click layer
          </span>
          <button
            onClick={onLaunch}
            className="text-[11px] font-['Geist'] font-medium text-[#171717] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore full 3D model</span>
            <ArrowRight className="w-3 h-3 text-[#171717]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({
  onLaunchDemo,
}) => {
  // Simple state for 2D vs 3D interactive comparison
  const [activeCompareMode, setActiveCompareMode] = useState<'2d' | '3d'>('3d');

  return (
    <div id="minimal-homepage-root" className="space-y-16 sm:space-y-24 pb-16 max-w-6xl mx-auto">
      {/* 1. HERO SECTION (Full-height initial viewport: only hero is visible on open) */}
      <section className="relative min-h-[calc(100vh-110px)] flex flex-col justify-between pt-4 sm:pt-8 pb-4">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e2e67d]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto">
          {/* Left Column: Hero Text & Single Action */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Highlighted Heading matching uploaded reference */}
              <h1 className="text-[36px] sm:text-[50px] lg:text-[56px] font-['Geist'] font-medium text-[#171717] tracking-tight leading-[1.12]">
                <span className="bg-[#e2e67d] text-[#171717] px-2.5 py-1 sm:px-3 sm:py-1.5 inline-block rounded-[3px] mb-1">
                  Land isn’t flat.
                </span>
                <span className="block">
                  Land records
                </span>
                <span className="block">
                  shouldn’t be either.
                </span>
              </h1>
              <p className="text-[15px] sm:text-[17px] text-[#171717]/70 font-sans leading-relaxed max-w-md mx-auto lg:mx-0">
                In vertical cities, dozens of families share one flat 2D parcel. Bhu-Drishti gives every flat, parking spot, and underground utility pipe its own legal 3D boundary.
              </p>
            </motion.div>

            {/* MINIMAL BUTTON: Exactly ONE Primary Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col items-center lg:items-start gap-2 pt-1"
            >
              <button
                id="hero-minimal-launch-btn"
                onClick={() => onLaunchDemo('3d_cadastre')}
                className="btn-primary relative h-[50px] px-7 text-[14px] flex items-center gap-2.5 cursor-pointer shadow-xs border-beam-container group"
              >
                <div className="shimmer-btn-overlay" />
                <span>Launch Live Demo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#e2e67d]" />
              </button>
              <span className="text-[12px] text-[#171717]/50 font-sans">
                Interactive 3D Cadastre • No login required
              </span>
            </motion.div>
          </div>

          {/* Right Column: ACETERNITY / 21ST.DEV HERO 3D CARD ANIMATION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center lg:justify-end w-full"
          >
            <Hero3DAnimation onLaunch={() => onLaunchDemo('3d_cadastre')} />
          </motion.div>
        </div>

        {/* Subtle Bottom Scroll Hint to Next Section */}
        <div className="hidden sm:flex justify-center pt-4 pb-1">
          <a
            href="#section-difference"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#171717]/40 hover:text-[#171717] transition-colors"
          >
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* 2. THE PROBLEM AT A GLANCE (2D Flat vs 3D Reality) */}
      <section id="section-difference" className="space-y-6 pt-6">
        <div className="text-center space-y-1">
          <div className="text-[11px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/60">
            The Difference
          </div>
          <h2 className="text-[26px] font-['Geist'] font-medium text-[#171717] tracking-tight">
            Why Flat Records Fail Modern Cities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Traditional 2D Record */}
          <div
            onClick={() => setActiveCompareMode('2d')}
            className={`p-6 sm:p-7 rounded-[10px] border transition-all cursor-pointer ${
              activeCompareMode === '2d'
                ? 'bg-white border-[#171717] shadow-sm ring-1 ring-[#171717]'
                : 'bg-[#fafafa] border-[#e5e7eb] hover:border-[#171717]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] bg-[#f3f4f6] px-2.5 py-1 rounded text-[#171717]/70 font-medium">
                TRADITIONAL 2D RECORD
              </span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>

            <div className="h-28 bg-[#f5f5f5] rounded-[6px] border border-dashed border-[#d4d4d4] flex flex-col items-center justify-center p-3 text-center mb-4">
              <div className="w-16 h-10 border border-[#171717]/40 bg-white/60 flex items-center justify-center text-[10px] font-mono">
                Plot 142
              </div>
              <span className="text-[11px] text-[#171717]/60 mt-1 font-sans">
                Flat Ground Footprint Only
              </span>
            </div>

            <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717] mb-1">
              One number for 80 families
            </h3>
            <p className="text-[13px] text-[#171717]/70 font-sans leading-relaxed">
              Paper deeds treat an 80-unit tower as a single plot. They cannot distinguish floor heights, unauthorized penthouses, or underground parking ownership.
            </p>
          </div>

          {/* Card 2: Bhu-Drishti 3D Cadastre */}
          <div
            onClick={() => setActiveCompareMode('3d')}
            className={`p-6 sm:p-7 rounded-[10px] border transition-all cursor-pointer ${
              activeCompareMode === '3d'
                ? 'bg-white border-[#171717] shadow-sm ring-1 ring-[#171717]'
                : 'bg-[#fafafa] border-[#e5e7eb] hover:border-[#171717]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] bg-[#e2e67d] text-[#171717] px-2.5 py-1 rounded font-medium border border-[#cfd45e]">
                BHU-DRISHTI 3D CADASTRE
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>

            <div className="h-28 bg-[#fafafa] rounded-[6px] border border-[#e5e7eb] flex flex-col items-center justify-center p-3 text-center mb-4 relative overflow-hidden">
              <div className="space-y-1 w-24">
                <div className="h-4 bg-[#e2e67d]/70 rounded-xs border border-[#cfd45e] text-[9px] font-mono flex items-center justify-center">
                  Air Rights
                </div>
                <div className="h-4 bg-[#171717] text-white rounded-xs text-[9px] font-mono flex items-center justify-center">
                  Flat 1401
                </div>
                <div className="h-4 bg-white rounded-xs border border-[#171717]/30 text-[9px] font-mono flex items-center justify-center">
                  Basement
                </div>
              </div>
            </div>

            <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717] mb-1">
              Independent 3D volumetric titles
            </h3>
            <p className="text-[13px] text-[#171717]/70 font-sans leading-relaxed">
              Every apartment, balcony, parking bay, and underground utility corridor receives a centimeter-precise legal bounding volume.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 Simple Steps with basic text) */}
      <section className="space-y-8">
        <div className="text-center space-y-1">
          <div className="text-[11px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/60">
            Process
          </div>
          <h2 className="text-[26px] font-['Geist'] font-medium text-[#171717] tracking-tight">
            How a 3D Title is Created
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 space-y-3">
            <div className="w-8 h-8 rounded-[6px] bg-[#171717] text-white flex items-center justify-center font-mono text-[12px] font-medium">
              01
            </div>
            <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717]">
              Drone LiDAR Survey
            </h3>
            <p className="text-[13px] text-[#171717]/70 font-sans leading-relaxed">
              Drones and Survey of India CORS reference stations capture millimeter-accurate 3D point clouds of the entire building.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 space-y-3">
            <div className="w-8 h-8 rounded-[6px] bg-[#171717] text-white flex items-center justify-center font-mono text-[12px] font-medium">
              02
            </div>
            <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717]">
              AI 3D Parcel Extraction
            </h3>
            <p className="text-[13px] text-[#171717]/70 font-sans leading-relaxed">
              Automated algorithms slice floor slabs, calculate carpet boundaries, and flag extra floors built beyond approved height limits.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 space-y-3">
            <div className="w-8 h-8 rounded-[6px] bg-[#171717] text-[#e2e67d] flex items-center justify-center font-mono text-[12px] font-medium">
              03
            </div>
            <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717]">
              Official 3D Legal Deed
            </h3>
            <p className="text-[13px] text-[#171717]/70 font-sans leading-relaxed">
              The Sub-Registrar signs off on the volumetric deed, linking each flat to India’s 14-digit Bhu-Aadhaar registry.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WORKSPACE BENTO GRID (Aceternity Spotlight Cards, Basic Text, Minimal Clicks) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <div className="text-[11px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/60">
            Interactive Testbed
          </div>
          <h2 className="text-[26px] font-['Geist'] font-medium text-[#171717] tracking-tight">
            Explore the Live Workspaces
          </h2>
          <p className="text-[13px] text-[#171717]/70 font-sans">
            Click any card to open that tool directly in the demo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1 */}
          <SpotlightCard
            onClick={() => onLaunchDemo('3d_cadastre')}
            className="p-6 space-y-3 group hover:border-[#171717]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center text-[#171717]">
                <Box className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#171717]/40 group-hover:text-[#171717] group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717]">
                3D Cadastre Studio
              </h3>
              <p className="text-[13px] text-[#171717]/70 font-sans mt-1 leading-relaxed">
                Rotate, pan, and explode high-rises by floor. Inspect individual flat carpet bounds and ceiling heights.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 2 */}
          <SpotlightCard
            onClick={() => onLaunchDemo('split_view')}
            className="p-6 space-y-3 group hover:border-[#171717]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center text-[#171717]">
                <Compass className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#171717]/40 group-hover:text-[#171717] group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717]">
                2D vs 3D Split Comparison
              </h3>
              <p className="text-[13px] text-[#171717]/70 font-sans mt-1 leading-relaxed">
                Side-by-side view contrasting the flat paper land map with the vertical tower reality.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 3 */}
          <SpotlightCard
            onClick={() => onLaunchDemo('utilities')}
            className="p-6 space-y-3 group hover:border-[#171717]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center text-[#171717]">
                <Zap className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#171717]/40 group-hover:text-[#171717] group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717]">
                Underground Utilities & Dig-Safe
              </h3>
              <p className="text-[13px] text-[#171717]/70 font-sans mt-1 leading-relaxed">
                Subsurface gas pipes, power cables, and water conduits mapped with depth to prevent excavation accidents.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 4 */}
          <SpotlightCard
            onClick={() => onLaunchDemo('citizen')}
            className="p-6 space-y-3 group hover:border-[#171717]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center text-[#171717]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#171717]/40 group-hover:text-[#171717] group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-[16px] font-['Geist'] font-medium text-[#171717]">
                Citizen Title Verification
              </h3>
              <p className="text-[13px] text-[#171717]/70 font-sans mt-1 leading-relaxed">
                Search any apartment to verify legal floor sanction, bank loan status, and generate a 3D property card.
              </p>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* 5. MINIMAL BOTTOM CALL TO ACTION */}
      <section className="bg-white border border-[#e5e7eb] rounded-[14px] p-8 sm:p-14 lg:p-16 text-center space-y-6 antimetal-grid-bg relative overflow-hidden w-full">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h2 className="text-[26px] sm:text-[34px] lg:text-[40px] font-['Geist'] font-medium text-[#171717] tracking-tight leading-tight">
            Experience 3D Land Records in Action
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#171717]/70 font-sans leading-relaxed max-w-2xl mx-auto">
            Rotate buildings, test drone LiDAR extraction, and audit property boundaries in real time.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onLaunchDemo('3d_cadastre')}
              className="btn-primary h-[50px] px-8 text-[15px] inline-flex items-center gap-2.5 cursor-pointer shadow-xs"
            >
              <span>Open 3D Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#e2e67d]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
