import React, { useState } from 'react';
import { CadastralBuilding, UnitCadastre } from '../types';
import { Search, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Download, Printer, QrCode, Building, Layers, Hash, Landmark, User, MapPin } from 'lucide-react';

interface CitizenSearchPortalProps {
  building: CadastralBuilding;
  onSelectUnit: (unit: UnitCadastre) => void;
  onViewIn3D: () => void;
}

export const CitizenSearchPortal: React.FC<CitizenSearchPortalProps> = ({
  building,
  onSelectUnit,
  onViewIn3D,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUnit, setActiveUnit] = useState<UnitCadastre | null>(building.units[12]); // e.g. Unit 501
  const [showCertificate, setShowCertificate] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    const found = building.units.find(
      (u) =>
        u.ulpin3D.toLowerCase().includes(query) ||
        u.unitNumber.toLowerCase().includes(query) ||
        u.ownership.ownerName.toLowerCase().includes(query)
    );

    if (found) {
      setActiveUnit(found);
      onSelectUnit(found);
    }
  };

  const sampleSearches = [
    { label: 'Unit 1401 (Approved Flat)', query: 'FL14-U1401' },
    { label: 'Penthouse 1601 (Illegal Floor)', query: 'FL16-U1601' },
    { label: 'Ground Retail (SBI)', query: 'FL00-SH01' },
    { label: 'Basement Parking Bay P1', query: 'BS02-PK01' },
  ];

  return (
    <div id="citizen-search-portal" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="antimetal-chip text-[11px] py-0.5 px-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Public Title Verification</span>
            </span>
            <span className="text-[12px] text-[#171717]/60 font-mono">DoLR National Bhu-Aadhaar 3D Registry</span>
          </div>
          <h2 className="text-[21px] font-['Geist'] font-medium text-[#171717]">Citizen & Buyer 3D Property Verification Portal</h2>
          <p className="text-[13px] text-[#171717]/70 max-w-3xl mt-1 font-sans">
            Before signing an agreement or paying an advance to a builder, verify the exact 3D volumetric status of the flat, floor legality, sanctioned FAR, and banking mortgage status.
          </p>
        </div>

        <div className="shrink-0 text-left md:text-right">
          <div className="text-[11px] text-[#171717]/60 font-['Geist']">Target Complex:</div>
          <div className="font-['Geist'] font-medium text-[#171717] text-[15px]">{building.name}</div>
          <div className="text-[12px] font-mono text-[#171717]">{building.baseParcelUlpin}</div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-6 space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#171717]/40" />
            <input
              type="text"
              placeholder="Search by 3D ULPIN (e.g. FL14-U1401), Flat Number (e.g. 1401), or Owner Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="antimetal-input pl-10 h-[40px] text-[13px]"
            />
          </div>
          <button
            type="submit"
            className="btn-primary h-[40px] px-5 text-[13px] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Verify 3D Title</span>
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap text-[12px]">
          <span className="text-[#171717]/60 text-[11px] font-['Geist']">Quick Samples:</span>
          {sampleSearches.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(s.query);
                const found = building.units.find((u) => u.ulpin3D.includes(s.query));
                if (found) {
                  setActiveUnit(found);
                  onSelectUnit(found);
                }
              }}
              className="h-[28px] px-2.5 rounded-[6px] bg-[#f9fafb] hover:bg-[#e5e7eb]/40 text-[#171717] text-[11px] font-['Geist'] font-medium border border-[#e5e7eb] transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Unit Dossier & Buyer Protection Report */}
      {activeUnit && (
        <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e5e7eb] gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-[4px] bg-[#f9fafb] text-[#171717] border border-[#e5e7eb]">
                  {activeUnit.ulpin3D}
                </span>
                <span className="antimetal-chip text-[11px] py-0.5 px-2">
                  Level {activeUnit.level} ({activeUnit.layerType})
                </span>
                {activeUnit.status === 'unauthorized_extension' ? (
                  <span className="antimetal-chip-accent text-[11px] py-0.5 px-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#171717]" />
                    <span>ILLEGAL / UNSANCTIONED UNIT</span>
                  </span>
                ) : (
                  <span className="antimetal-chip text-[11px] py-0.5 px-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" />
                    <span>SANCTIONED & CLEAR TITLE</span>
                  </span>
                )}
              </div>
              <h3 className="text-[18px] font-['Geist'] font-medium text-[#171717]">{activeUnit.unitNumber}</h3>
              <p className="text-[12px] text-[#171717]/60 font-sans">{building.name}, {building.location}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onViewIn3D}
                className="btn-secondary h-[36px] px-3.5 text-[12px] flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Locate in 3D Model</span>
              </button>
              <button
                onClick={() => setShowCertificate(!showCertificate)}
                className="btn-primary h-[36px] px-4 text-[12px] flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{showCertificate ? 'Hide Bhu-Naksha Card' : 'Generate 3D Bhu-Aadhaar Card'}</span>
              </button>
            </div>
          </div>

          {/* Warning Banner if Unauthorized */}
          {activeUnit.status === 'unauthorized_extension' && (
            <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#171717] text-[13px] text-[#171717] space-y-1.5">
              <div className="font-['Geist'] font-medium flex items-center gap-2 text-[14px]">
                <AlertTriangle className="w-4 h-4" />
                <span>BUYER WARNING: This unit has NO sanctioned building plan</span>
              </div>
              <p className="text-[#171717]/80 font-sans">
                The developer added this floor without municipal approvals. Registration and mutation cannot be processed. Banks will not approve mortgage loans for this unit.
              </p>
            </div>
          )}

          {/* Verification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
            <div className="p-4 bg-[#f9fafb] rounded-[6px] border border-[#e5e7eb] space-y-2.5">
              <div className="text-[#171717] font-['Geist'] font-medium flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#171717]" />
                <span>Ownership & Mutation</span>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">Registered Owner</div>
                <div className="font-['Geist'] font-medium text-[#171717] text-[14px]">{activeUnit.ownership.ownerName}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">Bhu-Aadhaar Identity Hash</div>
                <div className="font-mono text-[#171717] text-[12px]">{activeUnit.ownership.bhuAadhaarHash}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">Mutation Status</div>
                <div className="text-[#171717] font-['Geist'] font-medium text-[12px]">
                  {activeUnit.ownership.mutationStatus === 'mutated' ? 'Complete (Jamabandi Verified)' : 'Pending'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f9fafb] rounded-[6px] border border-[#e5e7eb] space-y-2.5">
              <div className="text-[#171717] font-['Geist'] font-medium flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-[#171717]" />
                <span>Financial Encumbrance</span>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">Encumbrance Certificate</div>
                <div className="font-['Geist'] font-medium text-[#171717] text-[14px]">
                  {activeUnit.ownership.encumbranceStatus === 'unencumbered' && 'Clean / Zero Encumbrance'}
                  {activeUnit.ownership.encumbranceStatus === 'mortgaged_sbi' && 'Mortgaged with SBI'}
                  {activeUnit.ownership.encumbranceStatus === 'mortgaged_hdfc' && 'Mortgaged with HDFC Bank'}
                  {activeUnit.ownership.encumbranceStatus === 'court_stay' && 'Active Court Injunction'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">Sub-Registrar Deed #</div>
                <div className="font-mono text-[#171717] text-[12px]">{activeUnit.ownership.deedNumber}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">RERA Registration</div>
                <div className="font-mono text-[#171717] text-[12px]">{activeUnit.ownership.reraRegNumber || 'N/A'}</div>
              </div>
            </div>

            <div className="p-4 bg-[#f9fafb] rounded-[6px] border border-[#e5e7eb] space-y-2.5">
              <div className="text-[#171717] font-['Geist'] font-medium flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#171717]" />
                <span>Spatial Geometry & Volume</span>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">Carpet Area</div>
                <div className="font-['Geist'] font-medium text-[#171717] text-[14px]">
                  {activeUnit.dimensions.carpetAreaSqM} m² (~{Math.round(activeUnit.dimensions.carpetAreaSqM * 10.764)} sq.ft)
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">3D Volumetric Extent</div>
                <div className="font-mono text-[#171717] font-medium text-[13px]">{activeUnit.dimensions.volumeM3} m³</div>
              </div>
              <div>
                <div className="text-[10px] text-[#171717]/60 uppercase font-['Geist'] font-medium">Elevation (Z-Base)</div>
                <div className="font-mono text-[#171717] text-[12px]">+{activeUnit.dimensions.zBase}m from Ground Datum</div>
              </div>
            </div>
          </div>

          {/* Printable 3D Bhu-Aadhaar Certificate Card */}
          {showCertificate && (
            <div className="p-6 rounded-[8px] bg-white border-2 border-[#171717] space-y-5">
              <div className="flex items-start justify-between border-b border-[#e5e7eb] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center text-[#171717]">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-['Geist'] font-medium tracking-widest text-[#171717]/70">
                      GOVERNMENT OF INDIA • DEPARTMENT OF LAND RESOURCES
                    </div>
                    <h4 className="text-[16px] font-['Geist'] font-medium text-[#171717]">
                      3D BHU-AADHAAR OFFICIAL TITLE RECORD (ROR)
                    </h4>
                    <div className="text-[12px] text-[#171717]/60 font-sans">
                      Unique Land Parcel Identification Number (Vertical Cadastre Extension)
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-white border border-[#e5e7eb] rounded-[6px] text-[#171717] flex flex-col items-center">
                  <QrCode className="w-10 h-10" />
                  <span className="text-[8px] font-mono font-medium mt-0.5">BHU-VERIFY</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[12px]">
                <div>
                  <span className="text-[#171717]/60">3D ULPIN:</span>
                  <div className="font-mono font-medium text-[#171717] text-[13px]">{activeUnit.ulpin3D}</div>
                </div>
                <div>
                  <span className="text-[#171717]/60">Base Cadastral Parcel:</span>
                  <div className="font-mono font-medium text-[#171717] text-[13px]">{activeUnit.parentParcelUlpin}</div>
                </div>
                <div>
                  <span className="text-[#171717]/60">Unit Identification:</span>
                  <div className="font-['Geist'] font-medium text-[#171717] text-[13px]">{activeUnit.unitNumber}</div>
                </div>
                <div>
                  <span className="text-[#171717]/60">Legal Ownership:</span>
                  <div className="font-['Geist'] font-medium text-[#171717] text-[13px]">{activeUnit.ownership.ownerName}</div>
                </div>
              </div>

              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] grid grid-cols-3 gap-3 text-[12px]">
                <div>
                  <span className="text-[#171717]/60">3D Volumetric Bounds:</span>
                  <div className="font-mono text-[#171717] mt-0.5">{activeUnit.dimensions.volumeM3} m³</div>
                </div>
                <div>
                  <span className="text-[#171717]/60">CORS Survey Datum:</span>
                  <div className="font-mono text-[#171717] mt-0.5">WGS84 / Everest 1830</div>
                </div>
                <div>
                  <span className="text-[#171717]/60">Certification Hash:</span>
                  <div className="font-mono text-[#171717] mt-0.5">0x7c92b...e4a1</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e5e7eb] text-[11px] text-[#171717]/60">
                <span>Issued under National Geospatial Policy 2022 and ISO 19152 LADM Framework</span>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary h-[32px] px-3 text-[11px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
