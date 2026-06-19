import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useStore } from '../../store'

export interface QuizQ { q: string; options: string[]; answer: number; explain: string }

export function Quiz({ quiz, id, color = '#22d3ee' }: { quiz: QuizQ; id: string; color?: string }) {
  const { solveQuiz, solvedQuizzes } = useStore()
  const done = solvedQuizzes.includes(id)
  const [sel, setSel] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  function pick(i: number) { if (revealed) return; setSel(i); setRevealed(true); if (i === quiz.answer && !done) solveQuiz(id) }
  const correct = sel === quiz.answer
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-white/85">{quiz.q}</p>
      <div className="flex flex-col gap-1.5">
        {quiz.options.map((o, i) => {
          const isA = i === quiz.answer, isP = sel === i
          let cls = 'border-white/08 text-white/65 hover:border-cyan/40'
          if (revealed && isA) cls = 'border-emerald/50 bg-emerald/10 text-emerald'
          else if (revealed && isP && !isA) cls = 'border-rose/50 bg-rose/10 text-rose'
          return <button key={i} onClick={() => pick(i)} disabled={revealed} className={`text-left px-3 py-2 rounded-lg text-xs border transition-all flex items-center gap-2 ${cls}`}><span className="font-mono opacity-40">{String.fromCharCode(97 + i)})</span><span className="flex-1">{o}</span>{revealed && isA && <Check size={13} />}{revealed && isP && !isA && <X size={13} />}</button>
        })}
      </div>
      <AnimatePresence>
        {revealed && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
          <div className="rounded-lg p-3 text-xs leading-relaxed border" style={{ borderColor: correct ? '#10b98130' : `${color}30`, background: correct ? '#10b9810a' : `${color}0a`, color: 'rgba(255,255,255,0.6)' }}>
            <span className="font-semibold" style={{ color: correct ? '#10b981' : color }}>{correct ? '✓ +30 XP — ' : 'Answer: '}</span>{quiz.explain}
          </div>
          {!correct && <button onClick={() => { setRevealed(false); setSel(null) }} className="btn-ghost text-xs mt-2">try again</button>}
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}
