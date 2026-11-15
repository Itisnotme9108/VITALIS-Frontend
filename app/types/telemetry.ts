/**
 * VITALIS Physiological Telemetry & Sensor Integration Types
 * 
 * Strict data provenance: LIVE, SIMULATED, SAMPLE, UNAVAILABLE.
 * Designed for future hardware compatibility (ESP32 bio-sensors, BLE wearables, etc.).
 */

export type DataProvenance = 'LIVE' | 'SIMULATED' | 'SAMPLE' | 'UNAVAILABLE';

export type SensorConnectionStatus = 
  | 'CONNECTED'
  | 'STREAMING'
  | 'DISCONNECTED'
  | 'RECONNECTING'
  | 'ERROR';

export type SensorInterfaceType = 
  | 'WEBSOCKET_ESP32'
  | 'SERIAL_WEBSERIAL'
  | 'BLUETOOTH_LE'
  | 'REST_TELEMETRY'
  | 'INTERNAL_SIMULATION';

export interface SensorDeviceDescriptor {
  id: string;
  name: string;
  model: string;
  interfaceType: SensorInterfaceType;
  status: SensorConnectionStatus;
  sampleRateHz: number;
  batteryPercent?: number;
  lastPacketTimestamp?: number;
  assignedSubjectId: string;
  portOrEndpoint?: string;
}

export interface MetricValue<T = number> {
  value: T;
  unit: string;
  provenance: DataProvenance;
  timestamp: number;
  nominalRange: [number, number];
  warningRange?: [number, number];
  criticalRange?: [number, number];
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'STABLE' | 'UNAVAILABLE';
}

export interface PhysiologicalSnapshot {
  timestamp: number;
  subjectId: string;
  missionElapsedTime: string; // e.g. "MET 042:18:24:09"
  provenance: DataProvenance;
  
  // Vital Signs
  heartRate: MetricValue<number>;
  bloodOxygenSpO2: MetricValue<number>;
  respiratoryRate: MetricValue<number>;
  bloodPressureSystolic: MetricValue<number>;
  bloodPressureDiastolic: MetricValue<number>;
  meanArterialPressure: MetricValue<number>;
  coreTemperature: MetricValue<number>;
  skinTemperature: MetricValue<number>;

  // Hemodynamics
  cardiacOutput: MetricValue<number>;
  strokeVolume: MetricValue<number>;
  cardiacIndex: MetricValue<number>;
  systemicVascularResistance: MetricValue<number>;

  // Pulmonary
  minuteVentilation: MetricValue<number>;
  endTidalCO2: MetricValue<number>;
  tidalVolume: MetricValue<number>;

  // Neuro & Cognitive
  intracranialPressure: MetricValue<number>;
  cerebralPerfusionPressure: MetricValue<number>;
  eegAlphaPower: MetricValue<number>;
  eegBetaPower: MetricValue<number>;
  eegThetaPower: MetricValue<number>;
  eegDeltaPower: MetricValue<number>;
  cognitiveWorkloadIndex: MetricValue<number>;

  // Musculoskeletal & Biomechanics
  boneMineralDensityIndex: MetricValue<number>;
  muscleToneIndex: MetricValue<number>;
  emgActivityLevel: MetricValue<number>;
  jointStressScore: MetricValue<number>;

  // Activity & Kinematics
  metabolicEquivalentMETs: MetricValue<number>;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  effectiveGForce: number;
  cumulativeRadiationDoseMilliSieverts: MetricValue<number>;

  // Environmental Context
  cabinPressureKPa: MetricValue<number>;
  oxygenPartialPressureKPa: MetricValue<number>;
  carbonDioxidePpm: MetricValue<number>;
  ambientTemperatureCelsius: MetricValue<number>;
  relativeHumidityPercent: MetricValue<number>;

  // Organ specific status
  organMetrics: Record<string, {
    primaryMetricName: string;
    primaryMetricValue: string;
    secondaryMetricName: string;
    secondaryMetricValue: string;
    status: 'NOMINAL' | 'ELEVATED' | 'MONITORED';
    researchNote: string;
  }>;
}

export interface WaveformPoint {
  time: number;
  voltage: number;
}

/**
 * Standard interface for future hardware sensor adapters (e.g., ESP32 WiFi/BLE/Serial).
 */
export interface ISensorAdapter {
  readonly deviceId: string;
  readonly descriptor: SensorDeviceDescriptor;
  
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  getStatus(): SensorConnectionStatus;
  subscribe(callback: (packet: Partial<PhysiologicalSnapshot>) => void): () => void;
  sendControlCommand?(command: string, params?: Record<string, unknown>): Promise<boolean>;
}
