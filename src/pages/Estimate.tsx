import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, HardDrive, Wifi, Server } from 'lucide-react'
import { estimate, fmt, fmtStorage, ESTIMATE_TEMPLATES } from '../utils/estimate'
import type { EstimateInput } from '../types'
import { ADR } from '../components/shared/Bits'
import { useStore } from '../store'

const FIELDS: { key: keyof EstimateInput; label: string; min: number; max: number; step: number }[] = [
  { key: 'dau', label: 'Daily Active Users', min: 1000, max: 2_000_000_000, step: 1000 },
  { key: 'requestsPerUserPerDay', label: 'Requests / user / day', min: 1, max: 200, step: 1 },
  { key: 'bytesPerRequest', label: 'Bytes / request', min: 50, max: 5_000_000, step: 50 },
  { key: 'readWriteRatio', label: 'Read:Write ratio', min: 1, max: 500, step: 1 },
  { key: 'replicationFactor', label: 'Replication factor', min: 1, max: 6, step: 1 },
  { key: 'retentionYears', label: 'Retention (years)', min: 1, max: 10, step: 1 },
]

export function Estimate() {
  const { visitSection, addXP, checkAchievement } = useStore()
  const [input, setInput] = useState<EstimateInput>(ESTIMATE_TEMPLATES.Twitter)
  const [runs, setRuns] = useState(0)
  useEffect(() => { visitSection('estimate') }, [])
  const out = estimate(input)
  function set(k: keyof EstimateInput, v: number) { setInput(p => ({ ...p, [k]: v })) }
  function loadTemplate(name: string) { setInput(ESTIMATE_TEMPLATES[name]); const r = runs + 1; setRuns(r); addXP(5); if (r >= 3) checkAchievement('scale_master') }

  const cards = [
    { icon: Zap, label: 'Peak QPS', value: fmt(out.peakQps), sub: `avg ${fmt(out.avgQps)} · ${fmt(out.readQps)} read / ${fmt(out.writeQps)} write`, c: '#22d3ee' },
    { icon: HardDrive, label: 'Total Storage', value: fmtStorage(out.totalStorageGB), sub: `${fmtStorage(out.storagePerYearGB)}/yr × ${input.retentionYears}y × ${input.replicationFactor}×`, c: '#f59e0b' },
    { icon: Wifi, label: 'Peak Bandwidth', value: out.bandwidthMbps >= 1000 ? (out.bandwidthMbps / 1000).toFixed(1) + ' Gbps' : out.bandwidthMbps + ' Mbps', sub: 'at peak throughput', c: '#10b981' },
    { icon: Server, label: 'App Servers', value: String(out.serverCount), sub: '@ ~1K QPS/server', c: '#8b5cf6' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-5">
      <div><h1 className="text-2xl font-black text-cyan">Estimation Calculator</h1><p className="text-white/40 text-sm mt-1">Back-of-the-envelope capacity planning.</p></div>
      <div className="flex gap-2 flex-wrap"><span className="text-xs text-white/40 self-center">templates:</span>{Object.keys(ESTIMATE_TEMPLATES).map(t => <button key={t} onClick={() => loadTemplate(t)} className="btn-ghost text-xs">{t}</button>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ADR accent="cyan" className="p-5 flex flex-col gap-4">
          <div className="annotation">inputs</div>
          {FIELDS.map(f => (
            <div key={f.key}>
              <div className="flex justify-between text-xs mb-1"><span className="text-white/55">{f.label}</span><span className="font-mono text-cyan">{f.key === 'dau' ? fmt(input[f.key]) : input[f.key].toLocaleString()}{f.key === 'readWriteRatio' ? ':1' : ''}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={input[f.key]} onChange={e => set(f.key, +e.target.value)} className="w-full" style={{ accentColor: '#22d3ee' }} />
            </div>
          ))}
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-white/55">Peak factor</span><span className="font-mono text-cyan">{input.peakFactor}×</span></div>
            <input type="range" min={1} max={6} step={0.5} value={input.peakFactor} onChange={e => set('peakFactor', +e.target.value)} className="w-full" style={{ accentColor: '#22d3ee' }} />
          </div>
        </ADR>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {cards.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="panel rounded-lg p-4" style={{ borderColor: `${c.c}30` }}>
              <c.icon size={18} style={{ color: c.c }} />
              <motion.div key={c.value} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="text-2xl font-black mt-2 stat-num" style={{ color: c.c }}>{c.value}</motion.div>
              <div className="text-xs text-white/50 mt-0.5">{c.label}</div>
              <div className="text-[10px] text-white/30 mt-1 font-mono leading-tight">{c.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <ADR accent="emerald" className="p-4">
        <div className="annotation mb-1">how it's computed</div>
        <code className="text-xs text-white/60 font-mono block leading-relaxed">
          avgQPS = DAU × req/day ÷ 86,400 = {fmt(out.avgQps)} · peakQPS = avg × {input.peakFactor} = {fmt(out.peakQps)}<br/>
          storage = writes/day × bytes × 365 × years × replication = {fmtStorage(out.totalStorageGB)}<br/>
          servers = ⌈peakQPS ÷ 1000⌉ = {out.serverCount}
        </code>
      </ADR>
    </div>
  )
}
