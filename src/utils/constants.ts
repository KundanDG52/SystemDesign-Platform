import type { Section, Achievement } from '../types'

export const SECTIONS: Section[] = [
  { id: 'fundamentals', name: 'Fundamentals', icon: '◎', description: 'Scalability, latency, throughput & CAP theorem', path: '/fundamentals', color: '#22d3ee', difficulty: 1, estimatedMinutes: 40, topics: ['Scaling', 'Latency', 'CAP'] },
  { id: 'blocks', name: 'Building Blocks', icon: '⬢', description: 'Load balancers, caching, queues, databases', path: '/blocks', color: '#10b981', difficulty: 2, estimatedMinutes: 70, topics: ['Load Balancer', 'Cache', 'Queue', 'DB'] },
  { id: 'patterns', name: 'Design Patterns', icon: '⊞', description: 'APIs, auth, microservices, event-driven', path: '/patterns', color: '#8b5cf6', difficulty: 3, estimatedMinutes: 75, topics: ['REST/gRPC', 'JWT', 'Circuit Breaker', 'CQRS'] },
  { id: 'cases', name: 'Case Studies', icon: '◫', description: 'Twitter, YouTube, WhatsApp, Uber, Netflix & more', path: '/cases', color: '#f59e0b', difficulty: 4, estimatedMinutes: 120, topics: ['Twitter', 'YouTube', 'Uber'] },
  { id: 'estimate', name: 'Estimation', icon: '∑', description: 'Capacity planning: QPS, storage, bandwidth, fleet', path: '/estimate', color: '#22d3ee', difficulty: 2, estimatedMinutes: 30, topics: ['QPS', 'Storage', 'Bandwidth'] },
  { id: 'canvas', name: 'Architecture Canvas', icon: '⊹', description: 'Drag-and-drop system design playground', path: '/canvas', color: '#10b981', difficulty: 3, estimatedMinutes: 45, topics: ['Drag & Drop', 'Presets', 'Export'] },
  { id: 'interview', name: 'Interview Prep', icon: '◈', description: 'RESHADED framework, 45-min timer, checklist', path: '/interview', color: '#8b5cf6', difficulty: 4, estimatedMinutes: 90, topics: ['RESHADED', 'Timer', 'Checklist'] },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_design', name: 'First Diagram', description: 'Study your first section', icon: '📐', earned: false, color: '#22d3ee' },
  { id: 'cap_navigator', name: 'CAP Navigator', description: 'Explore the CAP theorem', icon: '△', earned: false, color: '#22d3ee' },
  { id: 'queue_whisperer', name: 'Queue Whisperer', description: 'Master message queues', icon: '⇶', earned: false, color: '#10b981' },
  { id: 'scale_master', name: 'Scale Master', description: 'Run 3 capacity estimates', icon: '∑', earned: false, color: '#f59e0b' },
  { id: 'architect', name: 'System Architect', description: 'Build a design on the canvas', icon: '⊹', earned: false, color: '#10b981' },
  { id: 'interviewer', name: 'Interview Ready', description: 'Complete a timed interview', icon: '◈', earned: false, color: '#8b5cf6' },
  { id: 'principal', name: 'Principal Engineer', description: 'Visit all sections', icon: '🏛️', earned: false, color: '#f59e0b' },
]

export const LEVEL_THRESHOLDS = [0, 200, 600, 1400, 3000, 6000]
export const LEVEL_TITLES = ['Junior', 'Senior', 'Staff', 'Principal', 'Distinguished']

export function getLevelFromXP(xp: number): number {
  const idx = LEVEL_THRESHOLDS.reduce((acc, t, i) => xp >= t ? i : acc, 0)
  return Math.min(LEVEL_THRESHOLDS.length - 1, Math.max(1, idx + 1))
}
export function getXPToNextLevel(xp: number) {
  const lvl = getLevelFromXP(xp)
  const cur = LEVEL_THRESHOLDS[lvl - 1] ?? 0
  const next = LEVEL_THRESHOLDS[lvl] ?? LEVEL_THRESHOLDS.at(-1)!
  return { current: xp - cur, needed: Math.max(1, next - cur), percent: Math.min(100, ((xp - cur) / Math.max(1, next - cur)) * 100) }
}

export const LATENCY_NUMBERS = [
  { op: 'L1 cache reference', ns: 1, human: '1 ns' },
  { op: 'Branch mispredict', ns: 3, human: '3 ns' },
  { op: 'L2 cache reference', ns: 4, human: '4 ns' },
  { op: 'Mutex lock/unlock', ns: 17, human: '17 ns' },
  { op: 'Main memory reference', ns: 100, human: '100 ns' },
  { op: 'Compress 1KB (Zippy)', ns: 2_000, human: '2 µs' },
  { op: 'Send 1KB over 1Gbps', ns: 10_000, human: '10 µs' },
  { op: 'SSD random read', ns: 16_000, human: '16 µs' },
  { op: 'Read 1MB from memory', ns: 250_000, human: '250 µs' },
  { op: 'Round trip in datacenter', ns: 500_000, human: '500 µs' },
  { op: 'Read 1MB from SSD', ns: 1_000_000, human: '1 ms' },
  { op: 'Disk seek', ns: 10_000_000, human: '10 ms' },
  { op: 'Read 1MB from disk', ns: 20_000_000, human: '20 ms' },
  { op: 'Packet CA→Netherlands→CA', ns: 150_000_000, human: '150 ms' },
]
