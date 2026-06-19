import { useEffect, useRef, useState, useCallback } from 'react'
import ReactFlow, {
  Background, Controls, MiniMap, BackgroundVariant, ReactFlowProvider,
  useNodesState, useEdgesState, addEdge, useReactFlow,
  type Node, type Edge, type Connection,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Download, Save, Trash2, Box } from 'lucide-react'
import { nodeTypes, NODE_KINDS } from '../components/flow/SysNode'
import { getCaseStudy } from '../data/caseStudies'
import { useStore } from '../store'

const PALETTE = ['client', 'cdn', 'lb', 'gateway', 'service', 'cache', 'db', 'queue']
let idc = 0
const nid = () => `n${++idc}`

function CanvasInner() {
  const wrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])
  const [saved, setSaved] = useState(false)
  const saveDesign = useStore(s => s.saveDesign)

  const onConnect = useCallback((c: Connection) => setEdges(e => addEdge({ ...c, animated: true, type: 'smoothstep' }, e)), [setEdges])

  function addNode(kind: string, pos?: { x: number; y: number }) {
    const k = NODE_KINDS[kind]
    setNodes(n => [...n, { id: nid(), type: 'sys', position: pos ?? { x: 120 + Math.random() * 200, y: 80 + Math.random() * 200 }, data: { label: k.label, kind } }])
  }
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const kind = e.dataTransfer.getData('application/kind'); if (!kind) return
    addNode(kind, screenToFlowPosition({ x: e.clientX, y: e.clientY }))
  }, [screenToFlowPosition])

  function loadPreset(id: string) {
    const cs = getCaseStudy(id); if (!cs) return
    setNodes(cs.nodes.map(n => ({ id: n.id, type: 'sys', position: { x: n.x, y: n.y }, data: { label: n.label, sub: n.sub, kind: n.kind } })))
    setEdges(cs.edges.map(e => ({ id: e.id, source: e.source, target: e.target, label: e.label, animated: e.animated, type: 'smoothstep' })))
  }
  function exportJSON() {
    const data = JSON.stringify({ nodes: nodes.map(n => ({ id: n.id, kind: n.data.kind, label: n.data.label, ...n.position })), edges: edges.map(e => ({ source: e.source, target: e.target })) }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'architecture.json'; a.click()
  }
  function save() { saveDesign(); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="flex flex-col gap-3">
      {/* toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="annotation">presets:</span>
        {['twitter', 'uber', 'netflix'].map(p => <button key={p} onClick={() => loadPreset(p)} className="btn-ghost text-xs capitalize">{p}</button>)}
        <div className="ml-auto flex gap-2">
          <button onClick={save} className="btn-emerald text-xs flex items-center gap-1.5"><Save size={13} /> {saved ? 'saved! +40 XP' : 'save'}</button>
          <button onClick={exportJSON} className="btn-ghost text-xs flex items-center gap-1.5"><Download size={13} /> JSON</button>
          <button onClick={() => { setNodes([]); setEdges([]) }} className="btn-ghost text-xs flex items-center gap-1.5"><Trash2 size={13} /> clear</button>
        </div>
      </div>

      <div className="flex gap-3">
        {/* palette */}
        <div className="w-36 shrink-0 panel rounded-lg p-2 flex flex-col gap-1.5">
          <div className="annotation px-1">palette</div>
          {PALETTE.map(k => {
            const meta = NODE_KINDS[k]; const Icon = meta.icon
            return (
              <div key={k} draggable onDragStart={e => e.dataTransfer.setData('application/kind', k)} onClick={() => addNode(k)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg border cursor-grab active:cursor-grabbing hover:bg-white/5 transition-all"
                style={{ borderColor: `${meta.color}30` }}>
                <Icon size={14} style={{ color: meta.color }} />
                <span className="text-[11px] text-white/70">{meta.label}</span>
              </div>
            )
          })}
          <p className="text-[9px] text-white/30 px-1 mt-1 leading-tight">drag onto canvas or click to add · drag handles to connect</p>
        </div>

        {/* canvas */}
        <div ref={wrapper} className="flex-1 rounded-lg overflow-hidden border border-border bg-bg/40" style={{ height: 520 }} onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }} onDrop={onDrop}>
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }} defaultEdgeOptions={{ type: 'smoothstep', animated: true }}>
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#1c2740" />
            <Controls showInteractive={false} />
            <MiniMap nodeColor={n => (NODE_KINDS[n.data?.kind]?.color ?? '#64748b')} maskColor="rgba(8,12,20,0.7)" pannable zoomable />
          </ReactFlow>
        </div>
      </div>
      <div className="flex gap-4 text-xs font-mono text-white/40"><span className="text-cyan">{nodes.length} components</span><span className="text-emerald">{edges.length} connections</span><span className="text-white/30">empty? load a preset or drag from the palette</span></div>
    </div>
  )
}

export function Canvas() {
  const visitSection = useStore(s => s.visitSection)
  useEffect(() => { visitSection('canvas') }, [])
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-5">
      <div><h1 className="text-2xl font-black text-emerald">Architecture Canvas</h1><p className="text-white/40 text-sm mt-1">Drag components, wire them up, export your design.</p></div>
      <ReactFlowProvider><CanvasInner /></ReactFlowProvider>
    </div>
  )
}
