import React, { useState, useEffect, useMemo, useRef, useTransition } from 'react';
import { flushSync } from 'react-dom';
import { TopHeader } from '@/app/components/header/TopHeader';
import { LeftNavigation } from '@/app/components/sidebar/LeftNavigation';
import { PhysiologicalPanel } from '@/app/components/right-panel/PhysiologicalPanel';
import { BottomControlBar } from '@/app/components/bottom-bar/BottomControlBar';
import { AnatomyWorkspace } from '@/app/features/anatomy/AnatomyWorkspace';
import { VitalsModule } from '@/app/features/vitals/VitalsModule';
import { CardiovascularModule } from '@/app/features/cardiovascular/CardiovascularModule';
import { RespiratoryModule } from '@/app/features/respiratory/RespiratoryModule';
import { NeurologicalModule } from '@/app/features/neurological/NeurologicalModule';
import { MusculoskeletalModule } from '@/app/features/musculoskeletal/MusculoskeletalModule';
import { TemperatureModule } from '@/app/features/temperature/TemperatureModule';
import { ActivityModule } from '@/app/features/activity/ActivityModule';
import { EnvironmentalModule } from '@/app/features/environmental/EnvironmentalModule';
import { MedicalHistoryModule } from '@/app/features/medical-history/MedicalHistoryModule';
import { ResearchModule } from '@/app/features/research/ResearchModule';
import { MissionModule } from '@/app/features/mission/MissionModule';
import { SettingsModule } from '@/app/features/settings/SettingsModule';
import { TelemetryEngine } from '@/app/services/telemetry/telemetry-engine';
import { playButtonClick } from '@/app/services/interaction-sound';
import { registerAtlasTools } from '@/app/agent-tools';
import {
  DEFAULT_VISIBLE,
  SYSTEMS,
  type Atlas,
  type Concept,
  type Part,
  type SceneState,
  type SystemId,
  type View
} from '@/app/anatomy';
import type { NavigationSectionId } from '@/app/types/navigation';
import type { DataProvenance, PhysiologicalSnapshot } from '@/app/types/telemetry';

const initialSceneState: SceneState = {
  explode: 0,
  visible: DEFAULT_VISIBLE,
  selected: [],
  isolate: false,
  view: 'front', // Default front-facing presentation prioritizing torso
  rotate: false,
  reset: 0
};

