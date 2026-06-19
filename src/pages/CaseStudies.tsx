import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CASE_STUDIES } from '../data/caseStudies'
import { FlowDiagram } from '../components/flow/FlowDiagram'
import { ADR } from '../components/shared/Bits'
import { useStore } from '../store'

export function CaseStudies() {
  const { visitSection } = useStore()
  const [sel, setSel] = useState(0)
  useEffect(() => { visitSection('cases') }, [])
  const cs = CASE_STUDIES[sel]
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-5">
      <div><h1 className="text-2xl font-black text-amber">Case Studies</h1><p className="text-white/40 text-sm mt-1">Real architectures as interactive diagrams — drag to pan, scroll to zoom.</p></div>
      <div className="flex gap-2 flex-wrap">
        {CASE_STUDIES.map((c, i) => <button key={c.id} onClick={() => setSel(i)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ background: sel === i ? '#f59e0b20' : 'rgba(255,255,255,0.04)', border: sel === i ? '1px solid #f59e0b50' : '1px solid transparent', color: sel === i ? '#f59e0b' : '#64748b' }}>{c.icon} {c.name}</button>)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={cs.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
          <ADR accent="amber" className="p-4">
            <div className="flex items-center gap-2 mb-1"><span className="text-xl">{cs.icon}</span><h2 className="text-lg font-bold text-white">Design {cs.name}</h2><span className="text-xs text-white/40 ml-2">{cs.tagline}</span></div>
            <p className="text-sm text-white/60 leading-relaxed">{cs.challenge}</p>
          </ADR>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {cs.numbers.map(n => <div key={n.label} className="panel rounded-lg p-3 text-center"><div className="text-lg font-black text-cyan stat-num">{n.value}</div><div className="text-[10px] text-white/40 uppercase tracking-wide">{n.label}</div></div>)}
          </div>
          <FlowDiagram study={cs} height={380} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cs.decisions.map((d, i) => (
              <ADR key={i} accent="cyan" delay={i * 0.05} className="p-4">
                <div className="annotation mb-1">ADR · decision {i + 1}</div>
                <h3 className="text-sm font-bold text-cyan mb-1">{d.title}</h3>
                <p className="text-xs text-white/55 leading-relaxed">{d.body}</p>
              </ADR>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
