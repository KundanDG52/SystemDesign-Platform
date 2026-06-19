import { useEffect } from 'react'
import { ADR } from '../components/shared/Bits'
import { LoadBalancerDemo, CacheLRUDemo, QueueDemo, ShardingDemo } from '../components/blocks/BlockDemos'
import { useStore } from '../store'

function Panel({ title, n, color, accent, children }: any) {
  return <ADR accent={accent} className="p-5"><div className="flex items-center gap-2 mb-3"><span className="annotation" style={{ color }}>{n}</span><h2 className="text-sm font-bold text-white">{title}</h2></div>{children}</ADR>
}

export function BuildingBlocks() {
  const { visitSection, checkAchievement } = useStore()
  useEffect(() => { visitSection('blocks'); checkAchievement('queue_whisperer') }, [])
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-5">
      <div><h1 className="text-2xl font-black text-emerald">Building Blocks</h1><p className="text-white/40 text-sm mt-1">The reusable components every architecture is assembled from.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Load Balancer · round-robin + health" n="01 · traffic" color="#10b981" accent="emerald"><LoadBalancerDemo /></Panel>
        <Panel title="Caching · LRU eviction" n="02 · cache" color="#f59e0b" accent="amber"><CacheLRUDemo /></Panel>
        <Panel title="Message Queue · producer/consumer + fan-out" n="03 · async" color="#8b5cf6" accent="violet"><QueueDemo /></Panel>
        <Panel title="Database Sharding · hash partitioning" n="04 · data" color="#22d3ee" accent="cyan"><ShardingDemo /></Panel>
      </div>
      <ADR accent="emerald" className="p-5">
        <h2 className="text-sm font-bold text-white mb-3">Cache write strategies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { t: 'Write-through', d: 'Write to cache + DB synchronously. Consistent, higher write latency.', c: '#22d3ee' },
            { t: 'Write-back', d: 'Write to cache, flush to DB later. Fast, risk of loss on crash.', c: '#f59e0b' },
            { t: 'Write-around', d: 'Write straight to DB, skip cache. Avoids cache churn on write-once data.', c: '#10b981' },
            { t: 'Read-through', d: 'Cache fetches from DB on miss, transparently to the app.', c: '#8b5cf6' },
          ].map(x => <div key={x.t} className="panel rounded-lg p-3" style={{ borderColor: `${x.c}25` }}><div className="font-semibold mb-1" style={{ color: x.c }}>{x.t}</div><div className="text-white/50">{x.d}</div></div>)}
        </div>
      </ADR>
    </div>
  )
}
