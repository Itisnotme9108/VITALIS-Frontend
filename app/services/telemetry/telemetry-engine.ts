/**
 * VITALIS - Physiological Telemetry Engine & Signal Synthesizer
 * 
 * Provides deterministic biological waveforms (ECG, PPG, Capnography) and physiological
 * snapshots with strict provenance labeling (SIMULATED / LIVE / SAMPLE).
 */

import type {
  DataProvenance,
  PhysiologicalSnapshot,
  SensorDeviceDescriptor,
  SensorConnectionStatus,
  WaveformPoint
} from '@/app/types/telemetry';

export class TelemetryEngine {
  private static instance: TelemetryEngine | null = null;
  private provenance: DataProvenance = 'SIMULATED';
  private subjectId: string = 'AST-8942-J';
  private missionStart: number = Date.now() - (42 * 24 * 3600 + 18 * 3600 + 24 * 60 + 9) * 1000;
  private currentSnapshot: PhysiologicalSnapshot;
  private subscribers: Set<(snapshot: PhysiologicalSnapshot) => void> = new Set();
  private intervalTimer: number | null = null;

  // Active hardware / virtual sensors
  private sensors: SensorDeviceDescriptor[] = [
    {
      id: 'ESP32-BIO-01',
      name: 'ESP32 Bio-Telemetry Hub',
      model: 'Espressif ESP32-WROOM-32E (Custom Bio-Shield v2)',
      interfaceType: 'WEBSOCKET_ESP32',
      status: 'DISCONNECTED',
      sampleRateHz: 250,
      assignedSubjectId: 'AST-8942-J',
      portOrEndpoint: 'ws://192.168.4.1:81/telemetry'
    },
    {
      id: 'PULSE-OX-04',
      name: 'Continuous Pulse Oximeter',
      model: 'Nonin OEM-BLE PulseOx',
      interfaceType: 'INTERNAL_SIMULATION',
      status: 'STREAMING',
      sampleRateHz: 75,
      batteryPercent: 94,
      assignedSubjectId: 'AST-8942-J'
    },
    {
      id: 'ECG-12L-CORE',
      name: 'Holter 12-Lead ECG Patch',
      model: 'VitalSens Aerospace-12L',
      interfaceType: 'INTERNAL_SIMULATION',
      status: 'STREAMING',
      sampleRateHz: 500,
      batteryPercent: 88,
      assignedSubjectId: 'AST-8942-J'
    },
    {
      id: 'CORE-TEMP-PILL',
      name: 'Ingestible Core Temp Sensor',
      model: 'CorTemp Ingestible Capsule',
      interfaceType: 'INTERNAL_SIMULATION',
      status: 'STREAMING',
      sampleRateHz: 1,
      batteryPercent: 76,
      assignedSubjectId: 'AST-8942-J'
    }
  ];

  private constructor() {
    this.currentSnapshot = this.generateSnapshot(Date.now());
    this.startStreaming();
  }

  public static getInstance(): TelemetryEngine {
    if (!TelemetryEngine.instance) {
      TelemetryEngine.instance = new TelemetryEngine();
    }
    return TelemetryEngine.instance;
  }

  public getSnapshot(): PhysiologicalSnapshot {
    return this.currentSnapshot;
  }

  public getSensors(): SensorDeviceDescriptor[] {
    return [...this.sensors];
  }

  public getProvenance(): DataProvenance {
    return this.provenance;
  }

  public setProvenance(prov: DataProvenance): void {
    this.provenance = prov;
    this.currentSnapshot.provenance = prov;
    this.notifySubscribers();
  }

