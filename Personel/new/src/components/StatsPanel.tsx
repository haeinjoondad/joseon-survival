import type { Player } from '../types/game'

interface Props {
  player: Player
  onUpgradeStat: (stat: keyof Player['stats']) => void
  onUpgradeEquip: (slot: keyof Player['equipment']) => void
}

const STAT_INFO = {
  writing: { label: '필력', emoji: '🖌️', desc: '상소문 효율 +10%/레벨' },
  sense: { label: '눈치', emoji: '👁️', desc: '민원 처리 효율 +10%/레벨' },
  politics: { label: '정치력', emoji: '🏛️', desc: '승진 심사 보정 +2%/레벨' },
}

const EQUIP_INFO = {
  brush: { label: '붓', emoji: '🖌️', desc: '강화 1회당 공적 획득 +5%' },
  desk: { label: '책상', emoji: '🪑', desc: '강화 1회당 공적·녹봉 획득 +3%' },
  robe: {
    label: '관복',
    emoji: '🧥',
    desc: '강화 1회당 평판 +0.25/시간 · 민원 평판 +2%',
  },
}

function getEquipEffect(slot: keyof Player['equipment'], level: number) {
  const upgrades = Math.max(0, level - 1)

  if (slot === 'brush') {
    return `현재 효과: 공적 +${upgrades * 5}%`
  }

  if (slot === 'desk') {
    return `현재 효과: 공적·녹봉 +${upgrades * 3}%`
  }

  return `현재 효과: 평판 +${(upgrades * 0.25).toFixed(2)}/시간 · 민원 +${upgrades * 2}%`
}

export function StatsPanel({ player, onUpgradeStat, onUpgradeEquip }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <section>
        <h2 className="text-hanji text-sm font-bold text-center mb-3">── 능력치 강화 ──</h2>
        <div className="space-y-2">
          {(Object.keys(STAT_INFO) as Array<keyof typeof STAT_INFO>).map(key => {
            const info = STAT_INFO[key]
            const cost = player.stats[key] * 30
            const canAfford = player.salary >= cost
            const exp = player.statExp[key]

            return (
              <div key={key} className="bg-stone-800 rounded-lg p-3 border border-stone-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info.emoji}</span>
                    <div>
                      <div className="text-hanji text-sm font-bold">
                        {info.label} <span className="text-amber-400">Lv.{player.stats[key]}</span>
                      </div>
                      <div className="text-stone-500 text-xs">{info.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onUpgradeStat(key)}
                    disabled={!canAfford}
                    className="bg-amber-700 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-hanji text-xs px-3 py-1.5 rounded transition-colors"
                  >
                    강화<br />{cost}냥
                  </button>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>자동 경험치</span>
                    <span>{Math.floor(exp)}/100</span>
                  </div>
                  <div className="bg-stone-700 rounded-full h-1">
                    <div
                      className="bg-amber-500 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, exp)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-hanji text-sm font-bold text-center mb-3">── 장비 강화 ──</h2>
        <div className="space-y-2">
          {(Object.keys(EQUIP_INFO) as Array<keyof typeof EQUIP_INFO>).map(key => {
            const info = EQUIP_INFO[key]
            const cost = player.equipment[key] * 50
            const canAfford = player.salary >= cost

            return (
              <div key={key} className="bg-stone-800 rounded-lg p-3 border border-stone-700 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg shrink-0">{info.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-hanji text-sm font-bold">
                      {info.label} <span className="text-green-400">+{player.equipment[key]}</span>
                    </div>
                    <div className="text-stone-500 text-xs leading-4">{info.desc}</div>
                    <div className="text-green-400/80 text-xs mt-0.5">
                      {getEquipEffect(key, player.equipment[key])}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onUpgradeEquip(key)}
                  disabled={!canAfford}
                  className="w-12 bg-green-800 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-hanji text-xs px-2 py-1.5 rounded transition-colors"
                >
                  강화<br />{cost}냥
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
