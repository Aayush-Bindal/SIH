import React, { useState } from 'react';
import { CadastralBuilding } from '../types';
import { Layers, CheckCircle2, ArrowRight, AlertTriangle, Compass } from 'lucide-react';

interface CadastreSplitViewProps {
  building: CadastralBuilding;
  onExploreIn3D: (unitId?: string) => void;
}

export const CadastreSplitView: React.FC<CadastreSplitViewProps> = ({ building, onExploreIn3D }) => {
  return (
    <div id="cadastre-split-view-container" className="space-y-6">
      {/* Educational Header Banner directly quoting Problem Statement 1.2 */}
      <div className="antimetal-card p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="antimetal-chip-accent text-[11px] py-0.5 px-2">
                Core Architectural Comparison
              </span>
              <span className="text-[12px] text-[#171717]/60 font-['Geist']">DoLR Land Stack Problem Statement ::26014</span>
            </div>
            <h2 className="text-[18px] font-medium font-['Geist'] text-[#171717] leading-snug">
              Why 2D Cadastre Breaks Down in Vertical India vs. The 3D ULPIN Solution
            </h2>
            <p className="text-[13px] text-[#171717]/70 leading-relaxed font-sans">
              India&apos;s existing land record backbone (DILRMP, SVAMITVA, NAKSHA) was designed for a 2D, single-owner-per-plot world. Modern urban vertical buildings collapse dozens of distinct legal owners, subsurface utilities, and air-rights into a single blind footprint.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white p-3 rounded-[6px] border border-[#e5e7eb]">
            <div className="text-center px-3 border-r border-[#e5e7eb]">
              <div className="text-[16px] font-medium font-['Geist'] text-[#171717]">66%</div>
              <div className="text-[11px] text-[#171717]/60 font-sans">Civil Cases Property</div>
            </div>
            <div className="text-center px-3 border-r border-[#e5e7eb]">
              <div className="text-[16px] font-medium font-['Geist'] text-[#171717]">7.3M</div>
              <div className="text-[11px] text-[#171717]/60 font-sans">Pending Cases</div>
            </div>
            <div className="text-center px-3">
              <div className="text-[16px] font-medium font-['Geist'] text-[#171717]">20 Yrs</div>
              <div className="text-[11px] text-[#171717]/60 font-sans">Avg Resolution Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Split View Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: The Status Quo (Conventional 2D Land Record) */}
        <div className="antimetal-card p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#171717]" />
              <span className="font-['Geist'] font-medium text-[14px] text-[#171717]">Conventional 2D Cadastral Record (Status Quo)</span>
            </div>
            <span className="text-[11px] font-mono bg-white text-[#171717] px-2 py-0.5 rounded-[4px] border border-[#e5e7eb] font-medium">
              ULPIN: {building.baseParcelUlpin}
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            {/* SVG Visual: Flat 2D Boundary Polygon */}
            <div className="relative h-56 bg-[#f9fafb] rounded-[6px] border border-[#e5e7eb] flex items-center justify-center overflow-hidden p-4">
              <div className="absolute top-3 left-3 text-[11px] font-mono text-[#171717]/60 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Survey Planimetric Map (2D)</span>
              </div>

              <svg viewBox="0 0 300 200" className="w-full h-full max-w-xs">
                {/* Adjacent Parcels in faint gray */}
                <polygon points="10,10 90,10 90,90 10,90" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1.5" />
                <text x="32" y="55" fill="#171717" opacity="0.5" fontSize="10" fontFamily="monospace">Khasra 104</text>

                <polygon points="210,10 290,10 290,90 210,90" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1.5" />
                <text x="232" y="55" fill="#171717" opacity="0.5" fontSize="10" fontFamily="monospace">Khasra 106</text>

                {/* Road */}
                <rect x="0" y="150" width="300" height="40" fill="#f9fafb" stroke="#e5e7eb" strokeDasharray="4 4" />
                <text x="105" y="174" fill="#171717" opacity="0.5" fontSize="10" fontFamily="sans-serif">Main Sector Road (24m)</text>

                {/* Target Parcel (Flattened single polygon) */}
                <polygon
                  points="100,20 200,20 200,140 100,140"
                  fill="#f3f4f6"
                  stroke="#171717"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <circle cx="150" cy="80" r="4" fill="#171717" />
                <text x="115" y="75" fill="#171717" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Plot #42 (2D ONLY)
                </text>
                <text x="118" y="92" fill="#171717" opacity="0.7" fontSize="9" fontFamily="monospace">
                  14-Digit Base ID
                </text>
              </svg>

              <div className="absolute bottom-3 right-3 text-[11px] text-[#171717] font-['Geist'] font-medium bg-[#e2e67d] px-2 py-0.5 rounded-full border border-[#cfd45e]">
                Blind to 16 Vertical Floors
              </div>
            </div>

            {/* Failure Modes List */}
            <div className="space-y-2 text-[13px]">
              <div className="text-[#171717] font-['Geist'] font-medium">Critical Blind Spots of 2D Cadastre:</div>
              <ul className="space-y-2 text-[#171717]/70 font-sans">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#171717] font-['Geist'] font-medium">Unit Ambiguity:</strong> Cannot distinguish who owns Flat 1402 vs Flat 402 vs Ground floor shop — all share one single footprint.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#171717] font-['Geist'] font-medium">Subsurface Blindness:</strong> Invisible to PNG pipes 2.8m below, causing frequent rupture strikes during road trenching.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#171717] font-['Geist'] font-medium">Undetected Encroachment:</strong> Builder added 2 unauthorized penthouse floors above sanctioned FAR without any cadastral flag.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#171717] flex items-center justify-between">
              <span>Legal Result: Indefinite Title Disputes & Litigation</span>
              <span className="font-['Geist'] font-medium">~20 Year Court Delay</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Solution (3D Volumetric ULPIN Cadastre) */}
        <div className="antimetal-card p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#171717]" />
              <span className="font-['Geist'] font-medium text-[14px] text-[#171717]">Volumetric 3D ULPIN Cadastre (This System)</span>
            </div>
            <span className="text-[11px] font-mono bg-[#e2e67d] text-[#171717] px-2 py-0.5 rounded-full border border-[#cfd45e] font-medium">
              ISO 19152 LADM
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            {/* Visual Interactive Floor Stack */}
            <div className="bg-[#f9fafb] rounded-[6px] border border-[#e5e7eb] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-['Geist'] font-medium text-[#171717] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#171717]" />
                  <span>Volumetric Hierarchy Breakdown</span>
                </span>
                <span className="text-[11px] text-[#171717] font-mono font-medium bg-white px-2 py-0.5 rounded border border-[#e5e7eb]">
                  42 Discrete 3D Envelopes
                </span>
              </div>

              {/* Stack items */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {/* Level 16 (Unauthorized) */}
                <div
                  onClick={() => onExploreIn3D('ch-f16-u1')}
                  className="cursor-pointer p-2.5 rounded-[6px] bg-white border border-[#171717] hover:bg-[#f9fafb] transition-colors flex items-center justify-between text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                    <span className="font-mono text-[#171717] font-medium">FL16-U1601</span>
                    <span className="text-[#171717] font-sans">Penthouse 1601 (Unauthorized +6.8m)</span>
                  </div>
                  <span className="antimetal-chip-accent text-[11px] py-0.5 px-2">
                    Illegal Floor
                  </span>
                </div>

                {/* Level 14 (Sample Registered Flat) */}
                <div
                  onClick={() => onExploreIn3D('ch-f14-u1')}
                  className="cursor-pointer p-2.5 rounded-[6px] bg-white border border-[#e5e7eb] hover:border-[#171717] transition-colors flex items-center justify-between text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                    <span className="font-mono text-[#171717] font-medium">FL14-U1401</span>
                    <span className="text-[#171717] font-sans">Unit 1401 (Apex Cloud Systems)</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#171717]/60">Vol: 599.0 m³</span>
                </div>

                {/* Level 0 Ground Shop */}
                <div
                  onClick={() => onExploreIn3D('ch-g-1')}
                  className="cursor-pointer p-2.5 rounded-[6px] bg-white border border-[#e5e7eb] hover:border-[#171717] transition-colors flex items-center justify-between text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                    <span className="font-mono text-[#171717] font-medium">FL00-SH01</span>
                    <span className="text-[#171717] font-sans">State Bank of India e-Corner</span>
                  </div>
                  <span className="antimetal-chip text-[11px] py-0.5 px-2">Commercial</span>
                </div>

                {/* Basement Parking */}
                <div
                  onClick={() => onExploreIn3D('ch-b2-1')}
                  className="cursor-pointer p-2.5 rounded-[6px] bg-white border border-[#e5e7eb] hover:border-[#171717] transition-colors flex items-center justify-between text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#171717]/50" />
                    <span className="font-mono text-[#171717] font-medium">BS02-PK01</span>
                    <span className="text-[#171717]/80 font-sans">Basement Bay P1 (Sharma Family)</span>
                  </div>
                  <span className="text-[11px] text-[#171717]/60 font-mono">Depth -6.0m</span>
                </div>

                {/* Subsurface Gas Utility */}
                <div
                  onClick={() => onExploreIn3D()}
                  className="cursor-pointer p-2.5 rounded-[6px] bg-white border border-[#e5e7eb] hover:border-[#171717] transition-colors flex items-center justify-between text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e2e67d]" />
                    <span className="font-mono text-[#171717] font-medium">UT-PNG01</span>
                    <span className="text-[#171717] font-sans">Indraprastha Gas 200mm Main</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#171717]/70">-2.8m Subsurface</span>
                </div>
              </div>
            </div>

            {/* Core Superpowers */}
            <div className="space-y-2 text-[13px]">
              <div className="text-[#171717] font-['Geist'] font-medium">3D Cadastre Advantages:</div>
              <ul className="space-y-2 text-[#171717]/70 font-sans">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#171717] font-['Geist'] font-medium">Hierarchical 3D ULPIN:</strong> Base parcel is appended with <code className="text-[#171717] font-mono bg-[#f3f4f6] px-1 py-0.5 rounded border border-[#e5e7eb]">-FL14-U1402</code>, making every apartment a machine-verifiable spatial asset.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#171717] font-['Geist'] font-medium">Integrated Subsurface & Dig-Permits:</strong> Gas, power, and telecom lines mapped in the identical 3D coordinate frame to avert strikes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#171717] font-['Geist'] font-medium">Drone AI Encroachment Check:</strong> Flags unauthorized vertical floors in real time, alerting municipal enforcement before fraudulent sales occur.
                  </span>
                </li>
              </ul>
            </div>

            <button
              id="btn-switch-to-3d-scene"
              onClick={() => onExploreIn3D()}
              className="btn-primary w-full h-[40px] text-[13px]"
            >
              <span>Explore Interactive 3D Exploded Cadastre</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
