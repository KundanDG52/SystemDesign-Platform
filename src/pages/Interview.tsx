import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react'
import { ADR } from '../components/shared/Bits'
import { useStore } from '../store'

const RESHADED = [
  { l: 'R', t: 'Requirements', d: 'Clarify functional & non-functional requirements. What\'s in/out of scope?' },
  { l: 'E', t: 'Estimation', d: 'Back-of-envelope: DAU, QPS, storage, bandwidth. Sets the scale.' },
  { l: 'S', t: 'Storage / Data model', d: 'Entities, schema, SQL vs NoSQL, access patterns.' },
  { l: 'H', t: 'High-level design', d: 'Boxes & arrows: clients, LB, services, DB, cache, queue.' },
  { l: 'A', t: 'API design', d: 'Key endpoints, request/response, sync vs async.' },
  { l: 'D', t: 'Detailed design', d: 'Deep-dive 1–2 components: sharding, caching, fan-out, indexing.' },
  { l: 'E', t: 'Evaluate', d: 'Bottlenecks, single points of failure, trade-offs, how it scales.' },
  { l: 'D', t: 'Distinctive points', d: 'Edge cases, monitoring, security — what sets your answer apart.' },
]

const QUESTIONS = [
  'Design Twitter / X', 'Design a URL shortener', 'Design YouTube', 'Design WhatsApp', 'Design Uber',
  'Design Netflix', 'Design Instagram', 'Design a rate limiter', 'Design a web crawler', 'Design Dropbox',
  'Design a notification system', 'Design Google Docs (collab)', 'Design a key-value store', 'Design Ticketmaster',
  'Design an ad click aggregator', 'Design a distributed cache', 'Design Yelp / proximity search', 'Design a payment system',
  'Design a news feed', 'Design a chat system', 'Design an API rate limiter', 'Design a leaderboard',
  'Design a job scheduler', 'Design a logging/metrics pipeline',
]

const CHECKLIST = [
  'Clarified functional requirements', 'Stated non-functional requirements (latency, availability)', 'Did capacity estimation (QPS, storage)',
  'Defined the data model / schema', 'Drew a clear high-level diagram', 'Specified key APIs', 'Identified the read/write ratio',
  'Added caching where it helps', 'Addressed scaling (sharding/replication)', 'Handled a single point of failure',
  'Discussed consistency vs availability trade-offs', 'Called out bottlenecks & next steps',
]

function Timer() {
  const [sec, setSec] = useState(45 * 60)
  const [running, setRunning] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  const { checkAchievement } = useStore()
  useEffect(() => {
    if (running) ref.current = setInterval(() => setSec(s => { if (s <= 1) { setRunning(false); checkAchievement('interviewer'); return 0 } return s - 1 }), 1000)
    else if (ref.current) clearInterval(ref.current)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running])
  const mm = String(Math.floor(sec / 60)).padStart(2, '0'), ss = String(sec % 60).padStart(2, '0')
  const pct = (sec / (45 * 60)) * 100
  const color = sec < 300 ? '#f43f5e' : sec < 900 ? '#f59e0b' : '#10b981'
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-5xl font-black font-mono" style={{ color }}>{mm}:{ss}</div>
      <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden"><motion.div className="h-full" animate={{ width: `${pct}%`, background: color }} /></div>
      <div className="flex gap-2 mt-1">
        <button onClick={() => setRunning(r => !r)} className="btn-cyan text-xs flex items-center gap-1.5">{running ? <Pause size={13} /> : <Play size={13} />}{running ? 'pause' : 'start'}</button>
        <button onClick={() => { setSec(45 * 60); setRunning(false) }} className="btn-ghost text-xs"><RotateCcw size={13} /></button>
      </div>
    </div>
  )
}

export function Interview() {
  const visitSection = useStore(s => s.visitSection)
  const [open, setOpen] = useState(0)
  const [checked, setChecked] = useState<boolean[]>(Array(CHECKLIST.length).fill(false))
  useEffect(() => { visitSection('interview') }, [])
  const score = checked.filter(Boolean).length
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-5">
      <div><h1 className="text-2xl font-black text-violet">Interview Prep</h1><p className="text-white/40 text-sm mt-1">Framework, timer & checklist for the 45-minute system design round.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ADR accent="violet" className="p-5">
          <div className="annotation mb-3">the RESHADED framework</div>
          <div className="flex flex-col gap-1.5">
            {RESHADED.map((s, i) => (
              <div key={i}>
                <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                  <span className="w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-sm" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>{s.l}</span>
                  <span className="text-sm font-semibold text-white">{s.t}</span>
                  <ChevronDown size={14} className={`ml-auto text-white/30 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-white/50 px-3 pb-2 pl-13 ml-10">{s.d}</motion.p>}
              </div>
            ))}
          </div>
        </ADR>
        <div className="flex flex-col gap-5">
          <ADR accent="cyan" className="p-5"><div className="annotation mb-3 text-center">45-minute simulation</div><Timer /></ADR>
          <ADR accent="emerald" className="p-5">
            <div className="flex items-center justify-between mb-3"><span className="annotation">peer-review checklist</span><span className="text-xs font-mono" style={{ color: score >= 10 ? '#10b981' : score >= 6 ? '#f59e0b' : '#f43f5e' }}>{score}/12</span></div>
            <div className="flex flex-col gap-1">
              {CHECKLIST.map((c, i) => (
                <button key={i} onClick={() => setChecked(ch => ch.map((v, j) => j === i ? !v : v))} className="flex items-center gap-2 text-left text-xs py-0.5">
                  <span className="w-4 h-4 rounded border flex items-center justify-center text-[9px]" style={{ borderColor: checked[i] ? '#10b981' : '#334155', background: checked[i] ? '#10b98120' : 'transparent', color: '#10b981' }}>{checked[i] && '✓'}</span>
                  <span className={checked[i] ? 'text-white/40 line-through' : 'text-white/65'}>{c}</span>
                </button>
              ))}
            </div>
          </ADR>
        </div>
      </div>
      <ADR accent="amber" className="p-5">
        <div className="annotation mb-3">question bank · {QUESTIONS.length} of 50</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {QUESTIONS.map((q, i) => <div key={i} className="panel rounded-lg px-3 py-2 text-xs text-white/65 hover:text-cyan hover:border-cyan/40 transition-all cursor-default">{q}</div>)}
        </div>
      </ADR>
    </div>
  )
}
