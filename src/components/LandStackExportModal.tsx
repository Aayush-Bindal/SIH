import React, { useState } from 'react';
import { CadastralBuilding } from '../types';
import { Database, Download, Copy, Check, Layers, Code, CheckCircle2, XCircle, Share2, Server } from 'lucide-react';

interface LandStackExportModalProps {
  building: CadastralBuilding;
  isOpen: boolean;
  onClose: () => void;
}

export const LandStackExportModal: React.FC<LandStackExportModalProps> = ({ building, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'landstack_json' | 'citygml' | 'geojson'>('landstack_json');

  if (!isOpen) return null;

  // Generate OGC / Land Stack Compliant JSON Payload
  const landStackPayload = {
    schemaVersion: 'DoLR-LandStack-3D-v1.0',
    timestamp: new Date().toISOString(),
    geodeticReference: {
      datum: 'Everest 1830 / WGS84 EPSG:4326',
      verticalDatum: 'Mean Sea Level (Survey of India CORS)',
    },
    baseSpatialLayer: {
      baseUlpin: building.baseParcelUlpin,
      propertyLocation: building.location,
      coordinates: building.coordinates,
      footprintAreaM2: building.footprintAreaSqM,
      sanctionedHeightM: building.sanctionedHeightM,
      actualHeightM: building.actualHeightM,
      volumetricParcelsCount: building.totalUnits,
      subsurfaceUtilitiesCount: building.utilities.length,
      airRightsCorridor: building.airRights ? building.airRights.ulpin3D : null,
    },
    volumetricUnits: building.units.map((u) => ({
      ulpin3D: u.ulpin3D,
      level: u.level,
      unitNumber: u.unitNumber,
      layerType: u.layerType,
      usage: u.usageType,
      bounds: {
        x: u.dimensions.x,
        y: u.dimensions.y,
        zMin: u.dimensions.zBase,
        zMax: u.dimensions.zBase + u.dimensions.height,
        volumeM3: u.dimensions.volumeM3,
        carpetAreaM2: u.dimensions.carpetAreaSqM,
      },
      aiConfidence: u.aiConfidence,
      surveyStatus: u.status,
      essentialLayersRecord: {
        ownerName: u.ownership.ownerName,
        maskedBhuAadhaar: u.ownership.bhuAadhaarHash,
        deedRef: u.ownership.deedNumber,
        encumbranceStatus: u.ownership.encumbranceStatus,
        mutationStatus: u.ownership.mutationStatus,
        taxId: u.ownership.taxAssessmentId,
        reraNumber: u.ownership.reraRegNumber || 'N/A',
      },
    })),
    subsurfaceUtilities: building.utilities.map((ut) => ({
      ulpin3D: ut.ulpin3D,
      type: ut.utilityType,
      operator: ut.operatorName,
      depthMeters: ut.depthMeters,
      diameterMm: ut.diameterMm,
      bufferZoneMeters: ut.bufferZoneMeters,
    })),
  };

  const getPayloadString = () => {
    if (activeFormat === 'geojson') {
      const geoJson = {
        type: 'FeatureCollection',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: building.units.map((u) => ({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [building.coordinates.lng - 0.0001, building.coordinates.lat - 0.0001, u.dimensions.zBase],
                [building.coordinates.lng + 0.0001, building.coordinates.lat - 0.0001, u.dimensions.zBase],
                [building.coordinates.lng + 0.0001, building.coordinates.lat + 0.0001, u.dimensions.zBase + u.dimensions.height],
                [building.coordinates.lng - 0.0001, building.coordinates.lat + 0.0001, u.dimensions.zBase + u.dimensions.height],
                [building.coordinates.lng - 0.0001, building.coordinates.lat - 0.0001, u.dimensions.zBase],
              ],
            ],
          },
          properties: {
            ulpin3D: u.ulpin3D,
            unitNumber: u.unitNumber,
            level: u.level,
            volumeM3: u.dimensions.volumeM3,
            owner: u.ownership.ownerName,
          },
        })),
      };
      return JSON.stringify(geoJson, null, 2);
    }

    if (activeFormat === 'citygml') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<CityModel xmlns="http://www.opengis.net/citygml/3.0"
  xmlns:bldg="http://www.opengis.net/citygml/building/3.0"
  xmlns:gml="http://www.opengis.net/gml/3.2">
  <gml:description>DoLR 3D ULPIN Volumetric CityGML Cadastre</gml:description>
  <cityObjectMember>
    <bldg:Building gml:id="${building.baseParcelUlpin}">
      <bldg:class>ResidentialCommercialComplex</bldg:class>
      <bldg:measuredHeight uom="m">${building.actualHeightM}</bldg:measuredHeight>
      <bldg:storeysAboveGround>${building.totalFloors}</bldg:storeysAboveGround>
      <bldg:storeysBelowGround>${building.basementFloors}</bldg:storeysBelowGround>
      ${building.units
        .slice(0, 3)
        .map(
          (u) => `
      <bldg:consistsOfBuildingSubdivision>
        <bldg:BuildingUnit gml:id="${u.ulpin3D}">
          <bldg:usage>${u.usageType}</bldg:usage>
          <bldg:volume uom="m3">${u.dimensions.volumeM3}</bldg:volume>
        </bldg:BuildingUnit>
      </bldg:consistsOfBuildingSubdivision>`
        )
        .join('')}
    </bldg:Building>
  </cityObjectMember>
