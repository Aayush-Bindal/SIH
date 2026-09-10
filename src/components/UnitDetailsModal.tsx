import React from 'react';
import { UnitCadastre } from '../types';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, XCircle, Hash, Landmark, User, Layers } from 'lucide-react';

interface UnitDetailsModalProps {
  unit: UnitCadastre | null;
  onClose: () => void;
  onOpenCitizenCertificate?: (unit: UnitCadastre) => void;
}

export const UnitDetailsModal: React.FC<UnitDetailsModalProps> = ({ unit, onClose, onOpenCitizenCertificate }) => {
  if (!unit) return null;

  const isUnauthorized = unit.status === 'unauthorized_extension';
  const hasCourtStay = unit.ownership.encumbranceStatus === 'court_stay';

  return (
    <div id="unit-details-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-[#e5e7eb] rounded-[8px] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Status Banner */}
        <div className={`px-6 py-4 border-b ${isUnauthorized ? 'bg-[#f9fafb] border-[#171717]' : 'bg-[#f9fafb] border-[#e5e7eb]'} flex items-start justify-between gap-4`}>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-[4px] bg-white text-[#171717] border border-[#e5e7eb]">
                {unit.ulpin3D}
              </span>
              <span className="antimetal-chip text-[11px] py-0.5 px-2">
                Level {unit.level >= 0 ? `+${unit.level}` : unit.level} ({unit.layerType})
              </span>
              {isUnauthorized && (
                <span className="antimetal-chip-accent text-[11px] py-0.5 px-2 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#171717]" />
                  <span>UNAUTHORIZED EXTENSION</span>
                </span>
              )}
            </div>
            <h2 className="text-[20px] font-medium font-['Geist'] text-[#171717] flex items-center gap-2">
              {unit.unitNumber}
            </h2>
            <p className="text-[12px] text-[#171717]/60 font-sans">
              Base Cadastral Parcel: <span className="font-mono text-[#171717]">{unit.parentParcelUlpin}</span>
            </p>
          </div>

          <button
            id="btn-close-unit-modal"
            onClick={onClose}
            className="p-1.5 text-[#171717]/50 hover:text-[#171717] hover:bg-[#e5e7eb]/40 rounded-[6px] transition-colors cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Unauthorized Alert Warning Box */}
          {isUnauthorized && (
            <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#171717] text-[#171717] text-[13px] space-y-1.5">
              <div className="font-medium font-['Geist'] flex items-center gap-1.5 text-[#171717] text-[14px]">
                <AlertTriangle className="w-4 h-4" />
                <span>Municipal Notice: FAR Sanction Violation Detected</span>
              </div>
              <p className="leading-relaxed text-[#171717]/70 font-sans">
                This unit sits at elevation +{unit.dimensions.zBase}m, which exceeds the municipal sanctioned height of 51.8m. AI drone change-detection detected this vertical volume with 0 deed records found in the Sub-Registrar repository.
              </p>
            </div>
          )}

          {/* Core Spatial & Volumetric Geometry */}
          <div>
            <h3 className="text-[12px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/60 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#171717]" />
              <span>Volumetric Cadastral Envelope (3D Spatial Extent)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px]">
                <div className="text-[11px] text-[#171717]/60 font-['Geist']">Carpet Area</div>
                <div className="text-[16px] font-medium font-['Geist'] text-[#171717]">{unit.dimensions.carpetAreaSqM} m²</div>
                <div className="text-[10px] text-[#171717]/40">~{Math.round(unit.dimensions.carpetAreaSqM * 10.764)} sq.ft</div>
              </div>
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px]">
                <div className="text-[11px] text-[#171717]/60 font-['Geist']">Volumetric Size</div>
                <div className="text-[16px] font-medium font-['Geist'] text-[#171717] font-mono">{unit.dimensions.volumeM3} m³</div>
                <div className="text-[10px] text-[#171717]/40">Volumetric Cadastre</div>
              </div>
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px]">
                <div className="text-[11px] text-[#171717]/60 font-['Geist']">Z-Base Elevation</div>
                <div className="text-[16px] font-medium font-['Geist'] text-[#171717] font-mono">
                  {unit.dimensions.zBase >= 0 ? `+${unit.dimensions.zBase}` : unit.dimensions.zBase} m
                </div>
                <div className="text-[10px] text-[#171717]/40">Above Datum Grid</div>
              </div>
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px]">
                <div className="text-[11px] text-[#171717]/60 font-['Geist']">AI Survey Conf.</div>
                <div className="text-[16px] font-medium font-['Geist'] text-[#171717] font-mono">{unit.aiConfidence}%</div>
                <div className="text-[10px] text-[#171717]/40">LiDAR + U-Net</div>
              </div>
            </div>
          </div>

          {/* Record of Rights (RoR) Ownership Dossier */}
          <div>
            <h3 className="text-[12px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/60 mb-3 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-[#171717]" />
              <span>Record-of-Rights (DoLR Land Stack Essential Layers)</span>
            </h3>

            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e5e7eb] gap-2">
                <div>
                  <div className="text-[11px] text-[#171717]/60 font-['Geist'] flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#171717]/50" />
                    <span>Registered Legal Owner</span>
                  </div>
                  <div className="text-[14px] font-['Geist'] font-medium text-[#171717]">{unit.ownership.ownerName}</div>
                  <div className="text-[12px] text-[#171717]/60 capitalize">Category: {unit.ownership.ownerType} Ownership</div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-[#171717]/60 font-['Geist'] flex items-center sm:justify-end gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#171717]/50" />
                    <span>Masked Bhu-Aadhaar Token</span>
                  </div>
                  <div className="font-mono text-[12px] font-medium text-[#171717]">{unit.ownership.bhuAadhaarHash}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                <div>
                  <span className="text-[#171717]/60">Registered Deed #: </span>
                  <span className="font-mono text-[#171717] font-medium">{unit.ownership.deedNumber}</span>
                </div>
                <div>
                  <span className="text-[#171717]/60">Registration Date: </span>
                  <span className="text-[#171717]">{unit.ownership.registrationDate}</span>
                </div>
                <div>
                  <span className="text-[#171717]/60">Sub-Registrar Office: </span>
                  <span className="text-[#171717]">{unit.ownership.subRegistrarOffice}</span>
                </div>
                <div>
                  <span className="text-[#171717]/60">Municipal Property Tax ID: </span>
                  <span className="font-mono text-[#171717]">{unit.ownership.taxAssessmentId}</span>
                </div>
                {unit.ownership.reraRegNumber && (
                  <div className="sm:col-span-2">
                    <span className="text-[#171717]/60">State RERA Filing ID: </span>
                    <span className="font-mono text-[#171717] font-medium">{unit.ownership.reraRegNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legal Clearances & Encumbrance Status */}
          <div>
            <h3 className="text-[12px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/60 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#171717]" />
              <span>Title Clarity & Financial Encumbrance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#171717]/60 font-['Geist']">Encumbrance Status</div>
                  <div className="text-[13px] font-['Geist'] font-medium text-[#171717] mt-0.5">
                    {unit.ownership.encumbranceStatus === 'unencumbered' && 'Clean / Unencumbered Title'}
                    {unit.ownership.encumbranceStatus === 'mortgaged_sbi' && 'Mortgage Charge: State Bank of India'}
                    {unit.ownership.encumbranceStatus === 'mortgaged_hdfc' && 'Mortgage Charge: HDFC Bank Home Loan'}
                    {unit.ownership.encumbranceStatus === 'court_stay' && 'Active Dispute / Civil Court Stay'}
                  </div>
                </div>
                {unit.ownership.encumbranceStatus === 'unencumbered' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#171717] shrink-0" />
                ) : hasCourtStay ? (
                  <AlertTriangle className="w-5 h-5 text-[#171717] shrink-0" />
                ) : (
                  <Landmark className="w-5 h-5 text-[#171717]/70 shrink-0" />
                )}
              </div>

              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#171717]/60 font-['Geist']">Mutation Status (Jamabandi)</div>
                  <div className="text-[13px] font-['Geist'] font-medium text-[#171717] mt-0.5">
                    {unit.ownership.mutationStatus === 'mutated' ? 'Fully Mutated & RoR Synced' : 'Mutation Under Review'}
                  </div>
                </div>
                {unit.ownership.mutationStatus === 'mutated' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#171717] shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#171717] shrink-0" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-[#f9fafb] border-t border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[12px] text-[#171717]/60 flex items-center gap-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#171717]" />
            <span>Land Administration Domain Model (ISO 19152) Compliant</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCitizenCertificate && (
              <button
                id="btn-view-3d-bhu-certificate"
                onClick={() => onOpenCitizenCertificate(unit)}
                className="btn-primary h-[36px] px-3.5 text-[12px] flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View 3D Bhu-Naksha Card</span>
              </button>
            )}
            <button
              id="btn-close-unit-details"
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
