import React, { useState } from 'react';
import { CadastralBuilding, UndergroundUtility, DigPermitQuery } from '../types';
import { AlertTriangle, CheckCircle2, Zap, Flame, Droplets, Radio, Eye, FileCheck, ArrowRight } from 'lucide-react';

interface UndergroundUtilityModuleProps {
  building: CadastralBuilding;
  onSelectUtility: (util: UndergroundUtility) => void;
  onOpenIn3DView: () => void;
}

export const UndergroundUtilityModule: React.FC<UndergroundUtilityModuleProps> = ({
  building,
  onSelectUtility,
  onOpenIn3DView,
}) => {
  const [applicant, setApplicant] = useState('Reliance Jio Infocomm Ltd (Fiber O&M)');
  const [purpose, setPurpose] = useState('5G Micro-Trenching for Fiber Duct Laying');
  const [depthMeters, setDepthMeters] = useState<number>(2.5);
  const [widthMeters, setWidthMeters] = useState<number>(0.8);
  const [permitResult, setPermitResult] = useState<DigPermitQuery | null>(null);
  const [activeTab, setActiveTab] = useState<'utilities' | 'simulation'>('simulation');

  const runConflictCheck = () => {
    const conflicts: DigPermitQuery['conflicts'] = [];

    building.utilities.forEach((u) => {
      const verticalDistance = Math.abs(u.depthMeters - depthMeters);
      const proximity = verticalDistance; // meters

      if (proximity <= u.bufferZoneMeters) {
        conflicts.push({
          utilityUlpin: u.ulpin3D,
          utilityType: `${u.operatorName} (${u.utilityType.toUpperCase()})`,
          proximityMeters: parseFloat(proximity.toFixed(2)),
          safeDistanceRequired: u.bufferZoneMeters,
          severity: proximity < 0.4 ? 'danger' : 'warning',
        });
      }
    });

    const isConflict = conflicts.length > 0;
    const newPermit: DigPermitQuery = {
      permitId: `DP-GGM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      applicant,
      purpose,
      targetParcelUlpin: building.baseParcelUlpin,
      proposedDepthMeters: depthMeters,
      proposedWidthMeters: widthMeters,
      trenchLengthMeters: 35.0,
      status: isConflict ? 'conflict_detected' : 'approved',
      conflicts,
    };

    setPermitResult(newPermit);
  };

  const getUtilityIcon = (type: UndergroundUtility['utilityType']) => {
    switch (type) {
      case 'gas_png':
        return <Flame className="w-4 h-4 text-amber-600" />;
      case 'water_potable':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'power_highvoltage':
        return <Zap className="w-4 h-4 text-rose-600" />;
      case 'telecom_ofc':
        return <Radio className="w-4 h-4 text-emerald-600" />;
      default:
        return <Zap className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div id="underground-utility-module" className="space-y-6">
      {/* Intro Header */}
      <div className="antimetal-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="antimetal-chip-accent text-[11px] py-0.5 px-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#171717]" />
              <span>Subsurface 3D Asset Management</span>
            </span>
            <span className="text-[12px] text-[#171717]/60 font-['Geist']">DoLR Land Stack Unified Coordinate Frame</span>
          </div>
          <h2 className="text-[18px] font-medium font-['Geist'] text-[#171717]">Underground Utilities & Dig-Permit Conflict Simulation</h2>
          <p className="text-[13px] text-[#171717]/70 max-w-3xl mt-1 leading-relaxed font-sans">
            In urban India, digging for optical fiber or drainage without authoritative 3D utility cadastre results in severe gas leaks, water cuts, and fiber blackouts. Here, underground utilities are assigned 3D ULPINs and cross-referenced before excavation permits are issued.
          </p>
        </div>

        <button
          id="btn-view-utilities-in-3d"
          onClick={onOpenIn3DView}
          className="btn-primary shrink-0 h-[36px] px-3.5 text-[12px]"
        >
          <Eye className="w-4 h-4" />
          <span>Toggle 3D Subsurface X-Ray</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-2">
        <button
          id="tab-dig-permit-sim"
          onClick={() => setActiveTab('simulation')}
          className={`px-3.5 py-1.5 text-[13px] font-['Geist'] font-medium rounded-[6px] transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'simulation'
              ? 'bg-[#171717] text-white'
              : 'text-[#171717]/70 hover:text-[#171717] hover:bg-[#f9fafb]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Dig-Permit Collision Checker</span>
        </button>
        <button
          id="tab-subsurface-inventory"
          onClick={() => setActiveTab('utilities')}
          className={`px-3.5 py-1.5 text-[13px] font-['Geist'] font-medium rounded-[6px] transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'utilities'
              ? 'bg-[#171717] text-white'
              : 'text-[#171717]/70 hover:text-[#171717] hover:bg-[#f9fafb]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Subsurface 3D ULPIN Inventory ({building.utilities.length})</span>
        </button>
      </div>

      {/* TAB 1: Dig Permit Collision Simulator */}
      {activeTab === 'simulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Form */}
          <div className="lg:col-span-5 antimetal-card p-5 space-y-4">
            <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#171717]" />
              <span>Excavation & Trenching Request</span>
            </h3>

            <div className="space-y-3 text-[13px]">
              <div>
                <label className="block text-[#171717]/70 mb-1 font-['Geist'] font-medium text-[12px]">Applicant / Agency</label>
                <input
                  type="text"
                  value={applicant}
                  onChange={(e) => setApplicant(e.target.value)}
                  className="antimetal-input"
                />
              </div>

              <div>
                <label className="block text-[#171717]/70 mb-1 font-['Geist'] font-medium text-[12px]">Excavation Purpose</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="antimetal-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[#171717]/70 mb-1 text-[12px]">
                    <span>Trench Depth</span>
                    <span className="font-mono text-[#171717] font-medium">{depthMeters} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.1"
                    value={depthMeters}
                    onChange={(e) => setDepthMeters(parseFloat(e.target.value))}
                    className="w-full accent-[#171717] h-1.5 bg-[#e5e7eb] rounded-[6px] cursor-pointer"
                  />
                  <span className="text-[11px] text-[#171717]/50">Subsurface depth</span>
                </div>

                <div>
                  <div className="flex justify-between text-[#171717]/70 mb-1 text-[12px]">
                    <span>Trench Width</span>
                    <span className="font-mono text-[#171717] font-medium">{widthMeters} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.1"
                    value={widthMeters}
                    onChange={(e) => setWidthMeters(parseFloat(e.target.value))}
                    className="w-full accent-[#171717] h-1.5 bg-[#e5e7eb] rounded-[6px] cursor-pointer"
                  />
                  <span className="text-[11px] text-[#171717]/50">Horizontal breadth</span>
                </div>
              </div>

              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] space-y-1">
                <div className="text-[#171717]/60 text-[12px]">Target Cadastral Parcel:</div>
                <div className="font-mono text-[#171717] font-medium">{building.baseParcelUlpin}</div>
                <div className="text-[11px] text-[#171717]/70">{building.name} ({building.location})</div>
              </div>
            </div>

            <button
              id="btn-run-conflict-check"
              onClick={runConflictCheck}
              className="btn-primary w-full h-[40px] text-[13px]"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate 3D Collision Detection</span>
            </button>

            {/* Presets */}
            <div className="pt-2 border-t border-[#e5e7eb]">
              <div className="text-[12px] font-['Geist'] font-medium text-[#171717]/60 mb-2">Quick test scenarios:</div>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <button
                  onClick={() => {
                    setApplicant('Indraprastha Gas O&M Team');
                    setPurpose('PNG Valve Replacement (Emergency)');
                    setDepthMeters(2.8);
                    runConflictCheck();
                  }}
                  className="p-2.5 bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-[#171717] rounded-[6px] text-left transition-colors font-sans cursor-pointer"
                >
                  2.8m Deep Trench (Gas Line Level)
                </button>
                <button
                  onClick={() => {
                    setApplicant('Smart City Telecom Ducting');
                    setPurpose('Shallow Fiber Conduit');
                    setDepthMeters(0.8);
                    runConflictCheck();
                  }}
                  className="p-2.5 bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-[#171717] rounded-[6px] text-left transition-colors font-sans cursor-pointer"
                >
                  0.8m Shallow Trench (Safe)
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 antimetal-card p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
                <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#171717]" />
                  <span>Municipal Dig-Permit Collision Report</span>
                </h3>
                {permitResult && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-['Geist'] font-medium uppercase font-mono ${
                      permitResult.status === 'conflict_detected'
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#e2e67d] text-[#171717] border border-[#cfd45e]'
                    }`}
                  >
                    {permitResult.status === 'conflict_detected' ? 'CONFLICT DETECTED' : 'CLEARANCE APPROVED'}
                  </span>
                )}
              </div>

              {!permitResult ? (
                <div className="py-16 text-center text-[#171717]/60 space-y-2">
                  <AlertTriangle className="w-8 h-8 mx-auto text-[#171717]/30" />
                  <p className="text-[13px]">Click &quot;Simulate 3D Collision Detection&quot; to test the proposed trench depth against subsurface utility easements.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Summary Alert */}
                  {permitResult.status === 'conflict_detected' ? (
                    <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#171717] text-[#171717] text-[13px] space-y-1.5">
                      <div className="font-['Geist'] font-medium flex items-center gap-2 text-[14px] text-[#171717]">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>CRITICAL CONFLICT: Proposed excavation intersects active utility buffer zone!</span>
                      </div>
                      <p className="text-[#171717]/70 leading-relaxed font-sans">
                        Excavation at depth <strong>{permitResult.proposedDepthMeters}m</strong> violates minimum safe separation buffers. Digging without joint utility supervision will cause pipe rupture.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] text-[#171717] text-[13px] space-y-1.5">
                      <div className="font-['Geist'] font-medium flex items-center gap-2 text-[14px] text-[#171717]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Automated NOC Granted: No subsurface conflicts within buffer range</span>
                      </div>
                      <p className="text-[#171717]/70 leading-relaxed font-sans">
                        Proposed excavation depth of {permitResult.proposedDepthMeters}m maintains sufficient clearance (&gt;1.0m) from all registered underground utility corridors.
                      </p>
                    </div>
                  )}

                  {/* Conflict Item Details */}
                  {permitResult.conflicts.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[12px] font-['Geist'] font-medium text-[#171717]">Colliding Subsurface Utilities:</div>
                      {permitResult.conflicts.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] text-[13px] flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="font-['Geist'] font-medium text-[#171717] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#171717]" />
                              <span>{c.utilityType}</span>
                            </div>
                            <div className="text-[#171717]/60 font-mono text-[11px]">3D ULPIN: {c.utilityUlpin}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-medium font-['Geist'] text-[#171717] font-mono">Δ {c.proximityMeters} m</div>
                            <div className="text-[11px] text-[#171717]/50">Req Buffer: {c.safeDistanceRequired}m</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Permit Metadata */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] text-[12px]">
                    <div>
                      <span className="text-[#171717]/60">Permit Reference ID:</span>
                      <div className="font-mono text-[#171717] font-medium">{permitResult.permitId}</div>
                    </div>
                    <div>
                      <span className="text-[#171717]/60">Evaluation Engine:</span>
                      <div className="text-[#171717] font-medium">Spatial Graph 3D Intersect v2.4</div>
                    </div>
                    <div>
                      <span className="text-[#171717]/60">Target Base Parcel:</span>
                      <div className="font-mono text-[#171717] font-medium">{permitResult.targetParcelUlpin}</div>
                    </div>
                    <div>
                      <span className="text-[#171717]/60">DoLR Land Stack Sync:</span>
                      <div className="text-[#171717] font-medium">Logged to Audit Spine</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {permitResult && (
              <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-between text-[12px]">
                <span className="text-[#171717]/60">DoLR Unified Cadastral Dig Permit Gateway</span>
                <button
                  onClick={onOpenIn3DView}
                  className="btn-secondary h-[32px] px-3 text-[12px] flex items-center gap-1.5"
                >
                  <span>Highlight Pipes in 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Subsurface Utilities Inventory */}
      {activeTab === 'utilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {building.utilities.map((u) => (
            <div
              key={u.id}
              onClick={() => onSelectUtility(u)}
              className="cursor-pointer antimetal-card hover:border-[#171717] transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] group-hover:border-[#171717]">
                    {getUtilityIcon(u.utilityType)}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-['Geist'] font-medium text-[#171717]">
                      {u.operatorName}
                    </h4>
                    <span className="font-mono text-[12px] text-[#171717]/70 font-medium">{u.ulpin3D}</span>
                  </div>
                </div>
                <span className="antimetal-chip text-[11px] py-0.5 px-2">
                  {u.riskLevel} Risk
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[12px] bg-[#f9fafb] p-2.5 rounded-[6px] border border-[#e5e7eb]">
                <div>
                  <div className="text-[#171717]/60 text-[10px]">Subsurface Depth</div>
                  <div className="font-mono font-medium text-[#171717]">-{u.depthMeters} m</div>
                </div>
                <div>
                  <div className="text-[#171717]/60 text-[10px]">Conduit Diameter</div>
                  <div className="font-mono font-medium text-[#171717]">{u.diameterMm} mm</div>
                </div>
                <div>
                  <div className="text-[#171717]/60 text-[10px]">Safety Buffer</div>
                  <div className="font-mono font-medium text-[#171717]">±{u.bufferZoneMeters} m</div>
                </div>
              </div>

              <div className="text-[12px] text-[#171717]/60 flex items-center justify-between">
                <span>Status: <strong className="text-[#171717] capitalize font-medium">{u.status}</strong></span>
                <span className="text-[#171717] group-hover:underline flex items-center gap-1 font-['Geist'] font-medium text-[12px]">
                  <span>Inspect 3D Geometry</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
