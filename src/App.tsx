import React, { useState } from 'react';
import { MOCK_BUILDINGS } from './data/mockCadastreData';
import { CadastralBuilding, UnitCadastre, UndergroundUtility } from './types';
import { HomePage } from './components/HomePage';
import { ThreeDViewer } from './components/ThreeDViewer';
import { CadastreSplitView } from './components/CadastreSplitView';
import { UndergroundUtilityModule } from './components/UndergroundUtilityModule';
import { AiExtractionPipeline } from './components/AiExtractionPipeline';
import { SurveyorGovernancePortal } from './components/SurveyorGovernancePortal';
import { CitizenSearchPortal } from './components/CitizenSearchPortal';
import { UnitDetailsModal } from './components/UnitDetailsModal';
import { EncroachmentDetectionModal } from './components/EncroachmentDetectionModal';
import { LandStackExportModal } from './components/LandStackExportModal';
import { PitchPlaybookModal } from './components/PitchPlaybookModal';
import { Tooltip } from './components/Tooltip';

import {
  Layers,
  Box,
  Zap,
  Cpu,
  UserCheck,
  Search,
  AlertTriangle,
  FileCode,
  Award,
  ChevronDown,
  Building,
  ShieldAlert,
  Compass,
  Eye,
  Sliders,
  Sparkles,
  RefreshCw,
  Landmark,
  CheckCircle2,
  Home,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

export default function App() {
  const [activeBuildingId, setActiveBuildingId] = useState<string>('cyber-heights-ggm');
  // Two distinct page modes: 'home' (clean product overview) and 'demo' (interactive live workspace)
  const [viewMode, setViewMode] = useState<'home' | 'demo'>('home');
  const [demoTab, setDemoTab] = useState<'3d_cadastre' | 'split_view' | 'utilities' | 'ai_pipeline' | 'governance' | 'citizen'>('3d_cadastre');

  // 3D Scene Controls State
  const [selectedUnit, setSelectedUnit] = useState<UnitCadastre | null>(null);
  const [selectedUtility, setSelectedUtility] = useState<UndergroundUtility | null>(null);
  const [colorMode, setColorMode] = useState<'usage' | 'confidence' | 'registration' | 'change_detection'>('usage');
  const [subsurfaceVisible, setSubsurfaceVisible] = useState<boolean>(true);
  const [airRightsVisible, setAirRightsVisible] = useState<boolean>(true);
  const [explosionFactor, setExplosionFactor] = useState<number>(0.35);
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');

  // Modals
  const [isEncroachmentModalOpen, setIsEncroachmentModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPitchPlaybookOpen, setIsPitchPlaybookOpen] = useState<boolean>(false);

  const currentBuilding = MOCK_BUILDINGS.find((b) => b.id === activeBuildingId) || MOCK_BUILDINGS[0];

  const handleOpen3DWithUnit = (unitId?: string) => {
    setViewMode('demo');
    setDemoTab('3d_cadastre');
    if (unitId) {
      const u = currentBuilding.units.find((item) => item.id === unitId);
      if (u) {
        setSelectedUnit(u);
        setFilterLevel('all');
        setExplosionFactor(0.65);
      }
    }
  };

  const highlightUnauthorizedIn3D = () => {
    setViewMode('demo');
    setDemoTab('3d_cadastre');
    setColorMode('change_detection');
    setExplosionFactor(0.65);
    const unauth = currentBuilding.units.find((u) => u.status === 'unauthorized_extension');
    if (unauth) {
      setSelectedUnit(unauth);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans selection:bg-[#e2e67d] selection:text-[#171717]">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb]">
        {viewMode === 'home' ? (
          /* ================= PAGE 1: CLEAN HOME HEADER ================= */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Clean, Professional Brand Identity */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => {
                setViewMode('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-7 h-7 rounded-[6px] bg-[#171717] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Box className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[15px] font-medium font-['Geist'] text-[#171717] tracking-tight">
                  Bhu-Drishti
                </span>
                <span className="text-[11px] font-mono text-[#171717]/50 font-normal">
                  3D
                </span>
              </div>
            </div>

            {/* Clean Nav Actions */}
            <div className="flex items-center gap-4">
              <button
                id="nav-playbook-btn"
                onClick={() => setIsPitchPlaybookOpen(true)}
                className="text-[13px] font-medium font-['Geist'] text-[#171717]/70 hover:text-[#171717] transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
              >
                <span>Playbook</span>
              </button>

              <button
                id="nav-launch-demo-btn"
                onClick={() => {
                  setViewMode('demo');
                  setDemoTab('3d_cadastre');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary h-[38px] text-[13px] px-4 font-['Geist'] cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Launch Live Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* ================= PAGE 2: LIVE DEMO WORKSPACE HEADER ================= */
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
              {/* Back to Home + Demo Title */}
              <div className="flex items-center gap-3">
                <button
                  id="btn-back-to-home"
                  onClick={() => {
                    setViewMode('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-secondary h-[36px] px-3 text-[13px] font-['Geist'] flex items-center gap-1.5 cursor-pointer"
                  title="Return to homepage"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#171717]" />
                  <span>Overview</span>
                </button>

                <div className="h-4 w-px bg-[#e5e7eb] hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  <span className="font-medium font-['Geist'] text-[14px] text-[#171717]">
                    Bhu-Drishti 3D
                  </span>
                  <span className="text-[11px] font-mono text-[#171717]/50 bg-[#f3f4f6] px-1.5 py-0.5 rounded">
                    Workspace
                  </span>
                </div>
              </div>

              {/* Demo Controls: Cadastral Plot Selector & Action Modals */}
              <div className="flex items-center gap-2.5">
                <Tooltip
                  title="Cadastral Pilot Site"
                  content="Switch demonstration sites across Indian metropolitan areas (Gurugram, Bengaluru, Mumbai) representing different state land record typologies."
                  side="bottom"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-[#171717]/60 hidden md:inline font-['Geist']">Cadastral Plot:</span>
                    <div className="relative">
                      <select
                        id="select-cadastral-building"
                        value={activeBuildingId}
                        onChange={(e) => {
                          setActiveBuildingId(e.target.value);
                          setSelectedUnit(null);
                          setSelectedUtility(null);
                        }}
                        className="antimetal-input h-[38px] text-[13px] font-['Geist'] font-medium py-1 pl-3 pr-8 rounded-[6px] appearance-none cursor-pointer"
                      >
                        {MOCK_BUILDINGS.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.state})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#171717]/50 pointer-events-none" />
                    </div>
                  </div>
                </Tooltip>

                {/* Encroachment Alert Button if any */}
                {currentBuilding.unauthorizedFloorsCount > 0 && (
                  <Tooltip
                    title="Unauthorized Construction Flag"
                    content="Drone LiDAR resurvey detected physical floors constructed beyond the sanctioned municipal DTCP height limit."
                    side="bottom"
                  >
                    <button
                      id="btn-nav-encroachment-alert"
                      onClick={() => setIsEncroachmentModalOpen(true)}
                      className="btn-secondary h-[38px] text-[13px] px-3 border-[#171717] text-[#171717] cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-[#171717]" />
                      <span className="hidden sm:inline">{currentBuilding.unauthorizedFloorsCount} Illegal Floors</span>
                    </button>
                  </Tooltip>
                )}

                {/* Land Stack OGC Export */}
                <Tooltip
                  title="Land Stack & Open Standards Export"
                  content="Download interoperable OGC 3D Tiles, CityGML 3.0, and DoLR Land Stack JSON schemas to integrate with state land registries."
                  side="bottom"
                >
                  <button
                    id="btn-nav-landstack-export"
                    onClick={() => setIsExportModalOpen(true)}
                    className="btn-secondary h-[38px] text-[13px] px-3.5 cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#171717]" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </Tooltip>

                {/* Event Showcase Playbook Modal */}
                <Tooltip
                  title="Project Defense & Playbook"
                  content="Access the 90-second executive pitch, jury defense Q&A, and state adoption roadmap for Problem Statement ::26014."
                  side="bottom"
                >
                  <button
                    id="btn-nav-pitch-playbook"
                    onClick={() => setIsPitchPlaybookOpen(true)}
                    className="btn-secondary h-[38px] text-[13px] px-3.5 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-[#171717]" />
                    <span className="hidden sm:inline">Playbook</span>
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Sub-Navigation Tabs for the Live Demo */}
            <div className="border-t border-[#e5e7eb] bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto">
                {[
                  { id: '3d_cadastre', label: '3D Cadastre Studio', icon: Box },
                  { id: 'split_view', label: '2D vs 3D Comparison', icon: Compass },
                  { id: 'utilities', label: 'Subsurface Utilities', icon: Zap },
                  { id: 'ai_pipeline', label: 'AI Extraction Pipeline', icon: Cpu },
                  { id: 'governance', label: 'Surveyor Sign-Off', icon: UserCheck },
                  { id: 'citizen', label: 'Citizen Title Check', icon: Search },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = demoTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-nav-${tab.id}`}
                      onClick={() => setDemoTab(tab.id as any)}
                      className={`px-4 py-2.5 text-[13px] font-['Geist'] transition-colors flex items-center gap-2 shrink-0 border-b-2 -mb-px cursor-pointer ${
                        isActive
                          ? 'border-[#171717] text-[#171717] font-medium bg-transparent'
                          : 'border-transparent text-[#171717]/60 hover:text-[#171717] hover:bg-black/[0.02]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* VIEW 1: HOME PAGE (Clean, uncluttered, user-friendly landing) */}
        {viewMode === 'home' && (
          <HomePage
            buildings={MOCK_BUILDINGS}
            selectedBuilding={currentBuilding}
            onSelectBuilding={(id) => {
              setActiveBuildingId(id);
              setSelectedUnit(null);
              setSelectedUtility(null);
            }}
            onLaunchDemo={(tab) => {
              setDemoTab(tab || '3d_cadastre');
              setViewMode('demo');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPlaybook={() => setIsPitchPlaybookOpen(true)}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {/* VIEW 2: LIVE DEMO WORKSPACES */}
        {viewMode === 'demo' && demoTab === '3d_cadastre' && (
          <div className="space-y-4">
            {/* Control Strip above 3D Scene - Clean, Grouped, with Hover Explanations */}
            <div className="antimetal-card p-3 flex flex-wrap items-center justify-between gap-4">
              {/* Inspection Mode Toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] text-[#171717]/60 font-medium font-['Geist']">Shading Mode:</span>
                <div className="flex items-center gap-1 bg-[#f3f4f6] p-0.5 rounded-[6px] border border-[#e5e7eb]">
                  <Tooltip
                    title="Spatial Usage Type"
                    content="Colors 3D parcels by functional category: Residential apartments, Commercial retail, Parking bays, and Shared Corridors."
                    side="bottom"
                  >
                    <button
                      onClick={() => setColorMode('usage')}
                      className={`px-3 py-1 rounded-[4px] text-[12px] font-medium font-['Geist'] transition-colors cursor-pointer ${
                        colorMode === 'usage' ? 'bg-[#171717] text-white' : 'text-[#171717]/70 hover:text-[#171717]'
                      }`}
                    >
                      Usage
                    </button>
                  </Tooltip>

                  <Tooltip
                    title="Title Clarity & Encumbrance"
                    content="Validates legal registry status: Clear registered title (Neutral), Active bank mortgage (Blue), or Court injunction (Alert)."
                    side="bottom"
                  >
                    <button
                      onClick={() => setColorMode('registration')}
                      className={`px-3 py-1 rounded-[4px] text-[12px] font-medium font-['Geist'] transition-colors cursor-pointer ${
                        colorMode === 'registration' ? 'bg-[#171717] text-white' : 'text-[#171717]/70 hover:text-[#171717]'
                      }`}
                    >
                      Title Status
                    </button>
                  </Tooltip>

                  <Tooltip
                    title="Unauthorized Floor Detection"
                    content="Highlights unauthorized extra floors built beyond municipal DTCP sanctioned height limits in high-contrast yellow."
                    side="bottom"
                  >
                    <button
                      onClick={() => setColorMode('change_detection')}
                      className={`px-3 py-1 rounded-[4px] text-[12px] font-medium font-['Geist'] transition-colors cursor-pointer ${
                        colorMode === 'change_detection'
                          ? 'bg-[#e2e67d] text-[#171717] border border-[#cfd45e]'
                          : 'text-[#171717]/70 hover:text-[#171717]'
                      }`}
                    >
                      Change Detection
                    </button>
                  </Tooltip>

                  <Tooltip
                    title="AI Segmentation Confidence"
                    content="Visualizes machine vision confidence when extracting 3D volumetric parcels from LiDAR and drone photogrammetry point clouds."
                    side="bottom"
                  >
                    <button
                      onClick={() => setColorMode('confidence')}
                      className={`px-3 py-1 rounded-[4px] text-[12px] font-medium font-['Geist'] transition-colors cursor-pointer ${
                        colorMode === 'confidence' ? 'bg-[#171717] text-white' : 'text-[#171717]/70 hover:text-[#171717]'
                      }`}
                    >
                      AI Confidence
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Layer Visibility Toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] text-[#171717]/60 font-medium font-['Geist']">Layers:</span>
                <Tooltip
                  title="Subsurface Utility Conduits"
                  content="Reveals subterranean PNG gas pipelines, water mains, high-voltage lines, and foundation piles beneath ground level."
                  side="bottom"
                >
                  <button
                    onClick={() => setSubsurfaceVisible(!subsurfaceVisible)}
                    className={`btn-secondary h-[32px] px-3 text-[12px] rounded-[6px] cursor-pointer flex items-center gap-1.5 ${
                      subsurfaceVisible ? 'bg-[#e2e67d]/40 border-[#cfd45e] text-[#171717] font-medium' : ''
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#171717]" />
                    <span>Subsurface ({subsurfaceVisible ? 'ON' : 'OFF'})</span>
                  </button>
                </Tooltip>

                <Tooltip
                  title="Sanctioned Air Rights"
                  content="Renders the transparent volumetric bounding box representing municipal approved height limits and air corridors."
                  side="bottom"
                >
                  <button
                    onClick={() => setAirRightsVisible(!airRightsVisible)}
                    className={`btn-secondary h-[32px] px-3 text-[12px] rounded-[6px] cursor-pointer flex items-center gap-1.5 ${
                      airRightsVisible ? 'bg-[#e2e67d]/40 border-[#cfd45e] text-[#171717] font-medium' : ''
                    }`}
                  >
                    <Box className="w-3.5 h-3.5 text-[#171717]" />
                    <span>Air Rights ({airRightsVisible ? 'ON' : 'OFF'})</span>
                  </button>
                </Tooltip>
              </div>

              {/* Floor Level Filter */}
              <div className="flex items-center gap-2">
                <Tooltip
                  title="Floor Isolation Filter"
                  content="Isolates a single floor level or basement parking slab to inspect its unit layouts without visual obstruction."
                  side="bottom"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-[#171717]/60 font-medium font-['Geist']">Floor:</span>
                    <select
                      value={filterLevel === 'all' ? 'all' : filterLevel.toString()}
                      onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                      className="antimetal-input h-[32px] text-[12px] font-['Geist'] font-medium py-1 px-2 rounded-[6px] cursor-pointer"
                    >
                      <option value="all">All Floors Stacked</option>
                      <option value="-2">Basement -2 (Parking)</option>
                      <option value="-1">Basement -1 (Storage/Plant)</option>
                      <option value="0">Level 0 (Ground Retail)</option>
                      {Array.from({ length: currentBuilding.totalFloors }, (_, i) => i + 1).map((fl) => (
                        <option key={fl} value={fl}>
                          Floor {fl} {fl > 14 ? '(UNAUTHORIZED)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </Tooltip>
              </div>

              {/* Split View Shortcut Button */}
              <Tooltip
                title="2D vs 3D Cadastre Comparison"
                content="Opens side-by-side view contrasting the flat survey parcel against the vertical 3D digital twin."
                side="bottom"
              >
                <button
                  onClick={() => setDemoTab('split_view')}
                  className="btn-secondary h-[32px] px-3 text-[12px] flex items-center gap-1.5 cursor-pointer font-['Geist']"
                >
                  <Compass className="w-3.5 h-3.5 text-[#171717]" />
                  <span>Compare 2D vs 3D</span>
                </button>
              </Tooltip>
            </div>

            {/* 3D WebGL Canvas Viewport */}
            <div className="w-full h-[620px]">
              <ThreeDViewer
                building={currentBuilding}
                selectedUnit={selectedUnit}
                selectedUtility={selectedUtility}
                onSelectUnit={(unit) => setSelectedUnit(unit)}
                onSelectUtility={(util) => setSelectedUtility(util)}
                colorMode={colorMode}
                subsurfaceVisible={subsurfaceVisible}
                airRightsVisible={airRightsVisible}
                explosionFactor={explosionFactor}
                onExplosionChange={(val) => setExplosionFactor(val)}
                filterLevel={filterLevel}
              />
            </div>

            {/* Quick Helper Legend & Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[13px]">
              <div className="antimetal-card p-3 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#171717] shrink-0" />
                <div className="text-[#171717]/70 font-sans">
                  <strong className="text-[#171717] font-['Geist'] font-medium">Residential Units:</strong> Volumetric 3D envelope.
                </div>
              </div>
              <div className="antimetal-card p-3 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#171717]/50 shrink-0" />
                <div className="text-[#171717]/70 font-sans">
                  <strong className="text-[#171717] font-['Geist'] font-medium">Commercial / Retail:</strong> Distinct cadastral parcels.
                </div>
              </div>
              <div className="antimetal-card p-3 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e2e67d] border border-[#cfd45e] shrink-0" />
                <div className="text-[#171717]/70 font-sans">
                  <strong className="text-[#171717] font-['Geist'] font-medium">Subsurface Utilities:</strong> PNG Gas, Water, Power.
                </div>
              </div>
              <div className="antimetal-card p-3 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#171717] shrink-0" />
                <div className="text-[#171717]/70 font-sans">
                  <strong className="text-[#171717] font-['Geist'] font-medium">Encroachment Flags:</strong> Drone volumetric deviation.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 2D vs 3D SPLIT VIEW */}
        {viewMode === 'demo' && demoTab === 'split_view' && (
          <CadastreSplitView
            building={currentBuilding}
            onExploreIn3D={(unitId) => handleOpen3DWithUnit(unitId)}
          />
        )}

        {/* TAB 3: UNDERGROUND UTILITIES & DIG PERMIT SIMULATION */}
        {viewMode === 'demo' && demoTab === 'utilities' && (
          <UndergroundUtilityModule
            building={currentBuilding}
            onSelectUtility={(u) => {
              setSelectedUtility(u);
              setSelectedUnit(null);
              setSubsurfaceVisible(true);
              setDemoTab('3d_cadastre');
            }}
            onOpenIn3DView={() => {
              setSubsurfaceVisible(true);
              setDemoTab('3d_cadastre');
            }}
          />
        )}

        {/* TAB 4: AI EXTRACTION PIPELINE */}
        {viewMode === 'demo' && demoTab === 'ai_pipeline' && (
          <AiExtractionPipeline
            building={currentBuilding}
            onViewExploded={() => {
              setExplosionFactor(0.7);
              setDemoTab('3d_cadastre');
            }}
            onInspectEncroachment={() => setIsEncroachmentModalOpen(true)}
          />
        )}

        {/* TAB 5: SURVEYOR & TEHSILDAR GOVERNANCE */}
        {viewMode === 'demo' && demoTab === 'governance' && (
          <SurveyorGovernancePortal
            building={currentBuilding}
            onSelectUnit={(u) => setSelectedUnit(u)}
          />
        )}

        {/* TAB 6: CITIZEN SEARCH & TITLE VERIFICATION */}
        {viewMode === 'demo' && demoTab === 'citizen' && (
          <CitizenSearchPortal
            building={currentBuilding}
            onSelectUnit={(u) => setSelectedUnit(u)}
            onViewIn3D={() => {
              setExplosionFactor(0.6);
              setDemoTab('3d_cadastre');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#171717] text-white py-6 border-t border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]">
          <div className="flex items-center gap-2 text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e67d]" />
            <span className="font-['Geist'] font-medium text-white">Bhu-Drishti 3D</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">Volumetric Cadastre & 3D Land Records</span>
          </div>

          <div className="flex items-center gap-5 text-white/60 text-[12px] font-['Geist']">
            <button
              onClick={() => setIsPitchPlaybookOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Playbook
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Export Land Stack
            </button>
            <span className="text-white/30">•</span>
            <span className="text-white/40">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Unit Details Modal (When a 3D unit or item is clicked) */}
      <UnitDetailsModal
        unit={selectedUnit}
        onClose={() => setSelectedUnit(null)}
        onOpenCitizenCertificate={() => {
          setViewMode('demo');
          setDemoTab('citizen');
          setSelectedUnit(null);
        }}
      />

      {/* 2. Encroachment / Anti-Encroachment Change Detection Modal */}
      <EncroachmentDetectionModal
        building={currentBuilding}
        isOpen={isEncroachmentModalOpen}
        onClose={() => setIsEncroachmentModalOpen(false)}
        onHighlightUnauthorizedFloors={highlightUnauthorizedIn3D}
      />

      {/* 3. Land Stack & OGC Interoperability Export Modal */}
      <LandStackExportModal
        building={currentBuilding}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* 4. Event Showcase Playbook & Jury Defense Modal */}
      <PitchPlaybookModal
        isOpen={isPitchPlaybookOpen}
        onClose={() => setIsPitchPlaybookOpen(false)}
      />
    </div>
  );
}
