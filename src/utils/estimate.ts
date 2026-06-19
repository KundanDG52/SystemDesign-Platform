import type { EstimateInput, EstimateOutput } from '../types'

const SECONDS_PER_DAY = 86_400
const SERVER_QPS_CAPACITY = 1000 // assume one app server handles ~1k QPS

export function estimate(i: EstimateInput): EstimateOutput {
  const dailyRequests = i.dau * i.requestsPerUserPerDay
  const avgQps = dailyRequests / SECONDS_PER_DAY
  const peakQps = avgQps * i.peakFactor

  const writeFraction = 1 / (i.readWriteRatio + 1)
  const readFraction = 1 - writeFraction
  const readQps = avgQps * readFraction
  const writeQps = avgQps * writeFraction

  // storage: only writes persist data
  const writesPerDay = dailyRequests * writeFraction
  const bytesPerDay = writesPerDay * i.bytesPerRequest
  const storagePerYearGB = (bytesPerDay * 365) / 1e9
  const totalStorageGB = storagePerYearGB * i.retentionYears * i.replicationFactor

  // bandwidth: peak throughput in Mbps (bytes→bits)
  const bandwidthMbps = (peakQps * i.bytesPerRequest * 8) / 1e6

  const serverCount = Math.max(1, Math.ceil(peakQps / SERVER_QPS_CAPACITY))

  return {
    avgQps: Math.round(avgQps),
    peakQps: Math.round(peakQps),
    readQps: Math.round(readQps),
    writeQps: Math.round(writeQps),
    storagePerYearGB: Math.round(storagePerYearGB),
    totalStorageGB: Math.round(totalStorageGB),
    bandwidthMbps: Math.round(bandwidthMbps),
    serverCount,
  }
}

export function fmt(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}
export function fmtStorage(gb: number): string {
  if (gb >= 1e6) return (gb / 1e6).toFixed(2) + ' PB'
  if (gb >= 1e3) return (gb / 1e3).toFixed(2) + ' TB'
  return gb.toFixed(0) + ' GB'
}

export const ESTIMATE_TEMPLATES: Record<string, EstimateInput> = {
  Twitter: { dau: 250_000_000, requestsPerUserPerDay: 50, bytesPerRequest: 300, readWriteRatio: 100, replicationFactor: 3, retentionYears: 5, peakFactor: 3 },
  YouTube: { dau: 122_000_000, requestsPerUserPerDay: 20, bytesPerRequest: 2_000_000, readWriteRatio: 200, replicationFactor: 3, retentionYears: 10, peakFactor: 2.5 },
  WhatsApp: { dau: 2_000_000_000, requestsPerUserPerDay: 40, bytesPerRequest: 100, readWriteRatio: 1, replicationFactor: 2, retentionYears: 1, peakFactor: 4 },
  'URL Shortener': { dau: 10_000_000, requestsPerUserPerDay: 10, bytesPerRequest: 500, readWriteRatio: 100, replicationFactor: 3, retentionYears: 5, peakFactor: 2 },
}

// ─── LRU cache (for caching visualizer) ──────────────────────────────────────
export class LRU<K, V> {
  private map = new Map<K, V>()
  constructor(public capacity: number) {}
  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined
    const v = this.map.get(key)!
    this.map.delete(key); this.map.set(key, v) // move to MRU
    return v
  }
  put(key: K, value: V): K | undefined {
    let evicted: K | undefined
    if (this.map.has(key)) this.map.delete(key)
    else if (this.map.size >= this.capacity) { evicted = this.map.keys().next().value; this.map.delete(evicted!) }
    this.map.set(key, value)
    return evicted
  }
  keys(): K[] { return [...this.map.keys()] } // LRU → MRU order
}
