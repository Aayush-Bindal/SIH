import React, { useState } from 'react';
import { CadastralBuilding } from '../types';
import { AlertTriangle, CheckCircle2, XCircle, Download, FileText, Layers } from 'lucide-react';

interface EncroachmentDetectionModalProps {
  building: CadastralBuilding;
  isOpen: boolean;
  onClose: () => void;
  onHighlightUnauthorizedFloors: () => void;
}

export const EncroachmentDetectionModal: React.FC<EncroachmentDetectionModalProps> = ({
  building,
  isOpen,
  onClose,
  onHighlightUnauthorizedFloors,
}) => {
  const [noticeGenerated, setNoticeGenerated] = useState(false);

  if (!isOpen) return null;

  const deltaHeight = parseFloat((building.actualHeightM - building.sanctionedHeightM).toFixed(1));
  const unauthorizedUnits = building.units.filter(u => u.status === 'unauthorized_extension');
  const unauthorizedVolume = unauthorizedUnits.reduce((acc, u) => acc + u.dimensions.volumeM3, 0);
  const unauthorizedCarpet = unauthorizedUnits.reduce((acc, u) => acc + u.dimensions.carpetAreaSqM, 0);

  return (
    <div id="encroachment-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white border border-[#e5e7eb] rounded-[8px] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f9fafb] border-b border-[#e5e7eb] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="antimetal-chip-accent text-[11px] py-0.5 px-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#171717]" />
                <span>Anti-Encroachment AI Change Detection</span>
              </span>
              <span className="text-[12px] text-[#171717]/60 font-mono">FAR Violation #MCG-EV-2026-99</span>
            </div>
            <h2 className="text-[18px] font-['Geist'] font-medium text-[#171717]">
              Unauthorized Vertical Property Extension Detected
            </h2>
            <p className="text-[12px] text-[#171717]/60 font-sans">
              Target Property: <span className="font-['Geist'] font-medium text-[#171717]">{building.name}</span> | Base ULPIN: <span className="font-mono text-[#171717]">{building.baseParcelUlpin}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#171717]/50 hover:text-[#171717] hover:bg-[#e5e7eb]/40 rounded-[6px] transition-colors cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Comparison Cards: Pass 1 vs Pass 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Approved Sanctioned Baseline */}
            <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb]">
                <span className="text-[12px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#171717]" />
                  <span>Approved Municipal Sanction</span>
                </span>
                <span className="text-[11px] font-mono text-[#171717]/60">{building.dronePassDate1}</span>
              </div>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#171717]/60 font-['Geist']">Sanctioned Floors:</span>
                  <span className="font-medium text-[#171717] font-['Geist']">G + 14 Floors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#171717]/60 font-['Geist']">Sanctioned Height:</span>
                  <span className="font-mono font-medium text-[#171717]">{building.sanctionedHeightM} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#171717]/60 font-['Geist']">Permitted FAR:</span>
                  <span className="font-medium text-[#171717] font-['Geist']">2.75 Max</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#171717]/60 font-['Geist']">Municipal Plan #:</span>
                  <span className="font-mono text-[#171717]">DTCP/{building.id.toUpperCase()}/2024</span>
                </div>
              </div>
            </div>

            {/* Post-Construction Drone Scan */}
            <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#171717] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#171717]">
                <span className="text-[12px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#171717]" />
                  <span>LiDAR Drone Resurvey Pass</span>
                </span>
                <span className="text-[11px] font-mono text-[#171717] font-medium">{building.dronePassDate2}</span>
              </div>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#171717]/70 font-['Geist']">Measured Floors:</span>
                  <span className="font-medium font-['Geist'] text-[#171717]">G + 16 Floors (+2 ILLEGAL)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#171717]/70 font-['Geist']">Observed Roofline:</span>
                  <span className="font-mono font-medium text-[#171717]">{building.actualHeightM} m (+{deltaHeight}m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#171717]/70 font-['Geist']">Calculated Actual FAR:</span>
                  <span className="font-medium font-['Geist'] text-[#171717]">3.22 (FAR Overhang +0.47)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#171717]/70 font-['Geist']">Survey Method:</span>
                  <span className="text-[#171717]">NAKSHA Drone LiDAR DSM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Metric Breakdown */}
          <div className="p-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] space-y-3">
            <h4 className="text-[12px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/70">
              Unsanctioned Volumetric Quantum
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-[#e5e7eb] rounded-[6px] text-center">
                <div className="text-[11px] text-[#171717]/60 font-['Geist']">Excess Height</div>
                <div className="text-[18px] font-medium text-[#171717] font-mono">+{deltaHeight} m</div>
                <div className="text-[10px] text-[#171717]/40">Above Max Sanction</div>
              </div>

              <div className="p-3 bg-white border border-[#e5e7eb] rounded-[6px] text-center">
                <div className="text-[11px] text-[#171717]/60 font-['Geist']">Unauthorized Carpet</div>
                <div className="text-[18px] font-medium text-[#171717] font-mono">{unauthorizedCarpet.toFixed(1)} m²</div>
                <div className="text-[10px] text-[#171717]/40">~{Math.round(unauthorizedCarpet * 10.764)} sq.ft</div>
              </div>

              <div className="p-3 bg-white border border-[#e5e7eb] rounded-[6px] text-center">
                <div className="text-[11px] text-[#171717]/60 font-['Geist']">Encroached Volume</div>
                <div className="text-[18px] font-medium text-[#171717] font-mono">{unauthorizedVolume.toFixed(0)} m³</div>
                <div className="text-[10px] text-[#171717]/40">Unregistered Space</div>
              </div>
            </div>
          </div>

          {/* List of Illegal 3D Parcels */}
          <div className="space-y-2">
            <div className="text-[13px] font-['Geist'] font-medium text-[#171717]">
              Detected Unsanctioned Units (Blocked from Legal Mutation):
            </div>

            <div className="space-y-2">
              {unauthorizedUnits.map((u) => (
                <div
                  key={u.id}
                  className="p-3 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] text-[13px] flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-medium font-['Geist'] text-[#171717] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#171717]" />
                      <span>{u.unitNumber}</span>
                    </div>
                    <div className="text-[#171717]/60 font-mono text-[11px]">3D ULPIN: {u.ulpin3D}</div>
                    <div className="text-[#171717]/50 text-[11px]">Purported Holder: {u.ownership.ownerName}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="antimetal-chip-accent text-[10px] py-0.5 px-1.5">
                      NO DEED RECORD
                    </span>
                    <div className="text-[11px] text-[#171717]/60 mt-1 font-mono">Elev: +{u.dimensions.zBase}m</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Show-Cause Notice Preview */}
          {noticeGenerated && (
            <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#171717] text-[13px] space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb]">
                <div className="font-['Geist'] font-medium text-[#171717] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>OFFICIAL NOTICE UNDER SECTION 12 OF HARYANA URBAN REGULATION ACT</span>
                </div>
                <span className="font-mono text-[11px] text-[#171717]/60">REF: MCG/TOWN-PLAN/2026/0819</span>
              </div>
              <p className="text-[#171717]/80 leading-relaxed font-sans">
                To: Ashok Mittal / Cyber Heights Developers Pvt Ltd.
                Whereas an AI-enabled 3D volumetric cadastre survey conducted on {building.dronePassDate2} revealed unauthorized construction of Levels 15 & 16 (Height +{deltaHeight}m), exceeding sanctioned FAR. You are hereby ordered to show cause within 7 working days why demolition proceedings or compounding penalties should not be initiated. 3D ULPINs for these floors are frozen in the national Land Stack.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#f9fafb] border-t border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onHighlightUnauthorizedFloors();
              onClose();
            }}
            className="btn-secondary h-[36px] px-3.5 text-[12px] flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Highlight in 3D Scene</span>
          </button>

          <div className="flex items-center gap-2">
            {!noticeGenerated ? (
              <button
                onClick={() => setNoticeGenerated(true)}
                className="btn-primary h-[36px] px-4 text-[12px] flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Issue Municipal Show-Cause Notice</span>
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="btn-primary h-[36px] px-4 text-[12px] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print Notice PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-secondary h-[36px] px-3.5 text-[12px] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