export default function VitalisApp() {
  const [activeSection, setActiveSection] = useState<NavigationSectionId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'STREAM' | 'SIM' | 'PLAYBACK'>('STREAM');
  const [torsoTrigger, setTorsoTrigger] = useState<number>(0);

  // 3D Anatomy State
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [sceneState, setSceneState] = useState<SceneState>(initialSceneState);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingError, setLoadingError] = useState<string>('');
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  // Telemetry Engine State
  const telemetry = useMemo(() => TelemetryEngine.getInstance(), []);
  const [snapshot, setSnapshot] = useState<PhysiologicalSnapshot>(() => telemetry.getSnapshot());
  const [provenance, setProvenance] = useState<DataProvenance>(() => telemetry.getProvenance());

  // Subscribe to Telemetry updates
  useEffect(() => {
    const unsubscribe = telemetry.subscribe((nextSnapshot) => {
      setSnapshot({ ...nextSnapshot });
    });
    return unsubscribe;
  }, [telemetry]);

  // Handle Provenance Change
  const handleProvenanceChange = (newProv: DataProvenance) => {
    telemetry.setProvenance(newProv);
    setProvenance(newProv);
  };

  // Load Anatomy Catalogue
  useEffect(() => {
    const abort = new AbortController();
    setLoadingProgress(0);
    setLoadingError('');
    fetch('/models/atlas.json', { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Anatomy catalogue could not be loaded from server.');
        return r.json();
      })
      .then((data: unknown) => {
        setAtlas(data as Atlas);
        setLoadingProgress(100);
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setLoadingError(err.message);
        }
      });
    return () => abort.abort();
  }, []);

  // WebMCP Tool Registration
  useEffect(() => {
    if (!atlas) return;
    return registerAtlasTools(atlas, (c) => flushSync(() => handleSelectConcept(c)));
  }, [atlas]);

  const partsMap = useMemo(() => {
    if (!atlas) return new Map<string, Part>();
    return new Map(atlas.parts.map((p) => [p.id, p]));
  }, [atlas]);

  const selectedPart = useMemo(() => {
    if (sceneState.selected.length === 0) return null;
    return partsMap.get(sceneState.selected[0]) || null;
  }, [sceneState.selected, partsMap]);

  // Select concept
  const handleSelectConcept = (concept: Concept) => {
    setSelectedConcept(concept);
    setSceneState((prev) => ({
      ...prev,
      selected: concept.elements,
      isolate: false,
      rotate: false
    }));
  };

  // Select individual part by ID from 3D tap
  const handleSelectPartId = (id: string) => {
    const p = partsMap.get(id);
    if (!p) return;
    setSelectedConcept({
      id: p.conceptId,
      name: p.name,
      elements: [id]
    });
    setSceneState((prev) => ({
      ...prev,
      selected: [id],
      isolate: false,
      rotate: false
    }));
  };

  // Toggle Isolate 3D Structure
  const handleToggleIsolate = () => {
    setSceneState((prev) => ({
      ...prev,
      isolate: !prev.isolate,
      explode: 0
    }));
  };

  // Clear Selection
  const handleClearSelection = () => {
    setSelectedConcept(null);
    setSceneState((prev) => ({
      ...prev,
      selected: [],
      isolate: false
    }));
  };

  // Reset 3D Scene
  const handleResetScene = () => {
    setSceneState((prev) => ({
      ...initialSceneState,
      reset: prev.reset + 1
    }));
    setSelectedConcept(null);
  };

  // Focus Camera on Torso & Central Organs
  const handleTorsoFocus = () => {
    setTorsoTrigger((prev) => prev + 1);
  };

  // Select organ preset shortcut
  const handleSelectOrganPreset = (organName: string) => {
    if (!atlas) return;
    const q = organName.toLowerCase();
    const c = atlas.concepts.find((item) => item.name.toLowerCase().includes(q));
    if (c) {
      handleSelectConcept(c);
      if (activeSection !== 'overview' && activeSection !== 'anatomy') {
        setActiveSection('overview');
      }
    }
  };

  // Navigation handlers for organ focus
  const focusHeart = () => {
    handleSelectOrganPreset('heart');
    setActiveSection('overview');
  };

  const focusLungs = () => {
    handleSelectOrganPreset('lung');
    setActiveSection('overview');
  };

  const focusBrain = () => {
    handleSelectOrganPreset('brain');
    setActiveSection('overview');
  };

  const focusSkeleton = () => {
    setSceneState((prev) => ({
      ...prev,
      visible: ['skeletal'],
      selected: [],
      isolate: false
    }));
    setActiveSection('overview');
  };

  // Render Central Content Area based on Active Navigation Section
  const renderCentralContent = () => {
    switch (activeSection) {
      case 'overview':
      case 'anatomy':
        return (
          <AnatomyWorkspace
            atlas={atlas}
            state={sceneState}
            setState={setSceneState}
            selectedConcept={selectedConcept}
            selectedPart={selectedPart}
            onSelectConcept={handleSelectConcept}
            onSelectPartId={handleSelectPartId}
            loadingProgress={loadingProgress}
            loadingError={loadingError}
            onTorsoFocus={handleTorsoFocus}
            torsoTrigger={torsoTrigger}
          />
        );

      case 'vitals':
        return (
          <VitalsModule
            snapshot={snapshot}
            onOpenAnatomy={() => setActiveSection('overview')}
          />
        );

      case 'cardiovascular':
        return (
          <CardiovascularModule
            snapshot={snapshot}
            onFocusHeartAnatomy={focusHeart}
          />
        );

      case 'respiratory':
        return (
          <RespiratoryModule
            snapshot={snapshot}
            onFocusLungsAnatomy={focusLungs}
          />
        );

      case 'neurological':
        return (
          <NeurologicalModule
            snapshot={snapshot}
            onFocusBrainAnatomy={focusBrain}
          />
        );

      case 'musculoskeletal':
        return (
          <MusculoskeletalModule
            snapshot={snapshot}
            onFocusSkeletonAnatomy={focusSkeleton}
          />
        );

      case 'temperature':
        return (
          <TemperatureModule
            snapshot={snapshot}
            onOpenAnatomy={() => setActiveSection('overview')}
          />
        );

      case 'activity':
        return (
          <ActivityModule
            snapshot={snapshot}
            onOpenAnatomy={() => setActiveSection('overview')}
          />
        );

      case 'environmental':
        return <EnvironmentalModule snapshot={snapshot} />;

      case 'medical-history':
        return <MedicalHistoryModule />;

      case 'research':
        return <ResearchModule snapshot={snapshot} />;

      case 'mission':
        return <MissionModule missionElapsedTime={snapshot.missionElapsedTime} />;

      case 'settings':
        return (
          <SettingsModule
            provenance={provenance}
            onProvenanceChange={handleProvenanceChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#040711] text-slate-100 overflow-hidden font-mono select-none">
      {/* Top Header */}
      <TopHeader
        provenance={provenance}
        onProvenanceChange={handleProvenanceChange}
        missionElapsedTime={snapshot.missionElapsedTime}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Operational Navigation */}
        <LeftNavigation
          activeSection={activeSection}
          onSelectSection={(id) => {
            playButtonClick(0.9);
            setActiveSection(id);
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => {
            playButtonClick(0.8);
            setSidebarCollapsed((prev) => !prev);
          }}
        />

        {/* Central Workspace (3D Anatomy or Specialized Surveillance Module) */}
        <main className="flex-1 relative overflow-hidden flex flex-col bg-[#040711]">
          {renderCentralContent()}
        </main>

        {/* Right Physiological Data Panel */}
        <PhysiologicalPanel
          snapshot={snapshot}
          selectedConcept={selectedConcept}
          selectedPart={selectedPart}
          selectedPartsCount={sceneState.selected.length}
          isIsolated={sceneState.isolate}
          onToggleIsolate={handleToggleIsolate}
          onClearSelection={handleClearSelection}
          onSelectOrganPreset={handleSelectOrganPreset}
        />
      </div>

      {/* Bottom Control Bar */}
      <BottomControlBar
        explode={sceneState.explode}
        onExplodeChange={(val) => {
          setSceneState((prev) => ({
            ...prev,
            explode: val,
            view: val > 0.8 ? 'front' : prev.view,
            rotate: false
          }));
        }}
        currentView={sceneState.view}
        onViewChange={(v) => {
          setSceneState((prev) => ({
            ...prev,
            view: v,
            reset: prev.reset + 1,
            rotate: false
          }));
        }}
        onReset={handleResetScene}
        autoRotate={sceneState.rotate}
        onToggleRotate={() => {
          setSceneState((prev) => ({ ...prev, rotate: !prev.rotate }));
        }}
        activeMode={activeMode}
        onModeChange={(mode) => setActiveMode(mode)}
        onTorsoFocus={handleTorsoFocus}
      />
    </div>
  );
}
