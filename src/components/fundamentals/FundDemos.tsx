import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server } from 'lucide-react'
import { LATENCY_NUMBERS } from '../../utils/constants'

// ─── Vertical vs Horizontal scaling ──────────────────────────────────────────
export function ScalingDemo() {
  const [mode, setMode] = useState<'vertical' | 'horizontal'>('horizontal')
  const [power, setPower] = useState(2) // vertical size OR horizontal count
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(['vertical', 'horizontal'] as const).map(m => <button key={m} onClick={() => { setMode(m); setPower(2) }} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize" style={{ background: mode === m ? '#22d3ee20' : 'rgba(255,255,255,0.04)', border: mode === m ? '1px solid #22d3ee50' : '1px solid transparent', color: mode === m ? '#22d3ee' : '#64748b' }}>{m} scaling</button>)}
      </div>
      <div className="flex items-end justify-center gap-3 min-h-[120px] py-2">
        {mode === 'vertical' ? (
          <motion.div animate={{ width: 40 + power * 22, height: 40 + power * 22 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} className="rounded-lg flex items-center justify-center bg-cyan/15 border-2 border-cyan" style={{ boxShadow: '0 0 20px #22d3ee40' }}>
            <Server size={20 + power * 4} className="text-cyan" />
          </motion.div>
        ) : (
          <AnimatePresence>
            {Array.from({ length: power }).map((_, i) => (
              <motion.div key={i} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }} className="w-12 h-14 rounded-lg flex items-center justify-center bg-emerald/15 border-2 border-emerald" style={{ boxShadow: '0 0 14px #10b98130' }}>
                <Server size={18} className="text-emerald" />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <input type="range" min={1} max={mode === 'vertical' ? 5 : 8} value={power} onChange={e => setPower(+e.target.value)} className="w-full" style={{ accentColor: mode === 'vertical' ? '#22d3ee' : '#10b981' }} />
      <div className="text-xs text-white/50 text-center">
        {mode === 'vertical'
          ? <>Add CPU/RAM to <span className="text-cyan">one bigger box</span>. Simple, but a hard ceiling + single point of failure.</>
          : <><span className="text-emerald">{power} servers</span> behind a load balancer. Near-linear scale & redundancy, but needs statelessness + coordination.</>}
      </div>
    </div>
  )
}

// ─── Latency numbers ─────────────────────────────────────────────────────────
export function LatencyTable() {
  const max = Math.log10(LATENCY_NUMBERS[LATENCY_NUMBERS.length - 1]!.ns)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="annotation mb-1">latency numbers every engineer should know</div>
      {LATENCY_NUMBERS.map((l, i) => {
        const w = (Math.log10(l.ns) / max) * 100
        const color = l.ns < 1000 ? '#10b981' : l.ns < 1e6 ? '#22d3ee' : l.ns < 1e7 ? '#f59e0b' : '#f43f5e'
        return (
          <motion.div key={l.op} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }} className="flex items-center gap-2 text-xs">
            <span className="w-44 text-white/55 truncate">{l.op}</span>
            <div className="flex-1 h-3 rounded bg-white/5 overflow-hidden"><motion.div className="h-full rounded" initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} style={{ background: color }} /></div>
            <span className="w-16 text-right font-mono" style={{ color }}>{l.human}</span>
          </motion.div>
        )
      })}
      <p className="text-xs text-white/40 mt-2">Log scale. Memory is ~100× faster than SSD, which is ~1000× faster than a cross-continent round trip.</p>
    </div>
  )
}

// ─── CAP triangle ────────────────────────────────────────────────────────────
const CAP = { C: 'Consistency', A: 'Availability', P: 'Partition tolerance' }
const PAIRS: Record<string, { dbs: string; note: string }> = {
  CA: { dbs: 'MySQL, PostgreSQL (single node)', note: 'Consistent + available — but cannot survive a network partition. Only viable single-node / same-rack.' },
  CP: { dbs: 'HBase, MongoDB, Redis, Zookeeper', note: 'On partition, reject requests to stay consistent — sacrifices availability.' },
  AP: { dbs: 'Cassandra, DynamoDB, CouchDB', note: 'On partition, keep serving (possibly stale) data — eventual consistency.' },
}
export function CAPTriangle() {
  const [picked, setPicked] = useState<string[]>(['C', 'P'])
  const [partition, setPartition] = useState(false)
  function toggle(k: string) { setPicked(p => p.includes(k) ? p.filter(x => x !== k) : p.length >= 2 ? [p[1], k] : [...p, k]) }
  const key = ['C', 'A', 'P'].filter(k => picked.includes(k)).join('')
  const res = PAIRS[key]
  const pos: Record<string, { x: number; y: number; c: string }> = { C: { x: 130, y: 34, c: '#22d3ee' }, A: { x: 34, y: 188, c: '#10b981' }, P: { x: 226, y: 188, c: '#8b5cf6' } }
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 260 220" className="w-60">
        <polygon points="130,34 34,188 226,188" fill="none" stroke="#1c2740" strokeWidth="1.5" />
        {picked.length === 2 && <motion.line initial={{ opacity: 0 }} animate={{ opacity: 1 }} x1={pos[picked[0]].x} y1={pos[picked[0]].y} x2={pos[picked[1]].x} y2={pos[picked[1]].y} stroke="#22d3ee" strokeWidth="2" strokeDasharray="4" />}
        {Object.entries(pos).map(([k, p]) => {
          const on = picked.includes(k)
          return <g key={k} onClick={() => toggle(k)} style={{ cursor: 'pointer' }}>
            <circle cx={p.x} cy={p.y} r="26" fill={on ? `${p.c}25` : '#0c121e'} stroke={on ? p.c : '#334155'} strokeWidth="2" style={{ filter: on ? `drop-shadow(0 0 6px ${p.c})` : 'none' }} />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="bold" fill={on ? p.c : '#475569'} fontFamily="JetBrains Mono">{k}</text>
          </g>
        })}
      </svg>
      <div className="text-xs text-white/40 text-center">{picked.map(k => CAP[k as keyof typeof CAP]).join(' + ')}</div>
      <AnimatePresence mode="wait">
        {res && <motion.div key={key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="panel rounded-lg p-3 text-center w-full">
          <span className="font-bold font-mono text-cyan">{key}</span>
          <div className="text-xs text-white/50 mt-1">{res.note}</div>
          <div className="text-[11px] text-emerald mt-1 font-mono">{res.dbs}</div>
        </motion.div>}
      </AnimatePresence>
      <button onClick={() => setPartition(p => !p)} className="btn-ghost text-xs">{partition ? '🔌 partition active — ' : 'simulate network partition'}{partition && (key.includes('A') ? 'serving (maybe stale)' : 'rejecting writes')}</button>
      <p className="text-[11px] text-white/35 text-center">During a partition (P) you must choose: stay <span className="text-cyan">Consistent</span> (reject) or <span className="text-emerald">Available</span> (serve stale). You can't have both.</p>
    </div>
  )
}
