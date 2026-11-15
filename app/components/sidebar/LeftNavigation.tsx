import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Activity,
  Heart,
  Wind,
  Brain,
  Bone,
  Thermometer,
  Footprints,
  Compass,
  FileText,
  FlaskConical,
  Radio,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NAVIGATION_SECTIONS, type NavigationSectionId } from '@/app/types/navigation';
import { VitalisButton } from '@/app/components/common/VitalisButton';

export interface LeftNavigationProps {
  activeSection: NavigationSectionId;
  onSelectSection: (id: NavigationSectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const SECTION_ICONS: Record<NavigationSectionId, React.ReactNode> = {
  overview: <LayoutDashboard size={15} />,
  anatomy: <Layers size={15} />,
  vitals: <Activity size={15} />,
  cardiovascular: <Heart size={15} />,
  respiratory: <Wind size={15} />,
  neurological: <Brain size={15} />,
  musculoskeletal: <Bone size={15} />,
  temperature: <Thermometer size={15} />,
  activity: <Footprints size={15} />,
  environmental: <Compass size={15} />,
  'medical-history': <FileText size={15} />,
  research: <FlaskConical size={15} />,
  mission: <Radio size={15} />,
  settings: <Settings size={15} />
};

export const LeftNavigation: React.FC<LeftNavigationProps> = ({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse
}) => {
  const categories: Array<{
    name: string;
    items: typeof NAVIGATION_SECTIONS;
  }> = [
    {
      name: 'OPERATIONAL CORE',
      items: NAVIGATION_SECTIONS.filter((s) => s.category === 'CORE')
    },
    {
      name: 'PHYSIOLOGICAL SURVEILLANCE',
      items: NAVIGATION_SECTIONS.filter((s) => s.category === 'PHYSIOLOGY')
    },
    {
      name: 'MISSION TELEMETRY',
      items: NAVIGATION_SECTIONS.filter((s) => s.category === 'MISSION_DATA')
    },
    {
      name: 'SYSTEM',
      items: NAVIGATION_SECTIONS.filter((s) => s.category === 'SYSTEM')
    }
  ];

  return (
    <nav
      className={`h-full bg-[#050813] border-r border-slate-800 flex flex-col transition-all duration-150 select-none shrink-0 ${
        collapsed ? 'w-14' : 'w-64'
      }`}
      aria-label="Operational Navigation"
    >
      {/* Sidebar Top: Collapse Toggle & Subtitle */}
      <div className="h-10 border-b border-slate-800/80 px-3 flex items-center justify-between bg-slate-950/40">
        {!collapsed && (
          <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">
            MODULE REGISTRY
          </span>
        )}
        <VitalisButton
          size="icon"
          variant="ghost"
          onClick={onToggleCollapse}
          className="h-6 w-6 ml-auto text-slate-400 hover:text-cyan-400"
          title={collapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </VitalisButton>
      </div>

      {/* Navigation Sections List */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {categories.map((cat) => (
          <div key={cat.name} className="px-2">
            {!collapsed && (
              <div className="px-2 py-1 text-[9px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                {cat.name}
              </div>
            )}
            <div className="space-y-0.5">
              {cat.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    title={collapsed ? `${item.label} (${item.shortCode})` : item.description}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 font-mono text-xs rounded-none transition-all text-left relative group ${
                      isActive
                        ? 'bg-cyan-950/70 border-l-2 border-cyan-400 text-cyan-300 font-semibold shadow-[inset_0_0_12px_rgba(0,240,255,0.12)]'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border-l-2 border-transparent'
                    }`}
                  >
                    <span
                      className={`shrink-0 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      {SECTION_ICONS[item.id]}
                    </span>

                    {!collapsed && (
                      <>
                        <span className="truncate flex-1 text-[11px] tracking-wide">
                          {item.label}
                        </span>

                        {item.badge && (
                          <span
                            className={`text-[8px] px-1 py-0 border font-bold uppercase rounded-none ${
                              isActive
                                ? 'bg-cyan-900/60 border-cyan-500/60 text-cyan-300'
                                : 'bg-slate-900 border-slate-700 text-slate-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer: Hardware Interface Diagnostic */}
      {!collapsed && (
        <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/60 font-mono text-[9px] text-slate-400 space-y-1 select-none">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">HARDWARE LINK:</span>
            <span className="text-cyan-400 font-bold">READY (ESP32)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">LATENCY:</span>
            <span className="text-emerald-400 tabular-nums font-bold">12 ms</span>
          </div>
        </div>
      )}
    </nav>
  );
};
