import { useEffect, useState } from 'react'
import { RANKS } from '../data/ranks'

interface Props {
  rankIndex: number
  onDismiss: () => void
}

const PARTICLES = ['🎊', '✨', '🌟', '🎉', '⭐', '💫', '🏅', '📜']

function Particle({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <span className="absolute text-2xl pointer-events-none animate-bounce" style={style}>
      {emoji}
    </span>
  )
}

export function PromotionCelebration({ rankIndex, onDismiss }: Props) {
  const rank = RANKS[rankIndex]
  const [visible, setVisible] = useState(false)
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      emoji: PARTICLES[i % PARTICLES.length],
      style: {
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 60 + 5}%`,
        animationDelay: `${Math.random() * 0.8}s`,
        animationDuration: `${0.6 + Math.random() * 0.8}s`,
        fontSize: `${1.2 + Math.random() * 1.2}rem`,
      } as React.CSSProperties,
    }))
  )

  useEffect(() => {
    // 마운트 직후 페이드인
    const t1 = setTimeout(() => setVisible(true), 30)
    // 3초 후 자동 닫기
    const t2 = setTimeout(() => onDismiss(), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDismiss])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'radial-gradient(ellipse at center, rgba(120,80,0,0.92) 0%, rgba(10,8,4,0.97) 100%)' }}
      onClick={onDismiss}
    >
      {/* 파티클 */}
      {particles.map((p, i) => (
        <Particle key={i} emoji={p.emoji} style={p.style} />
      ))}

      {/* 중앙 콘텐츠 */}
      <div className={`text-center px-8 transition-all duration-500 ${visible ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'}`}>
        {/* 도장 느낌의 원 */}
        <div className="relative inline-block mb-6">
          <div className="w-36 h-36 rounded-full border-4 border-amber-400 flex items-center justify-center bg-amber-950 shadow-2xl shadow-amber-500/30 mx-auto">
            <div className="text-center">
              <div className="text-amber-300 text-xs font-bold tracking-widest mb-1">승 진</div>
              <div className="text-hanji text-2xl font-bold text-amber-100">{rank.name}</div>
              <div className="text-amber-400 text-sm mt-1">{rank.title}</div>
            </div>
          </div>
          {/* 빛나는 링 */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-300/30 animate-ping" />
        </div>

        <h2 className="text-hanji text-2xl font-bold text-amber-200 mb-2">
          승진하셨습니다
        </h2>
        <p className="text-amber-400/80 text-sm mb-1">
          {rank.name} {rank.title}에 임명되었습니다
        </p>
        <p className="text-stone-500 text-xs mt-6 animate-pulse">
          화면을 터치하면 닫힙니다
        </p>
      </div>
    </div>
  )
}
