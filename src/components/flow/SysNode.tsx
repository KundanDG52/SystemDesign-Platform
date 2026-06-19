import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Monitor, Network, Server, Database, Box, Layers, Cloud, Globe, GitBranch } from 'lucide-react'

export const NODE_KINDS: Record<string, { icon: any; color: string; label: string }> = {
  client:  { icon: Monitor,   color: '#22d3ee', label: 'Client' },
  lb:      { icon: Network,   color: '#10b981', label: 'Load Balancer' },
  gateway: { icon: GitBranch, color: '#10b981', label: 'API Gateway' },
  service: { icon: Box,       color: '#8b5cf6', label: 'Service' },
  cache:   { icon: Layers,    color: '#f59e0b', label: 'Cache' },
  db:      { icon: Database,  color: '#f43f5e', label: 'Database' },
  queue:   { icon: Server,    color: '#8b5cf6', label: 'Queue' },
  cdn:     { icon: Cloud,     color: '#22d3ee', label: 'CDN' },
  origin:  { icon: Globe,     color: '#64748b', label: 'Origin' },
}

export const SysNode = memo(function SysNode({ data }: { data: { label: string; sub?: string; kind: string } }) {
  const k = NODE_KINDS[data.kind] ?? NODE_KINDS.service
  const Icon = k.icon
  return (
    <div className="rounded-lg border px-3 py-2 min-w-[120px]" style={{ background: `${k.color}12`, borderColor: `${k.color}55`, boxShadow: `0 0 14px ${k.color}20` }}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <Icon size={15} style={{ color: k.color }} />
        <div>
          <div className="text-xs font-bold text-white leading-tight">{data.label}</div>
          {data.sub && <div className="text-[9px] text-white/45 leading-tight">{data.sub}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
})

export const nodeTypes = { sys: SysNode }
