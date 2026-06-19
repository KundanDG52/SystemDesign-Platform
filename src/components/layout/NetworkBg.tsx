import { useEffect, useRef } from 'react'

interface N { x: number; y: number; vx: number; vy: number }

export function NetworkBg() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0, W = 0, H = 0, nodes: N[] = [], last = 0
    function resize() {
      W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight
      const count = Math.min(40, Math.floor(W / 45))
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }))
    }
    resize()
    function draw(now: number) {
      raf = requestAnimationFrame(draw)
      if (now - last < 40) return; last = now
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]; a.x += a.vx; a.y += a.vy
        if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy)
          if (d < 150) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(34,211,238,${0.12 * (1 - d / 150)})`; ctx.lineWidth = 1; ctx.stroke() }
        }
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2); ctx.fillStyle = 'rgba(34,211,238,0.5)'; ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="fixed inset-0 -z-10 pointer-events-none" style={{ opacity: 0.6 }} />
}
