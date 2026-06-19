import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Circuit breaker ─────────────────────────────────────────────────────────
type CB = 'closed' | 'open' | 'half'
const CB_COLOR: Record<CB, string> = { closed: '#10b981', open: '#f43f5e', half: '#f59e0b' }
export function CircuitBreakerDemo() {
  const [state, setState] = useState<CB>('closed')
  const [fails, setFails] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const THRESHOLD = 3
  function call(ok: boolean) {
    if (state === 'open') { setLog(l => ['⚡ rejected fast (circuit OPEN)', ...l].slice(0, 5)); return }
    if (ok) {
      setFails(0)
      if (state === 'half') { setState('closed'); setLog(l => ['✓ success → circuit CLOSED', ...l].slice(0, 5)) }
      else setLog(l => ['✓ success', ...l].slice(0, 5))
    } else {
      const f = fails + 1; setFails(f)
      if (state === 'half') { setState('open'); trip(); setLog(l => ['✗ fail in half-open → OPEN', ...l].slice(0, 5)) }
      else if (f >= THRESHOLD) { setState('open'); trip(); setLog(l => [`✗ ${f} fails → tripped OPEN`, ...l].slice(0, 5)) }
      else setLog(l => [`✗ fail (${f}/${THRESHOLD})`, ...l].slice(0, 5))
    }
  }
  function trip() { setTimeout(() => { setState('half'); setLog(l => ['⏱ timeout → HALF-OPEN (probe)', ...l].slice(0, 5)) }, 2500) }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-2">
        {(['closed', 'open', 'half'] as CB[]).map(s => (
          <div key={s} className="px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all" style={{ background: state === s ? `${CB_COLOR[s]}22` : 'rgba(255,255,255,0.03)', border: `1px solid ${state === s ? CB_COLOR[s] : '#1c2740'}`, color: state === s ? CB_COLOR[s] : '#475569', boxShadow: state === s ? `0 0 14px ${CB_COLOR[s]}40` : 'none' }}>{s === 'half' ? 'half-open' : s}</div>
        ))}
      </div>
      <div className="flex gap-2 justify-center"><button onClick={() => call(true)} className="btn-emerald text-xs">✓ success</button><button onClick={() => call(false)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#f43f5e', color: '#fff' }}>✗ failure</button></div>
      <div className="flex flex-col gap-0.5 min-h-[80px]">{log.map((l, i) => <motion.span key={`${l}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-mono text-white/50">{l}</motion.span>)}</div>
      <p className="text-xs text-white/40">After {THRESHOLD} failures the breaker trips OPEN (fails fast). After a timeout it goes HALF-OPEN to probe; one success closes it, one failure re-opens.</p>
    </div>
  )
}

// ─── Token bucket rate limiter ───────────────────────────────────────────────
export function RateLimiterDemo() {
  const CAP = 10
  const [tokens, setTokens] = useState(CAP)
  const [log, setLog] = useState<{ ok: boolean; t: number }[]>([])
  useEffect(() => { const id = setInterval(() => setTokens(t => Math.min(CAP, t + 1)), 800); return () => clearInterval(id) }, [])
  function request() { setTokens(t => { const ok = t >= 1; setLog(l => [{ ok, t: Date.now() }, ...l].slice(0, 8)); return ok ? t - 1 : t }) }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">{Array.from({ length: CAP }).map((_, i) => <motion.div key={i} animate={{ background: i < tokens ? '#22d3ee' : '#1c2740', scale: i < tokens ? 1 : 0.85 }} className="flex-1 h-6 rounded" style={{ boxShadow: i < tokens ? '0 0 6px #22d3ee60' : 'none' }} />)}</div>
      <div className="text-xs text-white/40 text-center font-mono">{tokens}/{CAP} tokens · refills +1 / 0.8s</div>
      <button onClick={request} className="btn-cyan text-xs self-center">make request (−1 token)</button>
      <div className="flex gap-1 justify-center flex-wrap min-h-[20px]">{log.map((l, i) => <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: l.ok ? '#10b98120' : '#f43f5e20', color: l.ok ? '#10b981' : '#f43f5e' }}>{l.ok ? '200' : '429'}</span>)}</div>
      <p className="text-xs text-white/40">A token bucket allows bursts up to capacity, then throttles to the refill rate. Empty bucket → HTTP 429.</p>
    </div>
  )
}

// ─── JWT lifecycle ───────────────────────────────────────────────────────────
const JWT_STEPS = [
  { from: 'Client', to: 'Auth', label: 'POST /login (credentials)', color: '#22d3ee' },
  { from: 'Auth', to: 'Client', label: 'signed JWT (header.payload.sig)', color: '#10b981' },
  { from: 'Client', to: 'API', label: 'GET /data + Bearer token', color: '#22d3ee' },
  { from: 'API', to: 'API', label: 'verify signature (no DB hit)', color: '#f59e0b' },
  { from: 'API', to: 'Client', label: '200 OK + data', color: '#10b981' },
]
export function JWTDemo() {
  const [step, setStep] = useState(-1)
  function run() { setStep(-1); let i = 0; const id = setInterval(() => { setStep(i); i++; if (i >= JWT_STEPS.length) clearInterval(id) }, 800) }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        {JWT_STEPS.map((s, i) => (
          <motion.div key={i} animate={{ opacity: step >= i ? 1 : 0.25, x: step === i ? 6 : 0 }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: step >= i ? `${s.color}12` : 'transparent', border: `1px solid ${step >= i ? s.color + '40' : '#131d31'}` }}>
            <span className="font-bold w-12" style={{ color: s.color }}>{s.from}</span><span className="text-white/30">{s.from === s.to ? '↻' : '→'}</span><span className="text-white/50 w-12">{s.to}</span><span className="ml-auto text-white/60">{s.label}</span>
          </motion.div>
        ))}
      </div>
      <button onClick={run} className="btn-cyan text-xs self-start">▶ run JWT flow</button>
      <p className="text-xs text-white/40">JWTs are <span className="text-emerald">stateless</span>: the API verifies the signature locally — no session store lookup — which is what makes them horizontally scalable.</p>
    </div>
  )
}
