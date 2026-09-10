export type LayerType = 'surface' | 'floor' | 'basement' | 'parking' | 'utility' | 'air_rights';

export type UnitUsageType = 'residential' | 'commercial' | 'parking' | 'utility_corridor' | 'air_corridor' | 'common_area';

export type RegistrationStatus = 'registered' | 'pending_verification' | 'disputed' | 'unauthorized_extension';

export interface OwnershipRecord {
  ownerName: string;
  ownerType: 'individual' | 'joint' | 'corporate' | 'government';
  bhuAadhaarHash: string; // Anonymous masked hash e.g. "XXXX-XXXX-8921"
  deedNumber: string;
  registrationDate: string;
  subRegistrarOffice: string;
  encumbranceStatus: 'unencumbered' | 'mortgaged_sbi' | 'mortgaged_hdfc' | 'court_stay';
  mutationStatus: 'mutated' | 'mutation_in_progress';
  taxAssessmentId: string;
  reraRegNumber?: string;
}

export interface SpatialDimensions {
  x: number;
  y: number;
  zBase: number; // elevation from ground (meters)
  height: number; // vertical height (meters)
  width: number;
  length: number;
  volumeM3: number;
  carpetAreaSqM: number;
}

export interface UnitCadastre {
  id: string;
  ulpin3D: string; // e.g. "14010500201088-FL14-U1402"
  parentParcelUlpin: string; // 14-digit base ULPIN "14010500201088"
  level: number; // -2, -1, 0, 1, 2, ... 16
  unitNumber: string; // "Flat 1402", "Shop G04", "Bay P-12"
  layerType: LayerType;
  usageType: UnitUsageType;
  dimensions: SpatialDimensions;
  aiConfidence: number; // 0 - 100%
  topologyValid: boolean;
  status: RegistrationStatus;
  ownership: OwnershipRecord;
  changeDetectionFlag?: 'none' | 'unauthorized_floor' | 'sanction_breach' | 'boundary_overlap';
}

export interface UndergroundUtility {
  id: string;
  ulpin3D: string; // e.g. "14010500201088-UT-PNG01"
  utilityType: 'gas_png' | 'water_potable' | 'telecom_ofc' | 'power_highvoltage' | 'stormwater';
  operatorName: string; // e.g. "Indraprastha Gas Ltd", "Jal Board", "Airtel Fiber", "Tata Power"
  depthMeters: number; // e.g. 2.8m below surface
  diameterMm: number;
  bufferZoneMeters: number;
  coordinates: [number, number, number][]; // 3D path coordinates
  riskLevel: 'critical' | 'high' | 'moderate';
  status: 'active' | 'maintenance' | 'proposed';
}

export interface AirRightsCorridor {
  id: string;
  ulpin3D: string; // e.g. "14010500201088-AIR-METRO01"
  corridorType: 'metro_elevated' | 'flyover' | 'drone_skyway';
  authorityName: string; // e.g. "Delhi Metro Rail Corp (DMRC)", "NHAI"
  clearanceHeightMeters: number; // 8.5m - 14.2m above road
  parcelsTraversed: string[];
}

export interface CadastralBuilding {
  id: string;
  name: string;
  location: string;
  state: string;
  baseParcelUlpin: string; // 14-digit national ULPIN
  coordinates: { lat: number; lng: number };
  totalFloors: number;
  basementFloors: number;
  totalUnits: number;
  unauthorizedFloorsCount: number;
  surveyStatus: 'approved' | 'review_required' | 'disputed';
  footprintAreaSqM: number;
  totalVolumeM3: number;
  sanctionedHeightM: number;
  actualHeightM: number;
  units: UnitCadastre[];
  utilities: UndergroundUtility[];
  airRights?: AirRightsCorridor;
  dronePassDate1: string;
  dronePassDate2: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  ulpin3D: string;
  action: 'AI_EXTRACTION' | 'TOPOLOGY_CHECK' | 'SURVEYOR_EDIT' | 'OFFICER_SIGN_OFF' | 'MUTATION_TRIGGER' | 'DIG_PERMIT_CHECK';
  actor: string;
  actorRole: 'AI_PIPELINE' | 'SURVEYOR' | 'TEHSILDAR' | 'MUNICIPAL_OFFICER' | 'CITIZEN';
  details: string;
  hash: string;
}

export interface DigPermitQuery {
  permitId: string;
  applicant: string;
  purpose: string;
  targetParcelUlpin: string;
  proposedDepthMeters: number;
  proposedWidthMeters: number;
  trenchLengthMeters: number;
  status: 'pending' | 'conflict_detected' | 'approved' | 'rejected';
  conflicts: {
    utilityUlpin: string;
    utilityType: string;
    proximityMeters: number;
    safeDistanceRequired: number;
    severity: 'danger' | 'warning' | 'safe';
  }[];
}
