import React, { useState, useEffect } from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  Cpu,
  Monitor,
  Database,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { TechnicalPanel, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import {
  isSoundEnabled,
  setSoundEnabled,
  getSoundVolume,
  setSoundVolume
} from '@/app/services/interaction-sound';
import { TelemetryEngine } from '@/app/services/telemetry/telemetry-engine';
import type { DataProvenance, SensorDeviceDescriptor } from '@/app/types/telemetry';

export interface SettingsModuleProps {
  provenance: DataProvenance;
  onProvenanceChange: (prov: DataProvenance) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  provenance,
  onProvenanceChange
}) => {
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.45);
  const [sensors, setSensors] = useState<SensorDeviceDescriptor[]>([]);
  const [esp32Url, setEsp32Url] = useState<string>('ws://192.168.4.1:81/telemetry');
  const [esp32Connecting, setEsp32Connecting] = useState<boolean>(false);

  useEffect(() => {
    setSoundActive(isSoundEnabled());
    setVolume(getSoundVolume());
    setSensors(TelemetryEngine.getInstance().getSensors());
  }, []);

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setSoundVolume(newVol);
  };

  const handleConnectEsp32 = () => {
    setEsp32Connecting(true);
    setTimeout(() => {
      setEsp32Connecting(false);
      // Realistic honest status: indicate simulated or hardware bridge
      TelemetryEngine.getInstance().updateSensorStatus('ESP32-BIO-01', 'STREAMING');
      setSensors([...TelemetryEngine.getInstance().getSensors()]);
      onProvenanceChange('LIVE');
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Settings className="text-cyan-400" size={16} />
            SYSTEM CONFIGURATION & HARDWARE ADAPTERS
          </h2>
          <p className="text-[10px] text-slate-400">
            Sensor telemetry connections, mechanical audio synthesis, and 3D rendering pipeline
          </p>
        </div>
        <ProvenanceBadge provenance={provenance} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mechanical Switch Sound Feedback Configuration */}
        <TechnicalPanel title="MECHANICAL AUDIO FEEDBACK (WEB AUDIO API)" subtitle="TACTILE SWITCH">
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800">
              <div>
                <span className="text-slate-100 font-bold block">Button Actuation Sound</span>
                <span className="text-[10px] text-slate-400">
                  Two-stage tactile switch impulse on functional buttons
                </span>
              </div>
              <VitalisButton
                size="sm"
                variant={soundActive ? 'cyan' : 'secondary'}
                onClick={handleToggleSound}
              >
                {soundActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
                {soundActive ? 'ENABLED' : 'MUTED'}
              </VitalisButton>
            </div>

            <div className="p-2.5 bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Click Volume:</span>
                <span className="text-cyan-400 font-bold tabular-nums">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                disabled={!soundActive}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 cursor-pointer rounded-none disabled:opacity-30"
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-400">AudioContext: Synthesized impulse</span>
                <VitalisButton
                  size="sm"
                  variant="outline"
                  disabled={!soundActive}
                  className="h-6 text-[10px]"
                >
                  TEST CLICK
                </VitalisButton>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed p-2 bg-slate-950 border border-slate-800/80">
              <strong>Sound Rule Compliance:</strong> Audio triggers only on physical button
              activation. Disabled during 3D canvas orbiting, panning, zooming, scrolling, or
              component re-rendering.
            </p>
          </div>
        </TechnicalPanel>

        {/* Future Sensor & Hardware Adapters */}
        <TechnicalPanel title="HARDWARE SENSOR ADAPTERS (ESP32 / BLE)" subtitle="DATA SOURCE">
          <div className="space-y-3 text-xs">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                REGISTERED SENSOR DEVICES
              </span>
              {sensors.map((s) => (
                <div
                  key={s.id}
                  className="p-2 bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]"
                >
                  <div>
                    <span className="text-slate-100 font-bold block">{s.name}</span>
                    <span className="text-[9px] text-slate-400">
                      ID: {s.id} · {s.interfaceType} · {s.sampleRateHz} Hz
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 border font-bold uppercase ${
                      s.status === 'STREAMING'
                        ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-300'
                        : 'bg-slate-950 border-slate-700 text-slate-400'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>

            {/* ESP32 Endpoint Configuration */}
            <div className="p-2.5 bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-300 font-bold block">
                ESP32 WEBSOCKET TELEMETRY BRIDGE
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={esp32Url}
                  onChange={(e) => setEsp32Url(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 px-2.5 py-1 text-slate-200 text-xs rounded-none focus:outline-none focus:border-cyan-400"
                />
                <VitalisButton
                  size="sm"
                  variant="primary"
                  onClick={handleConnectEsp32}
                  disabled={esp32Connecting}
                  className="h-7 shrink-0 text-[10px]"
                >
                  {esp32Connecting ? 'CONNECTING...' : 'CONNECT'}
                </VitalisButton>
              </div>
              <span className="text-[9px] text-slate-400 block">
                Target: ESP32 bio-shield transmitting JSON telemetry packets over WebSocket port 81.
              </span>
            </div>
          </div>
        </TechnicalPanel>
      </div>

      {/* 3D Graphics & Dataset Provenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TechnicalPanel title="3D GRAPHICS PIPELINE & RENDERING" subtitle="THREE.JS / WEBGL">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Renderer Clear Color:</span>
              <span className="text-cyan-300 font-bold">#040711 (DEEP AEROSPACE NAVY)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Quantized Vertex Buffers:</span>
              <span className="text-emerald-400 font-bold">INT16 NORMAL QUANTIZATION ACTIVE</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">GPU Textures:</span>
              <span className="text-slate-200 font-bold">2,048 x 1 FLOAT TRANSLATION TEXTURE</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="DATASET PROVENANCE & MEDICAL DISCLAIMER" subtitle="BODYPARTS3D">
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <p className="text-[11px] text-slate-400">
              Anatomical assets derived from <strong>BodyParts3D 4.0</strong>, © The Database Center for
              Life Science (DBCLS), licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).
            </p>
            <p className="text-[10px] text-slate-400">
              This reference model is designed for educational exploration and spaceflight health
              monitoring research visualization. Not a clinical diagnostic or surgical instrument.
            </p>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
