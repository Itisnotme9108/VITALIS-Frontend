import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Layers,
  X,
  Focus,
  Info,
  Sliders,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Activity,
  Compass
} from 'lucide-react';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import { TechnicalPanel, ProvenanceBadge } from '@/app/components/common/CommonUI';
import AnatomyScene from './AnatomyScene';
import {
  SYSTEMS,
  DEFAULT_VISIBLE,
  explanation,
  type Atlas,
  type Concept,
  type Part,
  type SceneState,
  type SystemId,
  type View
} from '@/app/anatomy';

export interface AnatomyWorkspaceProps {
  atlas: Atlas | null;
  state: SceneState;
  setState: React.Dispatch<React.SetStateAction<SceneState>>;
  selectedConcept: Concept | null;
  selectedPart: Part | null;
  onSelectConcept: (concept: Concept) => void;
  onSelectPartId: (id: string) => void;
  loadingProgress: number;
  loadingError: string;
  onTorsoFocus: () => void;
  torsoTrigger: number;
}

export const AnatomyWorkspace: React.FC<AnatomyWorkspaceProps> = ({
  atlas,
  state,
  setState,
  selectedConcept,
  selectedPart,
  onSelectConcept,
  onSelectPartId,
  loadingProgress,
  loadingError,
  onTorsoFocus,
  torsoTrigger
}) => {
  const [activeOverlay, setActiveOverlay] = useState<'layers' | 'search' | 'info' | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keyboard shortcut '/' to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setActiveOverlay((prev) => (prev === 'search' ? null : 'search'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // System part counts
  const systemCounts = useMemo(() => {
    if (!atlas) return {} as Record<SystemId, number>;
    return Object.fromEntries(
      SYSTEMS.map((s) => [s.id, atlas.parts.filter((p) => p.system === s.id).length])
    ) as Record<SystemId, number>;
  }, [atlas]);

  const activeSystems = useMemo(() => {
    return SYSTEMS.filter((s) => (systemCounts[s.id] || 0) > 0);
  }, [systemCounts]);

  const visiblePartsCount = useMemo(() => {
    if (!atlas) return 0;
    const selection = new Set(state.selected);
    const visible = new Set(state.visible);
    return atlas.parts.filter((p) =>
      state.isolate ? selection.has(p.id) : visible.has(p.system) || selection.has(p.id)
    ).length;
  }, [atlas, state.visible, state.selected, state.isolate]);

  // Search results
  const searchResults = useMemo(() => {
    if (!atlas) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return ['heart', 'lung', 'liver', 'brain', 'stomach', 'spleen', 'pancreas', 'kidney', 'diaphragm', 'aorta']
        .map((name) => atlas.concepts.find((c) => c.name.toLowerCase().includes(name)))
        .filter((c): c is Concept => !!c)
        .slice(0, 10);
    }
    return atlas.concepts
      .filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
      .sort((a, b) => a.name.length - b.name.length)
      .slice(0, 40);
  }, [atlas, searchQuery]);

  const toggleSystem = (sysId: SystemId) => {
    setState((prev) => ({
      ...prev,
      selected: [],
      isolate: false,
      visible: prev.visible.includes(sysId)
        ? prev.visible.filter((id) => id !== sysId)
        : [...prev.visible, sysId]
    }));
  };

  const showOnlySystem = (sysId: SystemId) => {
    setState((prev) => ({
      ...prev,
      visible: [sysId],
      selected: [],
      isolate: false
    }));
  };

  const setSystemPreset = (preset: 'ALL' | 'SKELETON' | 'ORGANS' | 'CARDIORESPIRATORY') => {
    setState((prev) => {
      let nextVisible: SystemId[] = [];
      if (preset === 'ALL') {
        nextVisible = activeSystems.map((s) => s.id);
      } else if (preset === 'SKELETON') {
        nextVisible = ['skeletal'];
      } else if (preset === 'ORGANS') {
        nextVisible = ['cardiac', 'respiratory', 'digestive', 'urinary', 'endocrine', 'reproductive'];
      } else if (preset === 'CARDIORESPIRATORY') {
        nextVisible = ['cardiac', 'arterial', 'venous', 'respiratory'];
      }
      return {
        ...prev,
        visible: nextVisible,
        selected: [],
        isolate: false
      };
    });
  };

  return (
    <div className="relative w-full h-full bg-[#040711] overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      {atlas && (
        <AnatomyScene
          atlas={atlas}
          state={state}
          onSelect={onSelectPartId}
          onProgress={() => {}}
          onError={(message) => console.error('[VITALIS Human Atlas]', message)}
          torsoFocusTrigger={torsoTrigger}
        />
      )}

      {/* Futuristic Technical Reticle Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Corner Reticle Brackets */}
        <span className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60" />
        <span className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60" />
        <span className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60" />
        <span className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60" />

        {/* Center Crosshairs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-cyan-400" />
        </div>

        {/* Top Center Identification Banner */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-slate-400 flex items-center gap-3 bg-[#050914]/80 px-3 py-1 border border-slate-800">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-none animate-pulse" />
          <span className="text-cyan-300 font-bold uppercase">
            {state.isolate
              ? `ISOLATED: ${selectedConcept?.name || 'TARGET STRUCTURE'}`
              : state.explode > 0.05
              ? `SPATIAL INVENTORY [${Math.round(state.explode * 100)}% EXPLODED]`
              : 'BODYPARTS3D 4.0 · ADULT MALE REFERENCE ANATOMY'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="tabular-nums text-slate-300 font-medium">
            {visiblePartsCount.toLocaleString()} / 2,234 PIECES VISIBLE
          </span>
        </div>
      </div>

      {/* Top Left Floating Controls (Search & System Layers) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <VitalisButton
          variant={activeOverlay === 'search' ? 'primary' : 'secondary'}
          active={activeOverlay === 'search'}
          onClick={() => setActiveOverlay((prev) => (prev === 'search' ? null : 'search'))}
          className="text-xs h-8 px-3"
        >
          <Search size={14} />
          <span>FIND STRUCTURE</span>
          <kbd className="ml-1 text-[9px] px-1 bg-slate-800 border border-slate-700 text-slate-400">
            /
          </kbd>
        </VitalisButton>

        <VitalisButton
          variant={activeOverlay === 'layers' ? 'primary' : 'secondary'}
          active={activeOverlay === 'layers'}
          onClick={() => setActiveOverlay((prev) => (prev === 'layers' ? null : 'layers'))}
          className="text-xs h-8 px-3"
        >
          <Layers size={14} />
          <span>SYSTEMS</span>
          <span className="ml-1 text-[10px] text-cyan-400 font-bold">
            [{state.visible.length}]
          </span>
        </VitalisButton>

        <VitalisButton
          variant={activeOverlay === 'info' ? 'primary' : 'secondary'}
          active={activeOverlay === 'info'}
          onClick={() => setActiveOverlay((prev) => (prev === 'info' ? null : 'info'))}
          className="text-xs h-8 px-2.5"
          title="Anatomy Provenance & Dataset Licensing (CC BY 4.0)"
        >
          <Info size={14} />
        </VitalisButton>
      </div>

      {/* Quick Internal Organ Focusing Bar */}
      <div className="absolute top-13 left-3 z-20 flex items-center gap-1 bg-[#050914]/90 border border-slate-800 p-1 font-mono text-[9px]">
        <span className="text-slate-400 px-1 font-bold">FOCUS:</span>
        {[
          { label: 'TORSO', action: onTorsoFocus },
          {
            label: 'HEART',
            action: () => {
              const c = atlas?.concepts.find((x) => x.name.toLowerCase() === 'heart');
              if (c) onSelectConcept(c);
            }
          },
          {
            label: 'LUNGS',
            action: () => {
              const c = atlas?.concepts.find((x) => x.name.toLowerCase().includes('lung'));
              if (c) onSelectConcept(c);
            }
          },
          {
            label: 'LIVER',
            action: () => {
              const c = atlas?.concepts.find((x) => x.name.toLowerCase() === 'liver');
              if (c) onSelectConcept(c);
            }
          },
          {
            label: 'BRAIN',
            action: () => {
              const c = atlas?.concepts.find((x) => x.name.toLowerCase() === 'brain');
              if (c) onSelectConcept(c);
            }
          },
          {
            label: 'KIDNEYS',
            action: () => {
              const c = atlas?.concepts.find((x) => x.name.toLowerCase().includes('kidney'));
              if (c) onSelectConcept(c);
            }
          }
        ].map((item) => (
          <VitalisButton
            key={item.label}
            size="sm"
            variant="ghost"
            onClick={item.action}
            className="text-[9px] h-5 px-1.5 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50"
          >
            {item.label}
          </VitalisButton>
        ))}
      </div>

      {/* Search Floating Panel */}
      {activeOverlay === 'search' && (
        <div className="absolute top-12 left-3 w-88 bg-[#070c18] border border-cyan-500/60 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-30 font-mono text-xs p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Search size={14} /> SEARCH ANATOMY DIRECTORY
            </span>
            <VitalisButton
              size="icon"
              variant="ghost"
              onClick={() => setActiveOverlay(null)}
              className="h-5 w-5 text-slate-400"
            >
              <X size={13} />
            </VitalisButton>
          </div>

          <div className="relative mb-2">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Heart, femoral artery, aorta, vagus nerve..."
              className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:border-cyan-400 rounded-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
            {searchResults.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-[11px]">
                No anatomical structures matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              searchResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectConcept(c);
                    setActiveOverlay(null);
                  }}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-cyan-950/60 border border-transparent hover:border-cyan-500/50 rounded-none transition-colors group"
                >
                  <span className="text-slate-200 group-hover:text-cyan-300 capitalize text-xs">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    {c.elements.length} {c.elements.length === 1 ? 'part' : 'parts'}
                  </span>
                </button>
              ))
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
            <span>Indexed: 3,432 concepts</span>
            <span>BodyParts3D</span>
          </div>
        </div>
      )}

      {/* System Layers Floating Panel */}
      {activeOverlay === 'layers' && (
        <div className="absolute top-12 left-3 w-80 bg-[#070c18] border border-cyan-500/60 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-30 font-mono text-xs p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} /> ANATOMICAL SYSTEMS
            </span>
            <VitalisButton
              size="icon"
              variant="ghost"
              onClick={() => setActiveOverlay(null)}
              className="h-5 w-5 text-slate-400"
            >
              <X size={13} />
            </VitalisButton>
          </div>

          {/* System Presets */}
          <div className="grid grid-cols-2 gap-1 mb-2.5">
            <VitalisButton
              size="sm"
              variant="outline"
              onClick={() => setSystemPreset('ALL')}
              className="text-[10px] h-6"
            >
              ALL SYSTEMS
            </VitalisButton>
            <VitalisButton
              size="sm"
              variant="outline"
              onClick={() => setSystemPreset('ORGANS')}
              className="text-[10px] h-6"
            >
              INTERNAL ORGANS
            </VitalisButton>
            <VitalisButton
              size="sm"
              variant="outline"
              onClick={() => setSystemPreset('CARDIORESPIRATORY')}
              className="text-[10px] h-6"
            >
              CARDIO-RESP
            </VitalisButton>
            <VitalisButton
              size="sm"
              variant="outline"
              onClick={() => setSystemPreset('SKELETON')}
              className="text-[10px] h-6"
            >
              SKELETON ONLY
            </VitalisButton>
          </div>

          {/* System Checkbox List */}
          <div className="max-h-72 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-1">
            {activeSystems.map((s) => {
              const isVisible = state.visible.includes(s.id);
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-between p-1.5 border ${
                    isVisible
                      ? 'bg-slate-900/90 border-slate-700'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                  }`}
                >
                  <button
                    onClick={() => showOnlySystem(s.id)}
                    className="flex items-center gap-2 flex-1 text-left group"
                    title={`Isolate system: ${s.name}`}
                  >
                    <span
                      className="w-2 h-2 shrink-0 rounded-none"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[11px] text-slate-200 group-hover:text-cyan-300 truncate">
                      {s.name}
                    </span>
                    <span className="text-[9px] text-slate-400 tabular-nums">
                      {systemCounts[s.id]}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleSystem(s.id)}
                    className={`p-1 text-xs ${
                      isVisible ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={isVisible ? `Hide ${s.name}` : `Show ${s.name}`}
                  >
                    {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
            <span>{visiblePartsCount.toLocaleString()} meshes rendered</span>
            <VitalisButton
              size="sm"
              variant="ghost"
              onClick={() => setState((prev) => ({ ...prev, visible: [], selected: [], isolate: false }))}
              className="h-5 text-[9px] px-1 text-rose-400 hover:text-rose-300"
            >
              HIDE ALL
            </VitalisButton>
          </div>
        </div>
      )}

      {/* Dataset Attribution & Provenance Modal */}
      {activeOverlay === 'info' && (
        <div className="absolute top-12 left-3 w-96 bg-[#070c18] border border-cyan-500/60 shadow-[0_0_25px_rgba(0,0,0,0.8)] z-30 font-mono text-xs p-4">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} /> ANATOMICAL PROVENANCE & LICENSING
            </span>
            <VitalisButton
              size="icon"
              variant="ghost"
              onClick={() => setActiveOverlay(null)}
              className="h-5 w-5 text-slate-400"
            >
              <X size={13} />
            </VitalisButton>
          </div>

          <div className="space-y-2.5 text-slate-300 text-[11px] leading-relaxed max-h-80 overflow-y-auto">
            <p>
              <strong>Dataset:</strong> BodyParts3D 4.0, adult male reference anatomy.
            </p>
            <p>
              <strong>Licensing:</strong> Creative Commons Attribution 4.0 International (CC BY 4.0).
              © The Database Center for Life Science (DBCLS).
            </p>
            <p>
              <strong>Geometry Details:</strong> 2,234 individually indexed meshes, 3,432 named FMA
              concepts, 2,288,268 triangles merged into 15 binary chunks.
            </p>
            <p className="p-2 bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
              <strong>Medical Disclaimer:</strong> This dataset represents a specific adult male
              reference model based on MRI and anatomic illustration. It is not an exhaustive or
              universally representative anatomy. Provided strictly for educational and physiological
              research visualization.
            </p>
            <div className="pt-2">
              <a
                href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 text-[10px]"
              >
                View Official BodyParts3D License ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Loading Progress Bar */}
      {loadingProgress < 100 && !loadingError && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050914]/95 border border-cyan-500/60 p-5 z-40 text-center font-mono min-w-72 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <Activity size={24} className="text-cyan-400 animate-pulse mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest mb-1">
            INITIALIZING HUMAN ATLAS
          </h4>
          <p className="text-[10px] text-slate-400 mb-3">
            Streaming 2,234 GPU meshes [{loadingProgress}%]
          </p>
          <div className="w-full h-1.5 bg-slate-800 border border-slate-700 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {loadingError && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-950/90 border border-rose-500 p-4 z-40 text-center font-mono max-w-sm">
          <h4 className="text-xs font-bold text-rose-300 uppercase mb-2">3D PIPELINE ERROR</h4>
          <p className="text-[10px] text-rose-200 mb-3">{loadingError}</p>
          <VitalisButton
            variant="danger"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            RELOAD VIEWER
          </VitalisButton>
        </div>
      )}
    </div>
  );
};
