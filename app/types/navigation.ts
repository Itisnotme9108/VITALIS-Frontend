/**
 * VITALIS - Navigation Types & Definitions
 * 
 * Defines the 14 functional operational sections of the VITALIS biomedical system.
 */

export type NavigationSectionId =
  | 'overview'
  | 'anatomy'
  | 'vitals'
  | 'cardiovascular'
  | 'respiratory'
  | 'neurological'
  | 'musculoskeletal'
  | 'temperature'
  | 'activity'
  | 'environmental'
  | 'medical-history'
  | 'research'
  | 'mission'
  | 'settings';

export interface NavigationSection {
  id: NavigationSectionId;
  label: string;
  shortCode: string;
  category: 'CORE' | 'PHYSIOLOGY' | 'MISSION_DATA' | 'SYSTEM';
  badge?: string;
  description: string;
}

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    shortCode: '01 // OVW',
    category: 'CORE',
    description: 'Executive bio-telemetry summary and primary 3D anatomical locus.'
  },
  {
    id: 'anatomy',
    label: 'Human Anatomy',
    shortCode: '02 // ANAT',
    category: 'CORE',
    badge: '3D',
    description: 'Interactive reference anatomy, system isolation, and 2,234 indexed structures.'
  },
  {
    id: 'vitals',
    label: 'Vital Signs',
    shortCode: '03 // VITL',
    category: 'PHYSIOLOGY',
    badge: 'LIVE',
    description: 'Real-time multi-parameter physiological streams and baseline bounds.'
  },
  {
    id: 'cardiovascular',
    label: 'Cardiovascular',
    shortCode: '04 // CARD',
    category: 'PHYSIOLOGY',
    description: 'Hemodynamic indices, 12-lead ECG waveform stream, HRV, and arterial compliance.'
  },
  {
    id: 'respiratory',
    label: 'Respiratory',
    shortCode: '05 // RESP',
    category: 'PHYSIOLOGY',
    description: 'Capnography, tidal volumes, EtCO2, and pulmonary gas exchange kinetics.'
  },
  {
    id: 'neurological',
    label: 'Neurological',
    shortCode: '06 // NEUR',
    category: 'PHYSIOLOGY',
    description: 'Quantitative EEG spectral bands, intracranial pressure estimates, and workload.'
  },
  {
    id: 'musculoskeletal',
    label: 'Musculoskeletal',
    shortCode: '07 // MSKL',
    category: 'PHYSIOLOGY',
    description: 'Microgravity bone mineral density tracking and muscle activation telemetry.'
  },
  {
    id: 'temperature',
    label: 'Body Temperature',
    shortCode: '08 // TEMP',
    category: 'PHYSIOLOGY',
    description: 'Core and peripheral thermoregulatory gradients and heat dissipation metrics.'
  },
  {
    id: 'activity',
    label: 'Activity & Movement',
    shortCode: '09 // ACTV',
    category: 'PHYSIOLOGY',
    description: '3-axis kinematics, cumulative radiation dosimeter, and metabolic energy expenditure.'
  },
  {
    id: 'environmental',
    label: 'Environmental Conditions',
    shortCode: '10 // ENVR',
    category: 'MISSION_DATA',
    description: 'Habitation atmosphere, pO2, pCO2, cabin barometric pressure, and ambient acoustic.'
  },
  {
    id: 'medical-history',
    label: 'Medical History / Records',
    shortCode: '11 // MEDR',
    category: 'MISSION_DATA',
    description: 'Longitudinal astronaut baseline records, countermeasures log, and clinical history.'
  },
  {
    id: 'research',
    label: 'Research Analysis',
    shortCode: '12 // RSCH',
    category: 'MISSION_DATA',
    description: 'Spaceflight physiological variance models, terrestrial delta, and cohort analysis.'
  },
  {
    id: 'mission',
    label: 'Mission Monitoring',
    shortCode: '13 // MISS',
    category: 'MISSION_DATA',
    badge: 'MET',
    description: 'Expedition mission elapsed time, orbital pass tracking, and telemetry link health.'
  },
  {
    id: 'settings',
    label: 'Settings',
    shortCode: '14 // CONF',
    category: 'SYSTEM',
    description: 'Hardware sensor link config, Web Audio feedback, display units, and 3D graphics.'
  }
];
