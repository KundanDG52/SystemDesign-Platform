import { useMemo } from 'react'
import ReactFlow, { Background, Controls, BackgroundVariant, type Node, type Edge } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from './SysNode'
import type { CaseStudy } from '../../types'

/** Read-only system diagram rendered from CaseStudy data. */
export function FlowDiagram({ study, height = 360 }: { study: CaseStudy; height?: number }) {
  const nodes: Node[] = useMemo(() => study.nodes.map(n => ({
    id: n.id, type: 'sys', position: { x: n.x, y: n.y }, data: { label: n.label, sub: n.sub, kind: n.kind },
  })), [study])
  const edges: Edge[] = useMemo(() => study.edges.map(e => ({
    id: e.id, source: e.source, target: e.target, label: e.label, animated: e.animated, type: 'smoothstep',
  })), [study])

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border border-border bg-bg/40">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} proOptions={{ hideAttribution: true }}
        minZoom={0.3} maxZoom={1.5}>
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1c2740" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
