import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserState } from '../types'
import { ACHIEVEMENTS, getLevelFromXP, SECTIONS } from '../utils/constants'

interface AppStore extends UserState {
  addXP: (n: number) => void
  visitSection: (id: string) => void
  solveQuiz: (id: string) => void
  saveDesign: () => void
  checkAchievement: (id: string) => void
  updateStreak: () => void
  reset: () => void
}

const initial: UserState = {
  xp: 0, level: 1, streak: 0, lastVisitDate: '',
  visited: [], solvedQuizzes: [], savedDesigns: 0, achievements: ACHIEVEMENTS.map(a => ({ ...a })),
}

export const useStore = create<AppStore>()(
  persist((set, get) => ({
    ...initial,
    addXP: (n) => set(s => { const xp = s.xp + n; return { xp, level: getLevelFromXP(xp) } }),
    visitSection: (id) => {
      set(s => s.visited.includes(id) ? s : { visited: [...s.visited, id], xp: s.xp + 25, level: getLevelFromXP(s.xp + 25) })
      get().checkAchievement('first_design')
      if (SECTIONS.every(sec => get().visited.includes(sec.id))) get().checkAchievement('principal')
    },
    solveQuiz: (id) => set(s => s.solvedQuizzes.includes(id) ? s : { solvedQuizzes: [...s.solvedQuizzes, id], xp: s.xp + 30, level: getLevelFromXP(s.xp + 30) }),
    saveDesign: () => { set(s => ({ savedDesigns: s.savedDesigns + 1, xp: s.xp + 40, level: getLevelFromXP(s.xp + 40) })); get().checkAchievement('architect') },
    checkAchievement: (id) => set(s => ({ achievements: s.achievements.map(a => a.id === id && !a.earned ? { ...a, earned: true } : a) })),
    updateStreak: () => {
      const today = new Date().toDateString()
      if (get().lastVisitDate === today) return
      const yest = new Date(Date.now() - 864e5).toDateString()
      const streak = get().lastVisitDate === yest ? get().streak + 1 : 1
      set({ lastVisitDate: today, streak })
    },
    reset: () => set({ ...initial }),
  }), { name: 'sysdesign-platform-v1' })
)
