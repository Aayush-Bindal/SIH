import React, { useState } from 'react';
import { CadastralBuilding } from '../types';
import { Cpu, CheckCircle2, AlertTriangle, Play, RefreshCw, UploadCloud, Layers, ShieldCheck, FileSpreadsheet, Eye } from 'lucide-react';

interface AiExtractionPipelineProps {
  building: CadastralBuilding;
  onViewExploded: () => void;
  onInspectEncroachment: () => void;
}

export const AiExtractionPipeline: React.FC<AiExtractionPipelineProps> = ({
  onViewExploded,
  onInspectEncroachment,
}) => {
  const [activeStep, setActiveStep] = useState<number>(4); // Completed by default
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedDataSource, setSelectedDataSource] = useState<'drone' | 'lidar' | 'rera_cad' | 'gnss'>('drone');

  const runPipelineDemo = () => {
    setIsProcessing(true);
    setActiveStep(0);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 4) {
          clearInterval(stepInterval);
          setIsProcessing(false);
          return 4;
        }
        return prev + 1;
      });
    }, 900);
  };

  const PIPELINE_STEPS = [
    {
      id: 0,
      title: 'Tier 1: Multi-Modal Geospatial Ingestion',
      subtitle: 'Drone RGB Orthomosaic, LiDAR Point Clouds, and RERA Scanned Blueprints',
      status: activeStep >= 0 ? 'completed' : 'pending',
      details: 'Ingested 2.4 GB NAKSHA drone pass orthoimagery (GSD 3.5cm/px) and 48M LiDAR points (LAS 1.4) aligned to Everest 1830 datum.',
      metric: '48,290,110 Point Cloud Density',
    },
    {
      id: 1,
      title: 'Tier 2: U-Net CNN Building Extraction',
      subtitle: 'Footprint extraction & volumetric envelope segmentation',
      status: activeStep >= 1 ? 'completed' : 'pending',
      details: 'Deep learning segmentation extracted parcel footprint with 98.4% IoU. Height calculated: 58.6m (Flagged: Exceeds 51.8m sanction).',
      metric: '98.4% Intersection-over-Union',
    },
    {
      id: 2,
      title: 'Tier 2: Floor & Unit Plan Delineation',
      subtitle: 'OCR & vector parsing of CAD/RERA municipal floor plans',
      status: activeStep >= 2 ? 'completed' : 'pending',
      details: 'Delineated 42 discrete unit polygons across 16 vertical floors, 2 subterranean parking levels, and ground retail spaces.',
      metric: '42 Volumetric Sub-Parcels Generated',
    },
    {
      id: 3,
      title: 'Tier 2: Spatial Graph Topology Validation',
      subtitle: 'Rule-engine checking 3D manifoldness, overlaps, and gaps',
      status: activeStep >= 3 ? 'completed' : 'pending',
      details: 'PostGIS 3D PolyhedralSurface topology checks verified: 0 dangling units, 0 gaps. Anomaly detected: Level 15 & 16 breach sanctioned FAR.',
      metric: '2 Anomaly Alerts (FAR Overhang)',
    },
    {
      id: 4,
      title: 'Tier 0: Hierarchical 3D ULPIN Issuance',
      subtitle: 'National Bhu-Aadhaar 14-digit base + Z-axis volumetric suffixing',
      status: activeStep >= 4 ? 'completed' : 'pending',
      details: 'Issued standard-compliant 3D ULPINs (e.g. 06018020108842-FL14-U1402) into DoLR Land Stack Base Spatial Layer ready for Surveyor Certification.',
      metric: 'Ready for Surveyor Sign-Off',
    },
  ];

  return (
    <div id="ai-pipeline-container" className="space-y-6">
      {/* Header Banner */}
      <div className="antimetal-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="antimetal-chip-accent text-[11px] py-0.5 px-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#171717]" />
              <span>GeoAI Volumetric Engine</span>
            </span>
            <span className="text-[12px] text-[#171717]/60 font-['Geist']">NAKSHA / SVAMITVA / RERA Drone-to-ULPIN Pipeline</span>
          </div>
          <h2 className="text-[18px] font-medium font-['Geist'] text-[#171717]">Automated 3D Cadastral Feature Extraction Pipeline</h2>
          <p className="text-[13px] text-[#171717]/70 max-w-3xl mt-1 leading-relaxed font-sans">
            How raw drone imagery, LiDAR point clouds, and RERA floor plans transform into legally auditable 3D ULPIN volumetric parcels with built-in confidence scoring and human-in-the-loop validation.
          </p>
        </div>

        <button
          id="btn-re-run-ai-pipeline"
          onClick={runPipelineDemo}
          disabled={isProcessing}
          className="btn-primary shrink-0 h-[36px] px-3.5 text-[12px] disabled:opacity-50"
        >
          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isProcessing ? 'Processing Point Clouds...' : 'Re-Run AI Extraction'}</span>
        </button>
      </div>

      {/* Multi-Modal Ingestion Feeds */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedDataSource('drone')}
          className={`p-3.5 rounded-[6px] border text-left transition-all cursor-pointer ${
            selectedDataSource === 'drone'
              ? 'bg-[#f9fafb] border-[#171717]'
              : 'bg-white border-[#e5e7eb] hover:border-[#171717]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <UploadCloud className="w-4 h-4 text-[#171717]" />
            <span className="antimetal-chip text-[10px] py-0.5 px-1.5">
              NAKSHA
            </span>
          </div>
          <div className="text-[13px] font-['Geist'] font-medium text-[#171717]">Drone Orthomosaic</div>
          <div className="text-[11px] text-[#171717]/60 mt-0.5">RGB / Multispectral GSD 3.5cm</div>
        </button>

        <button
          onClick={() => setSelectedDataSource('lidar')}
          className={`p-3.5 rounded-[6px] border text-left transition-all cursor-pointer ${
            selectedDataSource === 'lidar'
              ? 'bg-[#f9fafb] border-[#171717]'
              : 'bg-white border-[#e5e7eb] hover:border-[#171717]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-4 h-4 text-[#171717]" />
            <span className="antimetal-chip text-[10px] py-0.5 px-1.5">
              LAS 1.4
            </span>
          </div>
          <div className="text-[13px] font-['Geist'] font-medium text-[#171717]">LiDAR Point Cloud</div>
          <div className="text-[11px] text-[#171717]/60 mt-0.5">Volumetric Heights & Rooftops</div>
        </button>

        <button
          onClick={() => setSelectedDataSource('rera_cad')}
          className={`p-3.5 rounded-[6px] border text-left transition-all cursor-pointer ${
            selectedDataSource === 'rera_cad'
              ? 'bg-[#f9fafb] border-[#171717]'
              : 'bg-white border-[#e5e7eb] hover:border-[#171717]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FileSpreadsheet className="w-4 h-4 text-[#171717]" />
            <span className="antimetal-chip text-[10px] py-0.5 px-1.5">
              RERA
            </span>
          </div>
          <div className="text-[13px] font-['Geist'] font-medium text-[#171717]">CAD & Floor Plans</div>
          <div className="text-[11px] text-[#171717]/60 mt-0.5">Internal Unit Boundaries</div>
        </button>

        <button
          onClick={() => setSelectedDataSource('gnss')}
          className={`p-3.5 rounded-[6px] border text-left transition-all cursor-pointer ${
            selectedDataSource === 'gnss'
              ? 'bg-[#f9fafb] border-[#171717]'
              : 'bg-white border-[#e5e7eb] hover:border-[#171717]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="w-4 h-4 text-[#171717]" />
            <span className="antimetal-chip text-[10px] py-0.5 px-1.5">
              CORS
            </span>
          </div>
          <div className="text-[13px] font-['Geist'] font-medium text-[#171717]">GNSS Ground Truth</div>
          <div className="text-[11px] text-[#171717]/60 mt-0.5">Sub-centimeter Survey Datum</div>
        </button>
      </div>

      {/* Stepper Pipeline Flow */}
      <div className="antimetal-card p-6 space-y-6">
        <h3 className="text-[14px] font-['Geist'] font-medium text-[#171717] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#171717]" />
            <span>End-to-End Extraction Pipeline State</span>
          </span>
          <span className="text-[12px] text-[#171717]/60 font-mono">
            {activeStep === 4 ? 'Processing Complete' : `Running Step ${activeStep + 1} of 5`}
          </span>
        </h3>

        <div className="space-y-3">
          {PIPELINE_STEPS.map((step) => {
            const isStepActive = activeStep === step.id;
            const isStepDone = activeStep > step.id || (activeStep === 4 && step.id === 4);

            return (
              <div
                key={step.id}
                className={`p-4 rounded-[6px] border transition-all ${
                  isStepDone
                    ? 'bg-[#f9fafb] border-[#e5e7eb]'
                    : isStepActive
                    ? 'bg-white border-[#171717]'
                    : 'bg-[#f9fafb]/50 border-[#e5e7eb]/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-[4px] flex items-center justify-center text-[12px] font-['Geist'] font-medium mt-0.5 shrink-0 ${
                        isStepDone
                          ? 'bg-[#171717] text-white'
                          : isStepActive
                          ? 'bg-[#e2e67d] text-[#171717] border border-[#cfd45e]'
                          : 'bg-[#e5e7eb] text-[#171717]/60'
                      }`}
                    >
                      {isStepDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[14px] font-['Geist'] font-medium text-[#171717] flex items-center gap-2">
                        <span>{step.title}</span>
                        {step.id === 3 && (
                          <span className="antimetal-chip-accent text-[11px] py-0.5 px-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-[#171717]" />
                            <span>FAR Breach Detected</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#171717]/60 font-['Geist']">{step.subtitle}</div>
                      <div className="text-[13px] text-[#171717]/70 pt-1 leading-relaxed font-sans">{step.details}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-medium px-2 py-1 rounded-[4px] bg-white text-[#171717] border border-[#e5e7eb]">
                      {step.metric}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div className="pt-4 border-t border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[12px] text-[#171717]/60">
            Certified compliant with <strong className="text-[#171717] font-['Geist'] font-medium">Survey of India NAKSHA Specification v1.2</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onInspectEncroachment}
              className="btn-secondary h-[36px] px-3 text-[12px] flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Inspect Unauthorized Floors (+2 Detected)</span>
            </button>
            <button
              onClick={onViewExploded}
              className="btn-primary h-[36px] px-3.5 text-[12px] flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Exploded 3D Parcels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
