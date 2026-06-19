import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from './Navbar'
import { NetworkBg } from './NetworkBg'
import { useStore } from '../../store'

export function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation()
  const updateStreak = useStore(s => s.updateStreak)
  useEffect(() => { updateStreak() }, [updateStreak])
  return (
    <div className="min-h-screen flex flex-col relative">
      <NetworkBg />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main key={loc.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="flex-1 pt-14">
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
