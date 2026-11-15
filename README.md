# VITALIS — Vital Intelligence and Tracking for Health Systems

**VITALIS** is an advanced astronaut physiological research and biomedical surveillance platform integrating the **BodyParts3D Human Reference Atlas 3D engine**. It provides a high-density, real-time industrial telemetry control system designed for long-duration spaceflight human health monitoring, microgravity adaptation research, and anatomical structure inspection.

---

## System Capabilities

### 1. Central 3D Human Anatomy Engine
- **Direct 3D Reference Model:** Integrated BodyParts3D 4.0 adult male reference anatomy (TARO MRI reference dataset).
- **2,234 Individually Selectable Meshes & 3,432 Named FMA Concepts:** High-performance WebGL scene powered by Three.js with custom GPU shaders for per-part translation, visibility, and cyan luminous highlighting.
- **15 Biological Systems:** Skeletal, muscular, cardiac, arterial, venous, nervous, respiratory, digestive, urinary, lymphatic, endocrine, reproductive, integumentary, connective, and sensory systems.
- **Torso & Central Organ Prioritization:** Framed by default on the thoracic and abdominal cavities (Heart, Lungs, Liver, Stomach, Kidneys, Spleen, Pancreas, Spine, Diaphragm).
- **Spatial Exploded Inventory:** GPU-driven non-overlapping packing algorithm allows exploding anatomy from 0% to 100% while keeping individual pieces identifiable.
- **Structure Isolation:** One-click isolation centers and fits any selected anatomical structure with custom camera framing.

### 2. Operational Navigation (14 Functional Modules)
1. **Overview:** Executive bio-telemetry summary with central 3D anatomy, priority organ focus buttons, and live physiological stream.
2. **Human Anatomy:** Expanded 3D explorer with system checklist, hierarchy search, and structure isolation.
3. **Vital Signs:** Multi-parameter patient monitor (HR, SpO2, RR, BP, MAP, Temp) with continuous baseline envelopes.
4. **Cardiovascular:** Cardiac electrophysiology, diagnostic Lead II ECG oscilloscope, Wiggers parameters, and HRV analysis.
5. **Respiratory:** End-tidal capnography (EtCO2), tidal volume, minute ventilation, and alveolar gas exchange kinetics.
6. **Neurological:** Quantitative EEG spectral bands (Alpha, Beta, Theta, Delta), intracranial pressure (ICP) dynamics, and Spaceflight-Associated Neuro-ocular Syndrome (SANS) surveillance.
7. **Musculoskeletal:** Microgravity bone mineral density tracking, muscle tone indices, surface EMG activation, and ARED countermeasure adherence.
8. **Body Temperature:** Ingestible telemetry capsule core temperature, core-to-shell thermal gradients, and circadian rhythms.
9. **Activity & Movement:** 3-axis chest IMU kinematics, metabolic equivalents (METs), and cumulative cosmic radiation dosimeter.
10. **Environmental Conditions:** Cabin barometric pressure, oxygen partial pressure, CO2 scrubbing, and acoustic noise dosimetry.
11. **Medical History / Records:** Longitudinal astronaut baseline comparison, flight qualification status, and clinical logs.
12. **Research Analysis:** Spaceflight variance modeling, Z-score cohort benchmarks, and CSV/JSON telemetry data export.
13. **Mission Monitoring:** Mission Elapsed Time (MET) clock, orbital telemetry link status, and EVA bio-suit life support tracking.
14. **Settings:** Sensor hardware configuration (ESP32 WebSocket/Serial), mechanical audio feedback controls, and 3D graphics pipeline settings.

### 3. Industrial Sharp-Corner Visual Language
- Strict rectangular corner design token (`border-radius: 0 !important`).
- High-contrast aerospace navy backgrounds (`#040711`, `#070c18`, `#0c1424`).
- Luminous cyan (`#00f0ff`) and medical teal (`#00e5bc`) telemetry indicators.
- Precision corner reticles, technical brackets, and monospace tabular readouts.

### 4. Mechanical Button Sound System
- Web Audio API dual-stage mechanical tactile switch synthesis:
  - Stage 1: Sharp micro-transient contact impulse (~2.4 kHz, ~3ms).
  - Stage 2: Damped mechanical latch resonance (~160 Hz body, ~14ms).
- Strictly activated only on functional button clicks (debounced).
- Zero audio on 3D canvas orbiting, panning, zooming, dragging, scrolling, or programmatic re-renders.
- Volume control and mute toggle with local storage persistence.

