// pages/Projects.tsx — o projeto como contêiner relacional (Fase 8 · D4)
// Reescrito sobre engine/project: belongs_to é a única verdade de
// pertencimento; sem barra de %, sem métrica — linguagem de presença
// ("2 de 5 abertos · quieto há 13 dias"). O próximo convida, não cobra.

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { useConnections } from '@/hooks/useConnections';
import { usePipeline } from '@/hooks/usePipeline';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import type { AtomItem, AtomModule } from '@/types/item';
import { MODULES } from '@/types/item';
import { MODULE_COLORS, STAGE_COLORS, STAGE_GEOMETRIES, getTypeColor } from '@/components/atoms/tokens';
import { listProjects, projectPresence, presenceLine, type ProjectPresence } from '@/engine/project';

export function ProjectsPage() {
  const { items } = useItems();
  const { connections } = useConnections();
  const { capture, classify } = usePipeline();
  const { selectItem } = useNav();
  const user = useAppStore((s) => s.user);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newModule, setNewModule] = useState<AtomModule>('work');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const projects = useMemo(() => listProjects(items), [items]);

  const presences = useMemo(() => {
    const map: Record<string, ProjectPresence> = {};
    projects.forEach((p) => {
      map[p.id] = projectPresence(p, items, connections);
    });
    return map;
  }, [projects, items, connections]);

  const selected = selectedId ? projects.find((p) => p.id === selectedId) : null;
  const activeCount = projects.filter((p) => p.status === 'active').length;

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.status === filter);
  }, [projects, filter]);

  const filteredByModule = useMemo(() => {
    const grouped: Record<string, AtomItem[]> = {};
    filteredProjects.forEach((p) => {
      const key = p.module ?? 'bridge';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    });
    return grouped;
  }, [filteredProjects]);

  const handleCreate = async () => {
    if (!newTitle.trim() || !user) return;
    const item = await capture(newTitle.trim());
    if (item) {
      await classify(item.id, 'project', newModule);
      setCreating(false);
      setNewTitle('');
      selectItem(item.id);
    }
  };

  if (selected) {
    return <ProjectDetail presence={presences[selected.id]} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-medium tracking-tight">projects</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{projects.length} projetos · {activeCount} vivos</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-lg shadow-lg shadow-accent/20"
          aria-label="Criar projeto"
        >
          +
        </button>
      </div>

      {/* Create modal */}
      {creating && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">novo projeto</div>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
            placeholder="titulo do projeto..."
            className="w-full text-sm bg-transparent border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent-light mb-2"
          />
          <div className="flex flex-wrap gap-1.5 mb-3">
            {MODULES.map((m) => (
              <button
                key={m.key}
                onClick={() => setNewModule(m.key)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  newModule === m.key ? 'border-accent bg-accent-bg text-accent font-medium' : 'border-border text-text-muted'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setCreating(false); setNewTitle(''); }} className="flex-1 py-2.5 text-center text-xs border border-border rounded-lg text-text-muted">cancelar</button>
            <button onClick={handleCreate} disabled={!newTitle.trim()} className="flex-1 py-2.5 text-center text-xs bg-accent text-white rounded-lg font-medium disabled:opacity-40">criar</button>
          </div>
        </motion.div>
      )}

      {/* Filter chips — paused morreu: nenhuma UI produz esse status */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto">
        {([['all', 'todos'], ['active', 'vivos'], ['completed', 'selados']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              filter === key ? 'bg-accent-bg text-accent font-medium' : 'bg-surface text-text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl text-text-muted mb-3">□</div>
          <p className="text-sm text-text-muted">nenhum projeto ainda</p>
          <button onClick={() => setCreating(true)} className="text-xs text-accent mt-2">+ criar primeiro projeto</button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-text-muted">nenhum projeto aqui</p>
        </div>
      ) : (
        Object.entries(filteredByModule).map(([mod, projs]) => (
          <div key={mod}>
            <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-4 first:mt-0">
              mod-{mod} · {projs.length}
            </div>
            {projs.map((p) => (
              <ProjectCard key={p.id} presence={presences[p.id]} onClick={() => setSelectedId(p.id)} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function ProjectCard({ presence, onClick }: { presence: ProjectPresence; onClick: () => void }) {
  const { project, next } = presence;
  const moduleColor = project.module ? MODULE_COLORS[project.module] : 'var(--color-mod-bridge)';
  const geometry = STAGE_GEOMETRIES[project.genesis_stage] ?? '·';
  const statusBg = project.status === 'active' ? 'bg-success-bg text-success-text' : 'bg-surface text-text-muted';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-[14px] p-4 mb-2 relative overflow-hidden hover:bg-surface transition-colors"
      style={{ borderLeftWidth: '3px', borderLeftColor: moduleColor }}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[15px] font-medium">{project.title}</span>
        <span className={`text-[10px] px-2 py-px rounded-lg font-medium ${statusBg}`}>
          {project.status === 'active' ? 'vivo' : project.status === 'completed' ? 'selado ○' : project.status}
        </span>
      </div>
      <div className="text-[11px] text-text-muted">
        {geometry} {presenceLine(presence)}
      </div>
      {next && (
        <div className="text-[11px] text-text-muted mt-1 truncate">
          <span className="text-accent">→</span> {next.title}
        </div>
      )}
    </button>
  );
}

function ProjectDetail({ presence, onBack }: { presence: ProjectPresence; onBack: () => void }) {
  const { selectItem } = useNav();
  const { project, children, next } = presence;
  const geometry = STAGE_GEOMETRIES[project.genesis_stage] ?? '·';
  const statusBg = project.status === 'active' ? 'bg-success-bg text-success-text' : 'bg-surface text-text-muted';

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-5 pb-4">
      <button onClick={onBack} className="text-[13px] text-accent pt-4 pb-2">← projects</button>
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-medium tracking-tight mb-1.5">{project.title}</h1>
        <button onClick={() => selectItem(project.id)} className="text-xs text-accent">editar</button>
      </div>
      <div className="text-[13px] text-text-muted mb-2 flex items-center gap-2">
        <span className={`text-[10px] px-2 py-px rounded-lg font-medium ${statusBg}`}>{project.status === 'active' ? 'vivo' : project.status}</span>
        mod-{project.module} · {geometry} stage {project.genesis_stage}
      </div>

      {/* Presença — estado, não métrica */}
      <p className="text-[13px] text-text mb-1.5">{presenceLine(presence)}</p>

      {project.notes && (
        <p className="text-xs text-text-muted mb-4">{project.notes}</p>
      )}

      {/* Items — filhos por belongs_to (a única verdade) */}
      <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-4">items · {children.length}</div>
      {children.length === 0 ? (
        <p className="text-xs text-text-muted py-4 text-center">
          um projeto sem items é vazio — conecte algo a ele (belongs_to)
        </p>
      ) : (
        children.map((item) => {
          const geo = STAGE_GEOMETRIES[item.genesis_stage] ?? '·';
          const stageColor = STAGE_COLORS[item.genesis_stage] ?? 'var(--color-stage-1)';
          const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';
          const isNext = next?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => selectItem(item.id)}
              className={`bg-card border rounded-lg p-2.5 px-3 mb-1.5 flex items-center gap-2.5 text-[13px] cursor-pointer transition-colors ${
                isNext ? 'border-accent/40' : 'border-border hover:border-accent-light/30'
              }`}
            >
              <span style={{ color: stageColor }}>{geo}</span>
              <span className={`flex-1 truncate ${item.status === 'completed' ? 'text-text-muted line-through decoration-border' : ''}`}>
                {item.title}
              </span>
              {isNext && <span className="text-[10px] text-accent shrink-0">→ próximo</span>}
              {item.type && (
                <span className="text-[9px] font-medium px-1.5 py-px rounded-md" style={{ background: `${typeColor}18`, color: typeColor }}>
                  {item.type}
                </span>
              )}
            </div>
          );
        })
      )}
    </motion.div>
  );
}
