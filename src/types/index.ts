export type Category = 'fundamentals' | 'blocks' | 'patterns' | 'cases'

export interface Section {
  id: string; name: string; icon: string; description: string; path: string; color: string
  difficulty: 1 | 2 | 3 | 4 | 5; estimatedMinutes: number; topics: string[]
}

export interface Achievement { id: string; name: string; description: string; icon: string; earned: boolean; color: string }

export interface UserState {
  xp: number; level: number; streak: number; lastVisitDate: string
  visited: string[]; solvedQuizzes: string[]; savedDesigns: number
  achievements: Achievement[]
}

// Case study graph (ReactFlow data)
export interface CaseNode { id: string; label: string; sub?: string; kind: string; x: number; y: number }
export interface CaseEdge { id: string; source: string; target: string; label?: string; animated?: boolean }
export interface CaseStudy {
  id: string; name: string; icon: string; tagline: string
  challenge: string; nodes: CaseNode[]; edges: CaseEdge[]
  decisions: { title: string; body: string }[]
  numbers: { label: string; value: string }[]
}

// Estimation
export interface EstimateInput {
  dau: number; requestsPerUserPerDay: number; bytesPerRequest: number
  readWriteRatio: number; replicationFactor: number; retentionYears: number; peakFactor: number
}
export interface EstimateOutput {
  avgQps: number; peakQps: number; readQps: number; writeQps: number
  storagePerYearGB: number; totalStorageGB: number; bandwidthMbps: number; serverCount: number
}