  public subscribe(cb: (snapshot: PhysiologicalSnapshot) => void): () => void {
    this.subscribers.add(cb);
    cb(this.currentSnapshot);
    return () => {
      this.subscribers.delete(cb);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(cb => cb(this.currentSnapshot));
  }

  private startStreaming(): void {
    if (typeof window === 'undefined') return;
    this.intervalTimer = window.setInterval(() => {
      this.currentSnapshot = this.generateSnapshot(Date.now());
      this.notifySubscribers();
    }, 1200);
  }

  public stopStreaming(): void {
    if (this.intervalTimer !== null) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  public updateSensorStatus(sensorId: string, status: SensorConnectionStatus): void {
    const s = this.sensors.find(item => item.id === sensorId);
    if (s) {
      s.status = status;
    }
  }

  private formatMET(now: number): string {
    const diff = Math.max(0, now - this.missionStart);
    const days = Math.floor(diff / (24 * 3600 * 1000));
    const hours = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
    const mins = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
    const secs = Math.floor((diff % (60 * 1000)) / 1000);
    return `MET ${String(days).padStart(3, '0')}:${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  private generateSnapshot(now: number): PhysiologicalSnapshot {
    const prov = this.provenance;
    // Micro-fluctuations driven by time
    const t = now / 1000;
    const sinusVariation = Math.sin(t * 0.15) * 2.5 + Math.sin(t * 0.04) * 1.5;
    const hr = Math.round(71 + sinusVariation);
    const spo2 = parseFloat((98.6 + Math.sin(t * 0.08) * 0.4).toFixed(1));
    const rr = Math.round(14 + Math.sin(t * 0.12) * 1.2);
    const sbp = Math.round(118 + Math.sin(t * 0.07) * 3);
    const dbp = Math.round(76 + Math.sin(t * 0.07) * 2);
    const map = Math.round((2 * dbp + sbp) / 3);
    const coreTemp = parseFloat((37.05 + Math.sin(t * 0.03) * 0.12).toFixed(2));
    const skinTemp = parseFloat((33.8 + Math.sin(t * 0.05) * 0.15).toFixed(2));

    const sv = Math.round(70 + sinusVariation * 0.8);
    const co = parseFloat(((hr * sv) / 1000).toFixed(2));
    const ci = parseFloat((co / 1.85).toFixed(2));
    const svr = Math.round((map / co) * 80);

    const etco2 = Math.round(36 + Math.sin(t * 0.1) * 1.0);
    const tv = Math.round(510 + Math.sin(t * 0.1) * 25);
    const mv = parseFloat(((rr * tv) / 1000).toFixed(2));

    const icp = parseFloat((11.4 + Math.sin(t * 0.2) * 0.6).toFixed(1));
    const cpp = parseFloat((map - icp).toFixed(1));

    return {
      timestamp: now,
      subjectId: this.subjectId,
      missionElapsedTime: this.formatMET(now),
      provenance: prov,
      
      heartRate: {
        value: hr,
        unit: 'bpm',
        provenance: prov,
        timestamp: now,
        nominalRange: [60, 100],
        warningRange: [50, 120],
        criticalRange: [40, 140],
        status: hr < 50 || hr > 120 ? 'WARNING' : 'NOMINAL'
      },
      bloodOxygenSpO2: {
        value: spo2,
        unit: '%',
        provenance: prov,
        timestamp: now,
        nominalRange: [95, 100],
        warningRange: [90, 95],
        criticalRange: [0, 90],
        status: spo2 < 95 ? 'WARNING' : 'NOMINAL'
      },
      respiratoryRate: {
        value: rr,
        unit: 'br/min',
        provenance: prov,
        timestamp: now,
        nominalRange: [12, 20],
        warningRange: [8, 26],
        status: 'NOMINAL'
      },
      bloodPressureSystolic: {
        value: sbp,
        unit: 'mmHg',
        provenance: prov,
        timestamp: now,
        nominalRange: [90, 125],
        status: 'NOMINAL'
      },
      bloodPressureDiastolic: {
        value: dbp,
        unit: 'mmHg',
        provenance: prov,
        timestamp: now,
        nominalRange: [60, 85],
        status: 'NOMINAL'
      },
      meanArterialPressure: {
        value: map,
        unit: 'mmHg',
        provenance: prov,
        timestamp: now,
        nominalRange: [70, 105],
        status: 'NOMINAL'
      },
      coreTemperature: {
        value: coreTemp,
        unit: '°C',
        provenance: prov,
        timestamp: now,
        nominalRange: [36.5, 37.5],
        status: 'NOMINAL'
      },
      skinTemperature: {
        value: skinTemp,
        unit: '°C',
        provenance: prov,
        timestamp: now,
        nominalRange: [32.0, 35.0],
        status: 'NOMINAL'
      },

      cardiacOutput: {
        value: co,
        unit: 'L/min',
        provenance: prov,
        timestamp: now,
        nominalRange: [4.0, 8.0],
        status: 'NOMINAL'
      },
      strokeVolume: {
        value: sv,
        unit: 'mL',
        provenance: prov,
        timestamp: now,
        nominalRange: [60, 100],
        status: 'NOMINAL'
      },
      cardiacIndex: {
        value: ci,
        unit: 'L/min/m²',
        provenance: prov,
        timestamp: now,
        nominalRange: [2.5, 4.2],
        status: 'NOMINAL'
      },
      systemicVascularResistance: {
        value: svr,
        unit: 'dyn·s/cm⁵',
        provenance: prov,
        timestamp: now,
        nominalRange: [800, 1400],
        status: 'NOMINAL'
      },

      minuteVentilation: {
        value: mv,
        unit: 'L/min',
        provenance: prov,
        timestamp: now,
        nominalRange: [5.0, 8.5],
        status: 'NOMINAL'
      },
      endTidalCO2: {
        value: etco2,
        unit: 'mmHg',
        provenance: prov,
        timestamp: now,
        nominalRange: [35, 45],
        status: 'NOMINAL'
      },
      tidalVolume: {
        value: tv,
        unit: 'mL',
        provenance: prov,
        timestamp: now,
        nominalRange: [400, 650],
        status: 'NOMINAL'
      },

      intracranialPressure: {
        value: icp,
        unit: 'mmHg',
        provenance: prov,
        timestamp: now,
        nominalRange: [7, 15],
        status: 'NOMINAL'
      },
      cerebralPerfusionPressure: {
        value: cpp,
        unit: 'mmHg',
        provenance: prov,
        timestamp: now,
        nominalRange: [60, 90],
        status: 'NOMINAL'
      },
      eegAlphaPower: {
        value: parseFloat((14.2 + Math.sin(t * 0.4) * 2.1).toFixed(1)),
        unit: 'µV²',
        provenance: prov,
        timestamp: now,
        nominalRange: [8, 25],
        status: 'NOMINAL'
      },
      eegBetaPower: {
        value: parseFloat((22.4 + Math.cos(t * 0.5) * 3.4).toFixed(1)),
        unit: 'µV²',
        provenance: prov,
        timestamp: now,
        nominalRange: [12, 35],
        status: 'NOMINAL'
      },
      eegThetaPower: {
        value: parseFloat((8.5 + Math.sin(t * 0.3) * 1.2).toFixed(1)),
        unit: 'µV²',
        provenance: prov,
        timestamp: now,
        nominalRange: [4, 15],
        status: 'NOMINAL'
      },
      eegDeltaPower: {
        value: parseFloat((5.2 + Math.cos(t * 0.2) * 0.8).toFixed(1)),
        unit: 'µV²',
        provenance: prov,
        timestamp: now,
        nominalRange: [2, 10],
        status: 'NOMINAL'
      },
      cognitiveWorkloadIndex: {
        value: Math.round(44 + Math.sin(t * 0.09) * 8),
        unit: '%',
        provenance: prov,
        timestamp: now,
        nominalRange: [20, 75],
        status: 'NOMINAL'
      },

      boneMineralDensityIndex: {
        value: 0.96,
        unit: 'T-score eq.',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [0.90, 1.10],
        status: 'STABLE'
      },
      muscleToneIndex: {
        value: 94,
        unit: '% of baseline',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [85, 105],
        status: 'STABLE'
      },
      emgActivityLevel: {
        value: Math.round(18 + Math.abs(Math.sin(t * 0.6)) * 14),
        unit: 'µV RMS',
        provenance: prov,
        timestamp: now,
        nominalRange: [5, 50],
        status: 'NOMINAL'
      },
      jointStressScore: {
        value: 12,
        unit: '/100',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [0, 30],
        status: 'NOMINAL'
      },

      metabolicEquivalentMETs: {
        value: parseFloat((1.35 + Math.abs(Math.sin(t * 0.2)) * 0.3).toFixed(2)),
        unit: 'METs',
        provenance: prov,
        timestamp: now,
        nominalRange: [1.0, 3.5],
        status: 'NOMINAL'
      },
      accelerationX: parseFloat((Math.sin(t * 0.8) * 0.04).toFixed(3)),
      accelerationY: parseFloat((Math.cos(t * 0.7) * 0.05).toFixed(3)),
      accelerationZ: parseFloat((0.002 + Math.sin(t * 0.9) * 0.02).toFixed(3)),
      effectiveGForce: 0.004, // Microgravity station level
      cumulativeRadiationDoseMilliSieverts: {
        value: 23.4,
        unit: 'mSv',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [0, 100],
        status: 'NOMINAL'
      },

      cabinPressureKPa: {
        value: 101.3,
        unit: 'kPa',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [98.0, 103.0],
        status: 'NOMINAL'
      },
      oxygenPartialPressureKPa: {
        value: 21.2,
        unit: 'kPa',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [19.5, 23.0],
        status: 'NOMINAL'
      },
      carbonDioxidePpm: {
        value: 2840,
        unit: 'ppm',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [500, 4000],
        status: 'NOMINAL'
      },
      ambientTemperatureCelsius: {
        value: 21.8,
        unit: '°C',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [19.0, 24.0],
        status: 'NOMINAL'
      },
      relativeHumidityPercent: {
        value: 48,
        unit: '%',
        provenance: 'SAMPLE',
        timestamp: now,
        nominalRange: [35, 65],
        status: 'NOMINAL'
      },

      organMetrics: {
        heart: {
          primaryMetricName: 'Cardiac Output',
          primaryMetricValue: `${co} L/min`,
          secondaryMetricName: 'Myocardial Perfusion',
          secondaryMetricValue: 'NOMINAL (82 ml/min/100g)',
          status: 'NOMINAL',
          researchNote: 'Stroke volume stable. Normal sinus rhythm with microgravity cephalad fluid shift compensation.'
        },
        lung: {
          primaryMetricName: 'Ventilation / Perfusion',
          primaryMetricValue: 'V/Q 0.88',
          secondaryMetricName: 'Diffusing Capacity',
          secondaryMetricValue: 'DLCO 28.4 mL/min/mmHg',
          status: 'NOMINAL',
          researchNote: 'Alveolar-arterial O2 gradient intact. No pulmonary congestion or micro-atelectasis observed.'
        },
        brain: {
          primaryMetricName: 'Cerebral Perfusion Pressure',
          primaryMetricValue: `${cpp} mmHg`,
          secondaryMetricName: 'Intracranial Pressure (Est)',
          secondaryMetricValue: `${icp} mmHg`,
          status: 'NOMINAL',
          researchNote: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS) surveillance active. Optic nerve sheath within bounds.'
        },
        liver: {
          primaryMetricName: 'Hepatic Blood Flow',
          primaryMetricValue: '1,120 mL/min',
          secondaryMetricName: 'Enzymatic Activity',
          secondaryMetricValue: 'ALT 22 U/L · AST 20 U/L',
          status: 'NOMINAL',
          researchNote: 'Phase I & II hepatic drug metabolism clearance rates consistent with baseline.'
        },
        stomach: {
          primaryMetricName: 'Peristaltic Motility Rate',
          primaryMetricValue: '3.1 cpm',
          secondaryMetricName: 'Gastric Emptying Half-Time',
          secondaryMetricValue: '88 min',
          status: 'NOMINAL',
          researchNote: 'Space adaptation syndrome (SAS) nausea score 0/10. Normal gastrointestinal transit.'
        },
        kidney: {
          primaryMetricName: 'Glomerular Filtration Rate',
          primaryMetricValue: '116 mL/min/1.73m²',
          secondaryMetricName: 'Urine Osmolality',
          secondaryMetricValue: '620 mOsm/kg',
          status: 'NOMINAL',
          researchNote: 'Renal calcium excretion elevated by 12% secondary to microgravity bone turnover. Hydration protocol maintained.'
        },
        pancreas: {
          primaryMetricName: 'Endocrine Beta Function',
          primaryMetricValue: 'HOMA-IR 1.1',
          secondaryMetricName: 'Amylase / Lipase',
          secondaryMetricValue: '48 U/L · 32 U/L',
          status: 'NOMINAL',
          researchNote: 'Insulin sensitivity index normal. Post-prandial glycemic excursions within mission targets.'
        },
        spleen: {
          primaryMetricName: 'Splenic Volume Index',
          primaryMetricValue: '185 cm³',
          secondaryMetricName: 'Erythrocyte Clearance',
          secondaryMetricValue: 'NOMINAL',
          status: 'NOMINAL',
          researchNote: 'Space anemia surveillance: red blood cell mass stable post-launch contraction.'
        },
        diaphragm: {
          primaryMetricName: 'Thickening Fraction',
          primaryMetricValue: '34%',
          secondaryMetricName: 'Max Inspiratory Pressure',
          secondaryMetricValue: '-102 cmH2O',
          status: 'NOMINAL',
          researchNote: 'Diaphragmatic excursion symmetrical. No inspiratory fatigue detected.'
        }
      }
    };
  }

  /**
   * Generates a sample waveform buffer for real-time oscilloscope visualizers.
   * Lead II ECG: P wave, PR segment, QRS complex, ST segment, T wave.
   */
  public generateECGPoints(numSamples: number = 200, timeOffset: number = 0): WaveformPoint[] {
    const points: WaveformPoint[] = [];
    const heartRate = this.currentSnapshot.heartRate.value;
    const period = 60 / heartRate; // seconds per beat

    for (let i = 0; i < numSamples; i++) {
      const t = timeOffset + (i / numSamples) * 2.5; // span 2.5 seconds
      const phase = (t % period) / period; // 0.0 to 1.0 within beat
      let voltage = 0;

      // P wave (phase 0.10 - 0.18)
      if (phase >= 0.10 && phase <= 0.18) {
        const pPhase = (phase - 0.14) / 0.04;
        voltage = 0.18 * Math.exp(-pPhase * pPhase * 3);
      }
      // Q wave (phase 0.22 - 0.24)
      else if (phase >= 0.22 && phase <= 0.24) {
        voltage = -0.15 * Math.sin(((phase - 0.22) / 0.02) * Math.PI);
      }
      // R wave (phase 0.24 - 0.28)
      else if (phase > 0.24 && phase <= 0.28) {
        const rPhase = (phase - 0.26) / 0.018;
        voltage = 1.35 * Math.exp(-rPhase * rPhase * 4);
      }
      // S wave (phase 0.28 - 0.31)
      else if (phase > 0.28 && phase <= 0.31) {
        voltage = -0.35 * Math.sin(((phase - 0.28) / 0.03) * Math.PI);
      }
      // T wave (phase 0.40 - 0.58)
      else if (phase >= 0.40 && phase <= 0.58) {
        const tPhase = (phase - 0.49) / 0.08;
        voltage = 0.32 * Math.exp(-tPhase * tPhase * 2.5);
      } else {
        // Isoelectric baseline with tiny high-frequency thermal noise
        voltage = (Math.random() - 0.5) * 0.015;
      }

      points.push({ time: t, voltage: parseFloat(voltage.toFixed(3)) });
    }
    return points;
  }

  /**
   * Generates Plethysmograph (PPG) pulse waveform.
   */
  public generatePPGPoints(numSamples: number = 100, timeOffset: number = 0): WaveformPoint[] {
    const points: WaveformPoint[] = [];
    const heartRate = this.currentSnapshot.heartRate.value;
    const period = 60 / heartRate;

    for (let i = 0; i < numSamples; i++) {
      const t = timeOffset + (i / numSamples) * 2.5;
      const phase = (t % period) / period;
      let voltage = 0;

      if (phase < 0.25) {
        // Systolic upstroke
        voltage = Math.sin((phase / 0.25) * (Math.PI / 2));
      } else if (phase < 0.45) {
        // Dicrotic notch
        voltage = 1.0 - (phase - 0.25) * 2.2;
        if (voltage < 0.5) voltage = 0.5;
      } else if (phase < 0.60) {
        // Secondary diastolic wave
        voltage = 0.5 + Math.sin(((phase - 0.45) / 0.15) * Math.PI) * 0.15;
      } else {
        // Diastolic runoff
        const runoff = (phase - 0.60) / 0.40;
        voltage = 0.5 * Math.exp(-runoff * 2);
      }

      points.push({ time: t, voltage: Math.max(0, voltage) });
    }
    return points;
  }
}
