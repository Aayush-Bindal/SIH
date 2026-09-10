import React, { useState } from 'react';
import { CadastralBuilding, UnitCadastre, AuditLogEntry } from '../types';
import { MOCK_AUDIT_TRAIL } from '../data/mockCadastreData';
import { ShieldCheck, UserCheck, CheckCircle2, AlertTriangle, FileSignature, Sliders, History } from 'lucide-react';

interface SurveyorGovernancePortalProps {
  building: CadastralBuilding;
  onSelectUnit: (unit: UnitCadastre) => void;
}

export const SurveyorGovernancePortal: React.FC<SurveyorGovernancePortalProps> = ({
  building,
  onSelectUnit,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'audit_trail' | 'adjust'>('queue');
  const [selectedUnitToReview, setSelectedUnitToReview] = useState<UnitCadastre>(building.units[10]); // e.g. Unit 401
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(85);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_TRAIL);
  const [signedOffUnits, setSignedOffUnits] = useState<Set<string>>(new Set(['ch-b2-1', 'ch-g-1', 'ch-f1-u1']));
  const [microOffset, setMicroOffset] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const lowConfidenceCount = building.units.filter((u) => u.aiConfidence < 85).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSignOff = (unit: UnitCadastre) => {
    const newSigned = new Set(signedOffUnits);
    newSigned.add(unit.id);
    setSignedOffUnits(newSigned);

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ulpin3D: unit.ulpin3D,
      action: 'OFFICER_SIGN_OFF',
      actor: 'Suresh Chandra (Certified Surveyor Lic #DL-HR-881)',
      actorRole: 'SURVEYOR',
      details: `Official survey certification granted. 3D coordinates locked with micro-adjustment of ${microOffset > 0 ? `+${microOffset}` : microOffset}m.`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };

    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Signed off & certified 3D ULPIN: ${unit.ulpin3D}`);
  };

  return (
    <div id="surveyor-governance-portal" className="space-y-6">
      {/* Top Banner explaining Human-in-the-Loop Liability */}
      <div className="antimetal-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="antimetal-chip-accent text-[11px] py-0.5 px-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#171717]" />
              <span>Human-In-The-Loop Governance</span>
            </span>
            <span className="text-[12px] text-[#171717]/60 font-['Geist']">DoLR Statutory Record-of-Rights Integration</span>
          </div>
          <h2 className="text-[18px] font-medium font-['Geist'] text-[#171717]">Surveyor Review, Boundary Snapping & Tehsildar Sign-Off</h2>
          <p className="text-[13px] text-[#171717]/70 max-w-3xl mt-1 leading-relaxed font-sans">
            AI extractions are strictly <strong>advisory</strong> until certified by a licensed surveyor and confirmed by the Tehsildar. Every adjustment and verification creates an immutable, court-admissible audit log.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-[#f9fafb] p-2.5 rounded-[6px] border border-[#e5e7eb] text-[12px]">
          <div className="text-center px-2">
            <div className="text-[#171717] font-medium font-['Geist'] font-mono text-[16px]">{signedOffUnits.size}</div>
            <div className="text-[10px] text-[#171717]/60 font-sans">Certified Units</div>
          </div>
          <div className="w-px h-8 bg-[#e5e7eb]" />
          <div className="text-center px-2">
            <div className="text-[#171717] font-medium font-['Geist'] font-mono text-[16px]">{lowConfidenceCount}</div>
            <div className="text-[10px] text-[#171717]/60 font-sans">Under Review</div>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#e2e67d]/20 border border-[#cfd45e] rounded-[6px] text-[#171717] text-[13px] font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#171717]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3.5 py-1.5 text-[13px] font-['Geist'] font-medium rounded-[6px] transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-[#171717] text-white'
              : 'text-[#171717]/70 hover:text-[#171717] hover:bg-[#f9fafb]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Surveyor Review Queue ({building.units.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('adjust')}
          className={`px-3.5 py-1.5 text-[13px] font-['Geist'] font-medium rounded-[6px] transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'adjust'
              ? 'bg-[#171717] text-white'
              : 'text-[#171717]/70 hover:text-[#171717] hover:bg-[#f9fafb]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Boundary Snapping & Calibration</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_trail')}
          className={`px-3.5 py-1.5 text-[13px] font-['Geist'] font-medium rounded-[6px] transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit_trail'
              ? 'bg-[#171717] text-white'
              : 'text-[#171717]/70 hover:text-[#171717] hover:bg-[#f9fafb]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Immutable Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Review Queue */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Filter & List */}
          <div className="lg:col-span-6 antimetal-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717] flex items-center gap-2">
                <span>Parcels Awaiting Certification</span>
              </h3>
              <div className="flex items-center gap-2 text-[12px] text-[#171717]/60 font-['Geist']">
                <span>Min Conf:</span>
                <span className="font-mono text-[#171717] font-medium">{confidenceThreshold}%</span>
              </div>
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="60"
                max="98"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                className="w-full accent-[#171717] h-1.5 bg-[#e5e7eb] rounded-[6px] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#171717]/50 mt-1">
                <span>60% (Anomaly Flags)</span>
                <span>85% (Standard)</span>
                <span>98% (Ground-Truth Verified)</span>
              </div>
            </div>

            {/* Units List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {building.units.map((u) => {
                const isCertified = signedOffUnits.has(u.id);
                const isSelected = selectedUnitToReview.id === u.id;
                const isUnauthorized = u.status === 'unauthorized_extension';

                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSelectedUnitToReview(u);
                      onSelectUnit(u);
                    }}
                    className={`cursor-pointer p-3 rounded-[6px] border transition-all text-[13px] flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#f9fafb] border-[#171717]'
                        : 'bg-white border-[#e5e7eb] hover:border-[#171717]/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-[#171717]">{u.unitNumber}</span>
                        {isUnauthorized && (
                          <span className="antimetal-chip-accent text-[10px] py-0.5 px-1.5">
                            ILLEGAL
                          </span>
                        )}
                        {isCertified && (
                          <span className="antimetal-chip text-[10px] py-0.5 px-1.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>CERTIFIED</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[#171717]/60 font-mono text-[11px]">{u.ulpin3D}</div>
                      <div className="text-[#171717]/50 text-[11px]">Owner: {u.ownership.ownerName}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-medium text-[12px] text-[#171717]">
                        {u.aiConfidence}% Conf
                      </div>
                      <div className="text-[11px] text-[#171717]/50">{u.dimensions.volumeM3} m³</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Parcel Verification & Sign-Off Panel */}
          <div className="lg:col-span-6 antimetal-card p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-[#e5e7eb]">
                <div>
                  <span className="text-[11px] font-mono text-[#171717] bg-[#f9fafb] px-2 py-0.5 rounded-[4px] border border-[#e5e7eb] font-medium">
                    {selectedUnitToReview.ulpin3D}
                  </span>
                  <h4 className="text-[16px] font-['Geist'] font-medium text-[#171717] mt-1.5">{selectedUnitToReview.unitNumber}</h4>
                  <p className="text-[12px] text-[#171717]/60">Level {selectedUnitToReview.level} • {selectedUnitToReview.layerType}</p>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-[#171717]/60 font-['Geist']">AI Confidence</div>
                  <div className="text-[18px] font-medium font-['Geist'] font-mono text-[#171717]">
                    {selectedUnitToReview.aiConfidence}%
                  </div>
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="space-y-2 text-[13px]">
                <div className="text-[#171717] font-['Geist'] font-medium">Surveyor Verification Checklist:</div>

                <div className="p-2.5 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between">
                  <span className="text-[#171717]/80">1. CORS GNSS Datum Alignment (WGS84 / Everest)</span>
                  <span className="text-[#171717] font-medium font-['Geist'] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between">
                  <span className="text-[#171717]/80">2. 3D Manifoldness & Zero Overlap with Floor {selectedUnitToReview.level - 1}</span>
                  <span className="text-[#171717] font-medium font-['Geist'] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between">
                  <span className="text-[#171717]/80">3. RERA Floor Plan Vector Match</span>
                  <span className="text-[#171717] font-medium font-mono">Δ 0.04m (Within tolerance)</span>
                </div>

                <div className="p-2.5 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between">
                  <span className="text-[#171717]/80">4. State Registration Department Deed Sync</span>
                  <span className="text-[#171717] font-mono">{selectedUnitToReview.ownership.deedNumber}</span>
                </div>
              </div>

              {/* Spatial Metrics Box */}
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] grid grid-cols-3 gap-2 text-[12px]">
                <div>
                  <div className="text-[10px] text-[#171717]/60">Z-Base Elevation</div>
                  <div className="font-mono font-medium text-[#171717]">+{selectedUnitToReview.dimensions.zBase} m</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#171717]/60">Vertical Height</div>
                  <div className="font-mono font-medium text-[#171717]">{selectedUnitToReview.dimensions.height} m</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#171717]/60">Total Enclosed Vol.</div>
                  <div className="font-mono font-medium text-[#171717]">{selectedUnitToReview.dimensions.volumeM3} m³</div>
                </div>
              </div>
            </div>

            {/* Official Sign Off CTA */}
            <div className="pt-3 border-t border-[#e5e7eb] space-y-2">
              {signedOffUnits.has(selectedUnitToReview.id) ? (
                <div className="p-3 bg-[#f9fafb] border border-[#171717] rounded-[6px] text-center text-[12px] text-[#171717] font-['Geist'] font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Officially Certified by Revenue Officer (Signed & Locked)</span>
                </div>
              ) : selectedUnitToReview.status === 'unauthorized_extension' ? (
                <div className="p-3 bg-[#f9fafb] border border-[#171717] rounded-[6px] text-center text-[12px] text-[#171717] font-['Geist'] font-medium flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Cannot Certify: Unauthorized FAR Breach Flagged</span>
                </div>
              ) : (
                <button
                  id="btn-sign-off-parcel"
                  onClick={() => handleSignOff(selectedUnitToReview)}
                  className="btn-primary w-full h-[40px] text-[13px]"
                >
                  <FileSignature className="w-4 h-4" />
                  <span>Apply Surveyor Digital Certificate & Lock 3D ULPIN</span>
                </button>
              )}
              <div className="text-[11px] text-[#171717]/50 text-center font-sans">
                Appends SHA-256 hash to DoLR National Land Stack Base Registry.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Boundary Snapping */}
      {activeTab === 'adjust' && (
        <div className="antimetal-card p-6 space-y-6">
          <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717] flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Interactive Micro-Adjustment & CORS Ground-Truth Snapping</span>
          </h3>

          <p className="text-[13px] text-[#171717]/70 leading-relaxed font-sans">
            When ground-truth CORS station coordinates differ slightly from drone orthomosaics, licensed surveyors can apply micro-shifts (within statutory ±0.15m tolerances) to snap the volumetric envelope before locking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] space-y-4">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#171717]/60 font-['Geist']">Active Unit:</span>
                <span className="font-mono text-[#171717] font-medium">{selectedUnitToReview.ulpin3D}</span>
              </div>

              <div>
                <div className="flex justify-between text-[12px] text-[#171717] mb-1 font-['Geist'] font-medium">
                  <span>North-South Planimetric Offset:</span>
                  <span className="font-mono font-medium text-[#171717]">{microOffset > 0 ? `+${microOffset}` : microOffset} m</span>
                </div>
                <input
                  type="range"
                  min="-0.15"
                  max="0.15"
                  step="0.01"
                  value={microOffset}
                  onChange={(e) => setMicroOffset(parseFloat(e.target.value))}
                  className="w-full accent-[#171717] h-1.5 bg-[#e5e7eb] rounded-[6px] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
                  <span>-0.15m (West/South)</span>
                  <span>0.00m (AI Baseline)</span>
                  <span>+0.15m (East/North)</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#e5e7eb] rounded-[6px] text-[12px] space-y-1">
                <div className="text-[#171717]/60">Ground Control Reference:</div>
                <div className="font-mono text-[#171717] font-medium">Survey of India CORS Node #GGM-DLF-02</div>
                <div className="text-[#171717]/50 text-[10px]">RMS Residual: 0.012m (Survey Grade)</div>
              </div>

              <button
                onClick={() => {
                  showToast(`Snapped boundary offset applied (${microOffset}m). Volume re-calculated.`);
                }}
                className="btn-primary w-full h-[36px] text-[12px]"
              >
                Apply Snapping Calibration
              </button>
            </div>

            <div className="p-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[13px] font-['Geist'] font-medium text-[#171717]">Legal Safeguards & Limits:</div>
                <ul className="text-[12px] text-[#171717]/70 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0" />
                    <span>Offsets beyond ±0.15m automatically trigger physical field re-survey notice.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0" />
                    <span>Prevents encroaching into adjacent vertical parcels or utility easements.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#171717] shrink-0" />
                    <span>Every calibrated node is signed with the surveyor&apos;s digital key.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-white border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#171717] font-['Geist']">
                Status: In conformance with National Geospatial Policy 2022 survey tolerances.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Immutable Audit Trail */}
      {activeTab === 'audit_trail' && (
        <div className="antimetal-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717] flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>Court-Admissible Append-Only Cadastral Audit Log</span>
            </h3>
            <span className="text-[12px] text-[#171717]/60 font-mono">DILRMP Section 6 Compliance</span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] text-[13px] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-medium bg-white text-[#171717] border border-[#e5e7eb]">
                      {log.action}
                    </span>
                    <span className="font-mono text-[#171717]">{log.ulpin3D}</span>
                    <span className="text-[#171717]/40">• {log.timestamp}</span>
                  </div>
                  <div className="text-[#171717] font-sans">{log.details}</div>
                  <div className="text-[#171717]/60 text-[11px]">Actor: {log.actor}</div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-[10px] text-[#171717]/50 font-['Geist']">Cryptographic Hash</div>
                  <div className="font-mono text-[11px] text-[#171717] font-medium">{log.hash}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
