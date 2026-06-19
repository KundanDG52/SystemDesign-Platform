import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, X } from 'lucide-react'
import { LRU } from '../../utils/estimate'

// ─── Load balancer (round robin + health) ────────────────────────────────────
export function LoadBalancerDemo() {
  const [servers, setServers] = useState([{ id: 0, up: true, hits: 0 }, { id: 1, up: true, hits: 0 }, { id: 2, up: true, hits: 0 }])
  const [active, setActive] = useState(-1)
  const rr = useRef(0)
  function send() {
    const up = servers.filter(s => s.up)
    if (!up.length) return
    let target = rr.current % servers.length
    let guard = 0
    while (!servers[target].up && guard++ < servers.length) { rr.current++; target = rr.current % servers.length }
    rr.current++
    setActive(target)
    setServers(s => s.map(x => x.id === target ? { ...x, hits: x.hits + 1 } : x))
    setTimeout(() => setActive(-1), 350)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-6">
        <div className="w-14 h-14 rounded-lg bg-emerald/15 border-2 border-emerald flex items-center justify-center text-emerald text-xs font-bold">LB</div>
        <div className="flex gap-3">
          {servers.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <motion.div animate={{ scale: active === s.id ? 1.15 : 1, borderColor: active === s.id ? '#22d3ee' : s.up ? '#10b981' : '#f43f5e' }}
                className="relative w-12 h-14 rounded-lg flex items-center justify-center border-2 cursor-pointer" style={{ background: s.up ? '#10b98112' : '#f43f5e12' }}
                onClick={() => setServers(sv => sv.map(x => x.id === s.id ? { ...x, up: !x.up } : x))}>
                <Server size={18} style={{ color: s.up ? '#10b981' : '#f43f5e' }} />
                {!s.up && <X size={10} className="absolute top-0.5 right-0.5 text-rose" />}
              </motion.div>
              <span className="text-[9px] text-white/40 font-mono">{s.hits} reqs</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-center"><button onClick={send} className="btn-cyan text-xs">send request →</button><span className="text-xs text-white/40 self-center">click a server to toggle health</span></div>
      <p className="text-xs text-white/40 text-center">Round-robin cycles requests across healthy servers. Down servers are skipped — traffic reroutes automatically.</p>
    </div>
  )
}

// ─── LRU cache ───────────────────────────────────────────────────────────────
export function CacheLRUDemo() {
  const cacheRef = useRef(new LRU<number, number>(4))
  const [, force] = useState(0)
  const [stats, setStats] = useState({ hit: 0, miss: 0 })
  const [last, setLast] = useState<{ k: number; hit: boolean } | null>(null)
  function access(k: number) {
    const hit = cacheRef.current.get(k) !== undefined
    if (hit) setStats(s => ({ ...s, hit: s.hit + 1 }))
    else { cacheRef.current.put(k, k); setStats(s => ({ ...s, miss: s.miss + 1 })) }
    setLast({ k, hit }); force(n => n + 1)
  }
  const keys = cacheRef.current.keys() // LRU→MRU
  const total = stats.hit + stats.miss
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">{[1, 2, 3, 4, 5, 6].map(k => <button key={k} onClick={() => access(k)} className="w-9 h-9 rounded font-mono text-sm font-bold border border-cyan/30 text-cyan/70 hover:bg-cyan/10">{k}</button>)}</div>
      <div><div className="annotation mb-1">cache · LRU → MRU (cap 4)</div>
        <div className="flex gap-1.5">{Array.from({ length: 4 }).map((_, i) => { const v = keys[i]; return <motion.div key={i} layout className="w-12 h-12 rounded flex items-center justify-center font-mono font-bold border-2" style={{ borderColor: v !== undefined ? '#22d3ee60' : '#1c2740', background: v !== undefined ? '#22d3ee15' : 'transparent', color: v !== undefined ? '#22d3ee' : '#334155' }}>{v ?? '·'}</motion.div> })}</div>
      </div>
      {last && <motion.div key={`${last.k}-${total}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono" style={{ color: last.hit ? '#10b981' : '#f43f5e' }}>access({last.k}) → {last.hit ? 'HIT ⚡' : 'MISS — inserted, evicts LRU if full'}</motion.div>}
      <div className="flex gap-4 text-xs font-mono"><span className="text-emerald">hits {stats.hit}</span><span className="text-rose">miss {stats.miss}</span><span className="text-amber">rate {total ? Math.round(stats.hit / total * 100) : 0}%</span></div>
    </div>
  )
}

// ─── Message queue ───────────────────────────────────────────────────────────
export function QueueDemo() {
  const [queue, setQueue] = useState<number[]>([])
  const [fanout, setFanout] = useState(false)
  const [consumed, setConsumed] = useState<{ c: number; v: number }[]>([])
  const id = useRef(0)
  function produce() { setQueue(q => [...q, ++id.current]) }
  function consume() { setQueue(q => { if (!q.length) return q; const [head, ...rest] = q; setConsumed(c => [{ c: fanout ? -1 : (head % 2) + 1, v: head }, ...c].slice(0, 5)); return rest }) }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button onClick={produce} className="btn-cyan text-xs">producer ▸</button>
        <div className="flex-1 flex items-center gap-1 min-h-[40px] px-2 rounded-lg border border-border bg-bg/40 overflow-hidden">
          <AnimatePresence>{queue.map(m => <motion.div key={m} layout initial={{ opacity: 0, scale: 0.5, x: -10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.5, x: 10 }} className="w-7 h-7 shrink-0 rounded bg-violet/20 border border-violet/50 text-violet text-[10px] font-mono flex items-center justify-center">{m}</motion.div>)}</AnimatePresence>
          {!queue.length && <span className="text-xs text-white/25">empty queue (Kafka topic)</span>}
        </div>
        <button onClick={consume} className="btn-emerald text-xs">▸ consume</button>
      </div>
      <div className="flex items-center gap-2"><button onClick={() => setFanout(f => !f)} className="px-2.5 py-1 rounded text-xs font-semibold" style={{ background: fanout ? '#8b5cf620' : 'rgba(255,255,255,0.04)', border: fanout ? '1px solid #8b5cf650' : '1px solid transparent', color: fanout ? '#8b5cf6' : '#64748b' }}>fan-out {fanout ? 'ON' : 'OFF'}</button><span className="text-xs text-white/40">{fanout ? 'one message → all consumers' : 'one message → one consumer (competing)'}</span></div>
      <div className="text-xs font-mono text-white/50">recent: {consumed.map((c, i) => <span key={i} className="mr-2">msg{c.v}{fanout ? '→all' : `→C${c.c}`}</span>)}</div>
      <p className="text-xs text-white/40">Queues decouple producers from consumers, absorb spikes, and enable retries + fan-out.</p>
    </div>
  )
}

// ─── Sharding ────────────────────────────────────────────────────────────────
function hashKey(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
export function ShardingDemo() {
  const [key, setKey] = useState('user_42')
  const shards = 4
  const h = hashKey(key)
  const shard = h % shards
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2"><span className="text-xs text-white/40">key</span><input value={key} onChange={e => setKey(e.target.value)} className="flex-1 bg-bg border border-border rounded px-3 py-1.5 text-sm font-mono text-cyan outline-none focus:border-cyan/50" /></div>
      <div className="text-center text-xs font-mono text-white/50">hash("{key}") = {h} · {h} mod {shards} = <span className="text-cyan font-bold">{shard}</span></div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: shards }).map((_, i) => (
          <motion.div key={i} animate={{ scale: shard === i ? 1.06 : 1 }} className="rounded-lg p-3 text-center border-2" style={{ borderColor: shard === i ? '#22d3ee' : '#1c2740', background: shard === i ? '#22d3ee15' : 'transparent', boxShadow: shard === i ? '0 0 16px #22d3ee40' : 'none' }}>
            <Server size={16} className="mx-auto mb-1" style={{ color: shard === i ? '#22d3ee' : '#475569' }} />
            <div className="text-[10px] font-mono" style={{ color: shard === i ? '#22d3ee' : '#475569' }}>shard {i}</div>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-white/40">A hash of the key picks the shard, spreading data evenly. Downside: re-sharding moves keys — consistent hashing reduces churn.</p>
    </div>
  )
}