### 5. Medical Safety & Data Provenance
Every physiological measurement is explicitly labeled with verified data provenance:
- `[LIVE]`: Physical sensor stream (ESP32 bio-shield, BLE pulse-oximeter).
- `[SIMULATED]`: Deterministic spaceflight physiological model.
- `[SAMPLE]`: Static clinical baseline research record.
- `[UNAVAILABLE]`: Sensor disconnected.

---

## Architecture Overview

```
VITALIS/
├── app/
│   ├── components/
│   │   ├── common/              # VitalisButton, TechnicalPanel, MetricTile, ProvenanceBadge
│   │   ├── header/              # TopHeader (Branding, MET, Provenance, Audio toggle, CMO)
│   │   ├── sidebar/             # LeftNavigation (14 operational modules)
│   │   ├── right-panel/         # PhysiologicalPanel (Context-sensitive telemetry & 3D organ correlates)
│   │   └── bottom-bar/          # BottomControlBar (Explode slider, camera angles, mode toggle)
│   ├── features/
│   │   ├── anatomy/             # AnatomyScene (Three.js WebGL, shaders, picking), AnatomyWorkspace
│   │   ├── vitals/              # VitalsModule
│   │   ├── cardiovascular/      # CardiovascularModule (Lead II ECG oscilloscope, HRV)
│   │   ├── respiratory/         # RespiratoryModule (Capnography waveform)
│   │   ├── neurological/        # NeurologicalModule (qEEG spectral bands, SANS)
│   │   ├── musculoskeletal/     # MusculoskeletalModule (Bone density, EMG)
│   │   ├── temperature/         # TemperatureModule (Core/shell gradient)
│   │   ├── activity/            # ActivityModule (3-axis IMU, dosimeter)
│   │   ├── environmental/       # EnvironmentalModule (Life support atmosphere)
│   │   ├── medical-history/     # MedicalHistoryModule (Baseline matrix)
│   │   ├── research/            # ResearchModule (Data export CSV/JSON)
│   │   ├── mission/             # MissionModule (MET clock, orbital link)
│   │   └── settings/            # SettingsModule (ESP32 adapter, audio volume)
│   ├── services/
│   │   ├── interaction-sound.ts # Web Audio API mechanical switch click synthesizer
│   │   └── telemetry/           # TelemetryEngine, waveforms, sensor adapter interfaces
│   ├── types/
│   │   ├── navigation.ts        # Module definitions
│   │   └── telemetry.ts         # SensorDevice, TelemetryPacket, ISensorAdapter
│   ├── anatomy.ts               # Anatomy systems, parts, concepts data model
│   ├── explosion-layout.ts      # Spatial layout packing algorithm
│   ├── pointer-tap.ts           # Tap vs orbit/pan disambiguator
│   ├── model-download.ts        # Binary decompression stream handler
│   ├── globals.css              # Sharp-corner dark industrial design system
│   └── page.tsx                 # Root application composition
├── web/
│   ├── index.html               # Entry HTML
│   └── main.tsx                 # React 19 root bootstrap
├── public/
│   ├── models/                  # 15 binary chunks and atlas.json (BodyParts3D)
│   └── ATTRIBUTION.md           # Dataset attribution (CC BY 4.0)
└── scripts/
    ├── validate-atlas.mjs       # Mesh, triangle, and concept integrity test
    └── validate-interactions.mjs# Exploded packing & tap disambiguation test
```

---

## Local Development & Validation

### Prerequisites
- Node.js 22.13 or newer (`node -v`)
- npm 10+ (`npm -v`)

### Install Dependencies
```sh
npm ci
```

### Start Local Development Server
```sh
npm run dev
```
Open **http://localhost:3016** in your browser.

### Run Automated Validation
```sh
npm run validate
```
This runs:
1. `npm run check` (TypeScript static type checking across all files)
2. `node scripts/validate-atlas.mjs` (Verifies all 2,234 meshes, 3,432 concepts, 2,288,268 triangles, and binary buffers)
3. `node scripts/validate-interactions.mjs` (Verifies non-overlapping exploded packing, search contracts, and tap-versus-drag disambiguation)
4. `npm run build` (Full Vite production bundle creation in `dist/`)

---

## Data Provenance & Anatomy Licensing

Anatomical model geometry and terminology derived from **BodyParts3D 4.0**, © The Database Center for Life Science (DBCLS), licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.
- Official License: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- Dataset: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- Primary Publication: Mitsuhashi et al. (2009), *BodyParts3D: 3D structure database for anatomical concepts*, Nucleic Acids Res, 37, D782-D785.

*Medical Safety Notice:* VITALIS is an advanced research and engineering visualization platform. Simulated telemetry and reference models are not intended for clinical diagnostic, surgical, or emergency life-critical operations.
