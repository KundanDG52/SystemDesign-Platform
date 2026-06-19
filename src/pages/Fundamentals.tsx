import { useEffect } from 'react'
import { ADR } from '../components/shared/Bits'
import { Quiz } from '../components/shared/Quiz'
import { ScalingDemo, LatencyTable, CAPTriangle } from '../components/fundamentals/FundDemos'
import { useStore } from '../store'

function Panel({ title, n, color, accent, children }: any) {
  return <ADR accent={accent} className="p-5"><div className="flex items-center gap-2 mb-3"><span className="annotation" style={{ color }}>{n}</span><h2 className="text-sm font-bold text-white">{title}</h2></div>{children}</ADR>
}

export function Fundamentals() {
  const { visitSection, checkAchievement } = useStore()
  useEffect(() => { visitSection('fundamentals'); checkAchievement('cap_navigator') }, [])
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-5">
      <div><h1 className="text-2xl font-black text-cyan">Fundamentals</h1><p className="text-white/40 text-sm mt-1">The trade-offs underneath every system.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Vertical vs Horizontal Scaling" n="01 · scale" color="#22d3ee" accent="cyan"><ScalingDemo /></Panel>
        <Panel title="CAP Theorem" n="02 · trade-off" color="#8b5cf6" accent="violet"><CAPTriangle /></Panel>
      </div>
      <Panel title="Latency Numbers" n="03 · speed" color="#10b981" accent="emerald"><LatencyTable /></Panel>
      <ADR accent="cyan" className="p-5">
        <div className="flex items-center gap-2 mb-3"><span className="annotation">04 · check</span><h2 className="text-sm font-bold text-white">Quick check</h2></div>
        <Quiz id="fund-cap" color="#22d3ee" quiz={{ q: 'A network partition splits your cluster. Your AP database will…', options: ['Reject all requests to stay consistent', 'Keep serving, accepting possible staleness', 'Shut down entirely', 'Automatically become CP'], answer: 1, explain: 'AP systems prioritize Availability — they keep serving during partitions and reconcile later (eventual consistency).' }} />
      </ADR>
    </div>
  )
}
