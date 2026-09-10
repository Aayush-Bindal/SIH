import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface PitchPlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchPlaybookModal: React.FC<PitchPlaybookModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'market' | 'strategy' | 'qa'>('pitch');
  const [qaSearch, setQaSearch] = useState('');

  if (!isOpen) return null;

  const JURY_QUESTIONS = [
    {
      q: 'How is a 3D ULPIN legally different from adding a floor number to an address?',
      a: 'A text address is arbitrary and cannot be spatially computed. A 3D ULPIN is tied to verified surveyed geometry (ground footprint, elevation range, and volumetric boundary). This allows automated collision checks, underground utility clearances, and legal boundary enforcement across departments.',
    },
    {
      q: 'What happens if the AI extracts an incorrect boundary?',
      a: 'The AI output is advisory. Every 3D parcel requires certification and digital signature by a licensed cadastral surveyor before entering the legal land register. A full audit log and formal dispute/correction workflow mirror standard DILRMP revenue procedures.',
    },
    {
      q: 'How does this integrate with the existing Land Stack architecture?',
      a: '3D ULPIN functions as a native extension of the 14-digit base parcel ID (adding volumetric unit suffixes). It is fully backward-compatible and additive, avoiding the need to replace existing state revenue databases.',
    },
    {
      q: 'Land is a State subject in India — how are varying state formats handled?',
      a: 'The platform employs a modular schema mapping layer configured per state revenue system rather than imposing a single rigid schema, directly accommodating state-level cadastral diversity.',
    },
    {
      q: 'What data sources are used for legacy buildings without digital floor plans?',
      a: 'Post-2016 buildings utilize mandatory RERA-filed digital plans. For older structures, drone photogrammetry and LiDAR provide estimated floor boundaries, clearly flagged for on-ground surveyor verification.',
    },
    {
      q: 'What is the implementation cost benchmark and funding model?',
      a: 'Implementation follows the NAKSHA benchmark (approx. ₹194 Cr across 152 ULBs for 2D drone mapping). 3D cadastre functions as a high-value incremental layer atop existing drone and CORS infrastructure.',
    },
    {
      q: 'Why would municipal bodies or developers participate in 3D mapping?',
      a: 'For home buyers and banks, it eliminates double-mortgaging and title fraud. For urban local bodies, it automates change detection to identify unauthorized floor additions and expand property tax coverage.',
    },
  ];

  const filteredQuestions = JURY_QUESTIONS.filter(
    (item) =>
      item.q.toLowerCase().includes(qaSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(qaSearch.toLowerCase())
  );

  return (
    <div id="pitch-playbook-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white border border-[#e5e7eb] rounded-[10px] overflow-hidden flex flex-col max-h-[88vh] shadow-2xl">
        {/* Clean Header */}
        <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-['Geist'] font-medium text-[#171717]">
              Project Playbook
            </h2>
            <p className="text-[13px] text-[#171717]/60 font-sans mt-0.5">
              Core positioning, market sizing, and evaluation defense
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#171717]/50 hover:text-[#171717] hover:bg-[#f3f4f6] rounded-[6px] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Tab Navigation */}
        <div className="flex items-center gap-6 px-6 border-b border-[#e5e7eb] bg-white text-[13px]">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`py-3 font-['Geist'] font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] ${
              activeTab === 'pitch'
                ? 'text-[#171717] border-[#171717]'
                : 'text-[#171717]/50 border-transparent hover:text-[#171717]'
            }`}
          >
            Elevator Pitch
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`py-3 font-['Geist'] font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] ${
              activeTab === 'market'
                ? 'text-[#171717] border-[#171717]'
                : 'text-[#171717]/50 border-transparent hover:text-[#171717]'
            }`}
          >
            Market Sizing
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`py-3 font-['Geist'] font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] ${
              activeTab === 'strategy'
                ? 'text-[#171717] border-[#171717]'
                : 'text-[#171717]/50 border-transparent hover:text-[#171717]'
            }`}
          >
            Strategic Moat
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`py-3 font-['Geist'] font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] ${
              activeTab === 'qa'
                ? 'text-[#171717] border-[#171717]'
                : 'text-[#171717]/50 border-transparent hover:text-[#171717]'
            }`}
          >
            Jury Q&A ({JURY_QUESTIONS.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[13px]">
          {/* TAB 1: ELEVATOR PITCH */}
          {activeTab === 'pitch' && (
            <div className="space-y-6">
              {/* The Hook */}
              <div className="bg-[#fafafa] border border-[#e5e7eb] rounded-[8px] p-5">
                <div className="text-[11px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/50 mb-2">
                  The Core Thesis
                </div>
                <p className="text-[15px] sm:text-[16px] text-[#171717] font-['Geist'] font-medium leading-snug">
                  Over 60% of pending civil litigation in India stems from property disputes. A primary driver is that land administration remains fundamentally flat: dozens of families in a high-rise share one 2D plot record with zero spatial boundaries for vertical units or subsurface infrastructure.
                </p>
              </div>

              {/* Demo Narrative Breakdown */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717]">
                  5-Minute Presentation Structure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 border border-[#e5e7eb] rounded-[8px] bg-white space-y-1">
                    <div className="text-[11px] font-mono text-[#171717]/50">01 • Problem Setup (30s)</div>
                    <div className="font-['Geist'] font-medium text-[#171717]">The High-Rise Blindspot</div>
                    <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                      Show an 80-unit apartment complex recorded on paper as a single flat polygon.
                    </p>
                  </div>

                  <div className="p-3.5 border border-[#e5e7eb] rounded-[8px] bg-white space-y-1">
                    <div className="text-[11px] font-mono text-[#171717]/50">02 • AI Extraction (60s)</div>
                    <div className="font-['Geist'] font-medium text-[#171717]">Point Cloud to 3D Slices</div>
                    <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                      Demonstrate drone LiDAR parsing individual floors and flagging height deviations.
                    </p>
                  </div>

                  <div className="p-3.5 border border-[#e5e7eb] rounded-[8px] bg-white space-y-1">
                    <div className="text-[11px] font-mono text-[#171717]/50">03 • Volumetric Deeds (60s)</div>
                    <div className="font-['Geist'] font-medium text-[#171717]">3D ULPIN Assignment</div>
                    <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                      Show distinct spatial boundaries for flat, balcony, and basement parking bays.
                    </p>
                  </div>

                  <div className="p-3.5 border border-[#e5e7eb] rounded-[8px] bg-white space-y-1">
                    <div className="text-[11px] font-mono text-[#171717]/50">04 • Unified Subsurface (60s)</div>
                    <div className="font-['Geist'] font-medium text-[#171717]">Dig-Safe Clearance</div>
                    <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                      Overlay PNG gas and power lines to prevent accidental excavation strikes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Advantages */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717]">
                  Key Architectural Advantages
                </h3>
                <div className="border border-[#e5e7eb] rounded-[8px] divide-y divide-[#e5e7eb] bg-white">
                  <div className="p-3 flex items-start gap-3">
                    <span className="font-mono text-[11px] text-[#171717]/50 mt-0.5">01</span>
                    <div>
                      <span className="font-['Geist'] font-medium text-[#171717]">Native Backward Compatibility:</span>
                      <span className="text-[#171717]/70 font-sans ml-1.5">
                        Builds directly on India&apos;s 14-digit ULPIN standard as a child suffix rather than replacing state registry schemas.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex items-start gap-3">
                    <span className="font-mono text-[11px] text-[#171717]/50 mt-0.5">02</span>
                    <div>
                      <span className="font-['Geist'] font-medium text-[#171717]">Human-in-the-Loop Governance:</span>
                      <span className="text-[#171717]/70 font-sans ml-1.5">
                        Automated AI estimates are always paired with certified surveyor review and revenue officer sign-off.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex items-start gap-3">
                    <span className="font-mono text-[11px] text-[#171717]/50 mt-0.5">03</span>
                    <div>
                      <span className="font-['Geist'] font-medium text-[#171717]">Standard OGC Exports:</span>
                      <span className="text-[#171717]/70 font-sans ml-1.5">
                        Direct support for CityGML, 3D Tiles, GeoJSON, and Land Stack formats for seamless inter-agency interoperability.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MARKET SIZING */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              {/* Three TAM / SAM / SOM Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-[#fafafa] space-y-1.5">
                  <div className="text-[11px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/50">
                    TAM (By 2030)
                  </div>
                  <div className="text-[22px] font-['Geist'] font-medium text-[#171717]">
                    ₹1.06 Lakh Cr
                  </div>
                  <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                    Projected Indian geospatial economy valuation (National Geospatial Policy targets).
                  </p>
                </div>

                <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-[#fafafa] space-y-1.5">
                  <div className="text-[11px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/50">
                    SAM (Annual)
                  </div>
                  <div className="text-[22px] font-['Geist'] font-medium text-[#171717]">
                    ₹13,000–29,000 Cr
                  </div>
                  <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                    Urban land governance, proptech title security, and municipal survey budgets.
                  </p>
                </div>

                <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-[#fafafa] space-y-1.5">
                  <div className="text-[11px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717]/50">
                    SOM (3-Year Goal)
                  </div>
                  <div className="text-[22px] font-['Geist'] font-medium text-[#171717]">
                    ₹150–400 Cr
                  </div>
                  <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                    First-mover capture across major metropolitan municipal corporations (ULBs).
                  </p>
                </div>
              </div>

              {/* Commercial Monetization Streams */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717]">
                  Commercial Revenue Channels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 border border-[#e5e7eb] rounded-[8px] bg-white space-y-1">
                    <div className="font-['Geist'] font-medium text-[#171717]">
                      1. Municipal Mapping Contracts
                    </div>
                    <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                      Fixed-fee execution for ULB drone surveys and volumetric title conversion.
                    </p>
                  </div>

                  <div className="p-3.5 border border-[#e5e7eb] rounded-[8px] bg-white space-y-1">
                    <div className="font-['Geist'] font-medium text-[#171717]">
                      2. State Cadastre SaaS Licensing
                    </div>
                    <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                      Annual recurring platform access for Tehsildar and surveyor approval workflows.
                    </p>
                  </div>

                  <div className="p-3.5 border border-[#e5e7eb] rounded-[8px] bg-white space-y-1">
                    <div className="font-['Geist'] font-medium text-[#171717]">
                      3. Bank Mortgage & Title API
                    </div>
                    <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                      Transactional query fees for financial institutions evaluating property collateral.
                    </p>
                  </div>

                  <div className="p-3.5 border border-[#e5e7eb] rounded-[8px] bg-white space-y-1">
                    <div className="font-['Geist'] font-medium text-[#171717]">
                      4. Dig-Safe Utility Subscriptions
                    </div>
                    <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                      Permit clearance and collision-check subscriptions for infrastructure operators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGIC MOAT */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-white space-y-2">
                  <h4 className="font-['Geist'] font-medium text-[#171717] text-[14px]">
                    Regulatory Alignment
                  </h4>
                  <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                    Land administration involves high regulatory hurdles. By strictly conforming to DILRMP guidelines and ISO 19152 LADM standards, the system functions as institutional infrastructure rather than an isolated commercial tool.
                  </p>
                </div>

                <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-white space-y-2">
                  <h4 className="font-['Geist'] font-medium text-[#171717] text-[14px]">
                    Ecosystem Interoperability
                  </h4>
                  <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                    Designed to integrate with existing Survey of India CORS reference networks and state registration portals (such as Bhoomi, Meebhoomi, and Banglarbhumi).
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-['Geist'] font-medium text-[#171717] text-[14px]">
                  Market Defensibility
                </h4>
                <div className="p-3.5 rounded-[8px] border border-[#e5e7eb] bg-[#fafafa] space-y-1.5">
                  <div className="font-['Geist'] font-medium text-[#171717]">
                    Legal Grounding over Visual 3D
                  </div>
                  <p className="text-[12px] text-[#171717]/70 font-sans leading-relaxed">
                    Unlike consumer digital twins or 3D city maps that focus solely on rendering aesthetics, Bhu-Drishti focuses strictly on legal deed attributes: boundary precision, encumbrance history, surveyor certification, and registry linkages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: JURY Q&A */}
          {activeTab === 'qa' && (
            <div className="space-y-4">
              {/* Quick Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#171717]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter defense questions..."
                  value={qaSearch}
                  onChange={(e) => setQaSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-[13px] bg-[#fafafa] border border-[#e5e7eb] rounded-[6px] focus:outline-none focus:border-[#171717] font-sans"
                />
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[8px] border border-[#e5e7eb] bg-white space-y-2"
                  >
                    <div className="font-['Geist'] font-medium text-[#171717] text-[13.5px] leading-snug">
                      {item.q}
                    </div>
                    <div className="text-[12.5px] text-[#171717]/75 font-sans leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                ))}

                {filteredQuestions.length === 0 && (
                  <div className="text-center py-8 text-[#171717]/50 font-sans">
                    No matching questions found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="px-6 py-3.5 border-t border-[#e5e7eb] bg-[#fafafa] flex items-center justify-between text-[12px] text-[#171717]/60">
          <span>Compliant with National Geospatial Policy & ISO 19152</span>
          <button
            onClick={onClose}
            className="btn-secondary h-[34px] px-3.5 text-[12px] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

