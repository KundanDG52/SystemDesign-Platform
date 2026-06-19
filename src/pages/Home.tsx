import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Flame, Trophy, Crown, Clock, ChevronRight } from 'lucide-react'
import { SECTIONS, LEADERBOARD, getLevelFromXP, getXPToNextLevel, LEVEL_TITLES } from '../utils/constants'
import { useStore } from '../store'
import { Badge, Ring, Stars } from '../components/shared/Bits'

function Hero() {
  return (
    <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden topo-grid">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-7">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chip" style={{ borderColor: '#22d3ee40', color: '#22d3ee' }}>// scale to a billion users</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black leading-tight">
          Design systems<br /><span className="text-cyan">that scale</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/50 max-w-2xl leading-relaxed">
          Load balancers, caches, queues, sharding, CAP trade-offs and real architectures — Twitter, Uber, Netflix — as interactive diagrams. Plus a drag-and-drop canvas, capacity calculator, and 45-minute interview mode.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex flex-wrap gap-3 justify-center">
          <Link to="/fundamentals" className="btn-cyan flex items-center gap-2 font-bold">Start learning <ArrowRight size={16} /></Link>
          <Link to="/canvas" className="btn-ghost">Open canvas</Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-8 pt-3">
          {[['7', 'sections'], ['6', 'case studies'], ['∞', 'QPS'], ['45m', 'interview sim']].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center"><span className="text-2xl font-black text-cyan stat-num">{v}</span><span className="text-xs text-white/40">{l}</span></div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Stats() {
  const { xp, streak, achievements, visited } = useStore()
  const level = getLevelFromXP(xp)
  const { current, needed, percent } = getXPToNextLevel(xp)
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  return (
    <section className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="panel rounded-lg p-5 md:col-span-2 flex items-center gap-6">
        <Ring percent={percent} size={72} stroke={6} color="#22d3ee" label={title} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 text-sm"><span className="font-bold text-cyan">{title} Engineer</span><span className="flex items-center gap-1 text-cyan"><Zap size={13} /> {xp.toLocaleString()} XP</span></div>
          <div className="h-2.5 bg-white/8 rounded-full overflow-hidden border border-cyan/20"><motion.div className="h-full bg-cyan" style={{ boxShadow: '0 0 8px #22d3ee' }} initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1.2, delay: 0.3 }} /></div>
          <div className="flex justify-between mt-1.5 text-xs text-white/30"><span>{current} XP · {visited.length}/{SECTIONS.length} sections</span><span>{needed} to next rank</span></div>
        </div>
      </div>
      <div className="panel rounded-lg p-5 flex flex-col justify-around">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg flex items-center justify-center border border-amber/30 bg-amber/10"><Flame size={18} className="text-amber" /></div><div><div className="text-2xl font-black text-amber stat-num">{streak}</div><div className="text-xs text-white/40">day streak</div></div></div>
        <div className="flex items-center gap-3 mt-2"><div className="w-10 h-10 rounded-lg flex items-center justify-center border border-violet/30 bg-violet/10"><Trophy size={18} className="text-violet" /></div><div><div className="text-2xl font-black text-violet stat-num">{achievements.filter(a => a.earned).length}</div><div className="text-xs text-white/40">badges</div></div></div>
      </div>
      <div className="panel rounded-lg p-5 md:col-span-3">
        <h3 className="annotation mb-4">// achievements</h3>
        <div className="flex flex-wrap gap-4">{achievements.map(a => <Badge key={a.id} {...a} />)}</div>
      </div>
    </section>
  )
}

function Grid() {
  const visited = useStore(s => s.visited)
  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-xl font-bold mb-6">Curriculum</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s, i) => {
          const done = visited.includes(s.id)
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={s.path} className="adr rounded-lg p-5 block hover:-translate-y-1 transition-transform group h-full" style={{ borderLeftColor: s.color }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl font-bold" style={{ background: `${s.color}15`, border: `1px solid ${s.color}40`, color: s.color }}>{s.icon}</div>
                  {done ? <span className="chip text-emerald" style={{ borderColor: '#10b98140' }}>✓ visited</span> : <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />}
                </div>
                <h3 className="font-bold text-base" style={{ color: done ? s.color : 'white' }}>{s.name}</h3>
                <p className="text-xs text-white/40 mt-1 mb-3 leading-relaxed">{s.description}</p>
                <div className="flex items-center justify-between"><Stars n={s.difficulty} color={s.color} /><span className="flex items-center gap-1 text-xs text-white/30"><Clock size={10} /> {s.estimatedMinutes}min</span></div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function Leaderboard() {
  const { xp, level } = useStore()
  const all = [...LEADERBOARD, { name: 'you', xp, level, avatar: '◆', color: '#22d3ee' }].sort((a, b) => b.xp - a.xp).slice(0, 5)
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="panel rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4"><Crown size={14} className="text-amber" /><span className="annotation">// leaderboard</span></div>
        <div className="flex flex-col gap-2">
          {all.map((p, i) => {
            const me = p.name === 'you'
            return <div key={p.name} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: me ? `${p.color}12` : 'rgba(255,255,255,0.02)', border: me ? `1px solid ${p.color}30` : '1px solid transparent' }}>
              <span className="w-5 text-center text-xs font-bold text-white/40">{i + 1}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: `${p.color}20`, color: p.color }}>{p.avatar}</div>
              <span className="flex-1 text-sm font-medium truncate" style={{ color: me ? p.color : 'white' }}>{p.name}</span>
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: p.color }}><Zap size={10} /> {p.xp.toLocaleString()}</span>
            </div>
          })}
        </div>
      </div>
    </section>
  )
}

export function Home() { return <div><Hero /><Stats /><Grid /><Leaderboard /></div> }
