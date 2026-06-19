import { useEffect } from 'react'
import { ADR } from '../components/shared/Bits'
import { CircuitBreakerDemo, RateLimiterDemo, JWTDemo } from '../components/patterns/PatternDemos'
import { useStore } from '../store'

function Panel({ title, n, color, accent, children }: any) {
  return <ADR accent={accent} className="p-5"><div className="flex items-center gap-2 mb-3"><span className="annotation" style={{ color }}>{n}</span><h2 className="text-sm font-bold text-white">{title}</h2></div>{children}</ADR>
}

export function Patterns() {
  const { visitSection } = useStore()
  useEffect(() => { visitSection('patterns') }, [])
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-5">
      <div><h1 className="text-2xl font-black text-violet">Design Patterns</h1><p className="text-white/40 text-sm mt-1">Resilience, APIs, auth & event-driven techniques.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Circuit Breaker · Closed / Open / Half-Open" n="01 · resilience" color="#f43f5e" accent="amber"><CircuitBreakerDemo /></Panel>
        <Panel title="Rate Limiting · token bucket" n="02 · throttle" color="#22d3ee" accent="cyan"><RateLimiterDemo /></Panel>
      </div>
      <Panel title="JWT Lifecycle · stateless auth" n="03 · auth" color="#10b981" accent="emerald"><JWTDemo /></Panel>
      <ADR accent="violet" className="p-5">
        <h2 className="text-sm font-bold text-white mb-3">API styles & event-driven</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {[
            { t: 'REST', d: 'Resource URLs, HTTP verbs, cacheable. Over/under-fetching common.', c: '#22d3ee' },
            { t: 'GraphQL', d: 'Single endpoint, client picks fields. Flexible; caching & N+1 are harder.', c: '#8b5cf6' },
            { t: 'gRPC', d: 'Binary HTTP/2 + protobuf, streaming. Fast service-to-service; not browser-native.', c: '#10b981' },
          ].map(x => <div key={x.t} className="panel rounded-lg p-3" style={{ borderColor: `${x.c}25` }}><div className="font-semibold mb-1" style={{ color: x.c }}>{x.t}</div><div className="text-white/50">{x.d}</div></div>)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
          {[
            { t: 'Event Sourcing', d: 'Store an append-only log of events; rebuild state by replaying. Full audit + time-travel.', c: '#f59e0b' },
            { t: 'CQRS', d: 'Split write model (commands) from read model (queries) — scale & optimize each independently.', c: '#22d3ee' },
            { t: 'Saga', d: 'Distributed transaction as a sequence of local steps with compensating rollbacks.', c: '#f43f5e' },
            { t: 'Choreography vs Orchestration', d: 'Services react to events (choreography) vs a central coordinator drives the flow (orchestration).', c: '#10b981' },
          ].map(x => <div key={x.t} className="panel rounded-lg p-3" style={{ borderColor: `${x.c}25` }}><div className="font-semibold mb-1" style={{ color: x.c }}>{x.t}</div><div className="text-white/50">{x.d}</div></div>)}
        </div>
      </ADR>
    </div>
  )
}
