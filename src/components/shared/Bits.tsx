import { motion } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

export function ADR({ children, className = '', delay = 0, color = '#22d3ee', accent = 'cyan', onClick, hover, style }: {
  children: ReactNode; className?: string; delay?: number; color?: string; accent?: 'cyan' | 'emerald' | 'violet' | 'amber'; onClick?: () => void; hover?: boolean; style?: CSSProperties
}) {
  const cls = accent === 'emerald' ? 'adr-emerald' : accent === 'violet' ? 'adr-violet' : accent === 'amber' ? 'adr-amber' : ''
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}
      whileHover={hover ? { y: -3 } : undefined} onClick={onClick}
      className={`adr ${cls} rounded-lg ${hover ? 'cursor-pointer' : ''} ${className}`} style={style}>
      {children}
    </motion.div>
  )
}

export function Badge({ icon, name, description, earned, color = '#22d3ee' }: { icon: string; name: string; description: string; earned: boolean; color?: string }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className={`flex flex-col items-center gap-2 ${!earned ? 'opacity-40 grayscale' : ''}`} title={description}>
      <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl border" style={{ background: earned ? `${color}18` : 'rgba(255,255,255,0.03)', borderColor: earned ? `${color}60` : '#1c2740', boxShadow: earned ? `0 0 16px ${color}30` : 'none' }}>{icon}</div>
      <span className="text-[10px] font-medium text-white/60 text-center leading-tight max-w-[72px]">{name}</span>
    </motion.div>
  )
}

export function Ring({ percent, size = 44, stroke = 4, color = '#22d3ee', label }: { percent: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, offset = c - (percent / 100) * c
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1c2740" strokeWidth={stroke} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1, delay: 0.2 }} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      </svg>
      {label && <span className="absolute text-[10px] font-bold font-mono" style={{ color }}>{label}</span>}
    </div>
  )
}

export function Stars({ n, color = '#22d3ee' }: { n: number; color?: string }) {
  return <div className="flex gap-0.5">{Array.from({ length: 5 }, (_, i) => <span key={i} className="text-xs" style={{ color: i < n ? color : '#1c2740' }}>▰</span>)}</div>
}
