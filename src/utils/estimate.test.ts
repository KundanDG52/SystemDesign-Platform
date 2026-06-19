import { describe, it, expect } from 'vitest'
import { estimate, fmt, fmtStorage, LRU } from './estimate'
import type { EstimateInput } from '../types'

const base: EstimateInput = { dau: 8_640_000, requestsPerUserPerDay: 10, bytesPerRequest: 1000, readWriteRatio: 9, replicationFactor: 3, retentionYears: 1, peakFactor: 2 }

describe('estimate', () => {
  it('computes avg QPS from DAU × req/day / 86400', () => {
    // 8.64M × 10 / 86400 = 1000
    expect(estimate(base).avgQps).toBe(1000)
  })
  it('applies peak factor', () => { expect(estimate(base).peakQps).toBe(2000) })
  it('splits read/write by ratio', () => {
    const o = estimate(base) // ratio 9 → 90% read
    expect(o.readQps).toBe(900); expect(o.writeQps).toBe(100)
  })
  it('scales storage by replication & retention', () => {
    const o1 = estimate(base)
    const o2 = estimate({ ...base, replicationFactor: 6 })
    expect(o2.totalStorageGB).toBe(o1.totalStorageGB * 2)
  })
  it('sizes server fleet from peak QPS', () => {
    expect(estimate(base).serverCount).toBe(2) // ceil(2000/1000)
    expect(estimate({ ...base, peakFactor: 5 }).serverCount).toBe(5)
  })
  it('never returns 0 servers', () => {
    expect(estimate({ ...base, dau: 100 }).serverCount).toBe(1)
  })
})

describe('formatters', () => {
  it('fmt abbreviates', () => { expect(fmt(2_500_000)).toBe('2.5M'); expect(fmt(1500)).toBe('1.5K') })
  it('fmtStorage scales units', () => { expect(fmtStorage(2048)).toBe('2.05 TB'); expect(fmtStorage(2_000_000)).toBe('2.00 PB') })
})

describe('LRU', () => {
  it('evicts least-recently-used on overflow', () => {
    const c = new LRU<string, number>(2)
    c.put('a', 1); c.put('b', 2)
    expect(c.put('c', 3)).toBe('a') // a evicted
    expect(c.get('a')).toBeUndefined()
    expect(c.keys()).toEqual(['b', 'c'])
  })
  it('get promotes to most-recently-used', () => {
    const c = new LRU<string, number>(2)
    c.put('a', 1); c.put('b', 2); c.get('a') // a now MRU
    expect(c.put('c', 3)).toBe('b') // b evicted, not a
    expect(c.keys()).toEqual(['a', 'c'])
  })
})