</CityModel>`;
    }

    return JSON.stringify(landStackPayload, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPayloadString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(getPayloadString());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${building.baseParcelUlpin}_3D_Cadastre.${activeFormat === 'citygml' ? 'xml' : 'json'}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="landstack-export-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white border border-[#e5e7eb] rounded-[8px] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f9fafb] border-b border-[#e5e7eb] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="antimetal-chip text-[11px] py-0.5 px-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Interoperability Architecture</span>
              </span>
              <span className="text-[12px] text-[#171717]/60 font-mono">DoLR Problem Statement ::26014 Layer Standard</span>
            </div>
            <h2 className="text-[18px] font-['Geist'] font-medium text-[#171717]">DoLR National Land Stack & OGC Interoperability Export</h2>
            <p className="text-[12px] text-[#171717]/60 font-sans">
              Slots natively into the 3-tier national Land Stack architecture (Base Layer → Essential Layers → Use-Case Layers) without requiring a rip-and-replace.
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
          {/* Architecture 3-Tier Layer Diagram */}
          <div className="p-4 rounded-[6px] bg-[#f9fafb] border border-[#e5e7eb] space-y-3">
            <div className="text-[12px] font-['Geist'] font-medium uppercase tracking-wider text-[#171717] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#171717]" />
              <span>DoLR Land Stack 3-Tier Architecture Alignment</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
              {/* Layer 1: Base Layer */}
              <div className="p-3 bg-white border border-[#e5e7eb] rounded-[6px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] font-medium text-[#171717]">1. Base Spatial Layer</span>
                  <span className="antimetal-chip-accent text-[10px] py-0.5 px-1.5 font-mono">THIS SYSTEM</span>
                </div>
                <p className="text-[#171717]/70 text-[11px] leading-relaxed font-sans">
                  3D ULPIN, CORS coordinates, PolyhedralSurface 3D geometries, LiDAR height points, and underground utility corridor envelopes.
                </p>
                <div className="font-mono text-[10px] text-[#171717] font-medium">Status: Native 3D Schema</div>
              </div>

              {/* Layer 2: Essential Layers */}
              <div className="p-3 bg-white border border-[#e5e7eb] rounded-[6px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] font-medium text-[#171717]">2. Essential Layers</span>
                  <span className="antimetal-chip text-[10px] py-0.5 px-1.5 font-mono">STATE SYNC</span>
                </div>
                <p className="text-[#171717]/70 text-[11px] leading-relaxed font-sans">
                  State Jamabandi/RoR, Sub-Registrar deeds, RERA project filings, municipal occupancy certificates, and tax assessments.
                </p>
                <div className="font-mono text-[10px] text-[#171717] font-medium">Status: Integrated</div>
              </div>

              {/* Layer 3: Use-Case Layers */}
              <div className="p-3 bg-white border border-[#e5e7eb] rounded-[6px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] font-medium text-[#171717]">3. Use-Case Layers</span>
                  <span className="antimetal-chip text-[10px] py-0.5 px-1.5 font-mono">API CONSUMERS</span>
                </div>
                <p className="text-[#171717]/70 text-[11px] leading-relaxed font-sans">
                  Bank mortgage evaluation, dig-permit collision checking, property tax geo-audits, insurance title verification, and disaster simulation.
                </p>
                <div className="font-mono text-[10px] text-[#171717] font-medium">Status: OGC REST Ready</div>
              </div>
            </div>
          </div>

          {/* Export Format Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFormat('landstack_json')}
                className={`h-[34px] px-3 rounded-[6px] text-[12px] font-['Geist'] font-medium transition-colors cursor-pointer ${
                  activeFormat === 'landstack_json'
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#f9fafb] text-[#171717] border border-[#e5e7eb] hover:bg-[#e5e7eb]/40'
                }`}
              >
                DoLR Land Stack JSON
              </button>
              <button
                onClick={() => setActiveFormat('citygml')}
                className={`h-[34px] px-3 rounded-[6px] text-[12px] font-['Geist'] font-medium transition-colors cursor-pointer ${
                  activeFormat === 'citygml'
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#f9fafb] text-[#171717] border border-[#e5e7eb] hover:bg-[#e5e7eb]/40'
                }`}
              >
                OGC CityGML 3.0 (XML)
              </button>
              <button
                onClick={() => setActiveFormat('geojson')}
                className={`h-[34px] px-3 rounded-[6px] text-[12px] font-['Geist'] font-medium transition-colors cursor-pointer ${
                  activeFormat === 'geojson'
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#f9fafb] text-[#171717] border border-[#e5e7eb] hover:bg-[#e5e7eb]/40'
                }`}
              >
                3D GeoJSON FeatureCollection
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="btn-secondary h-[34px] px-3 text-[12px] flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#171717]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="btn-primary h-[34px] px-3 text-[12px] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Payload</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="bg-[#171717] border border-[#171717] rounded-[6px] p-4 font-mono text-[11px] text-white/90 max-h-64 overflow-y-auto">
            <pre>{getPayloadString()}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f9fafb] border-t border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#171717]/60">
          <span>Meets National Geospatial Data Registry (NGDR) and Open Geospatial Consortium (OGC) specifications</span>
          <button
            onClick={onClose}
            className="btn-secondary h-[36px] px-4 text-[12px] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
