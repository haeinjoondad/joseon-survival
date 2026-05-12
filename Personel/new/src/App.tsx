import { useState } from 'react'
import { useGameStore } from './store/useGameStore'
import { StartScreen } from './components/StartScreen'
import { StatusBar } from './components/StatusBar'
import { WorkPanel } from './components/WorkPanel'
import { StatsPanel } from './components/StatsPanel'
import { PromotionPanel } from './components/PromotionPanel'
import { OfflineRewardModal } from './components/OfflineRewardModal'
import { EventModal, EventResultModal } from './components/EventModal'
import { CharacterDisplay } from './components/CharacterDisplay'
import { GameOverScreen } from './components/GameOverScreen'
import type { TabType } from './types/game'

const TABS: { id: TabType; label: string; emoji: string }[] = [
  { id: 'work',      label: '업무',  emoji: '📜' },
  { id: 'stats',     label: '성장',  emoji: '⬆️' },
  { id: 'promotion', label: '승진',  emoji: '🏆' },
]

export default function App() {
  const {
    player,
    offlineReward,
    activeEvent,
    eventResult,
    isGameOver,
    startGame,
    setWork,
    upgradeEquipment,
    upgradeStat,
    recoverMental,
    recoverStamina,
    resolveChoice,
    dismissEventResult,
    attemptPromotion,
    dismissOfflineReward,
  } = useGameStore()

  const [tab, setTab] = useState<TabType>('work')

  if (!player) {
    return <StartScreen onStart={startGame} />
  }

  if (isGameOver) {
    return (
      <GameOverScreen
        name={player.name}
        rankIndex={player.rankIndex}
        totalMerit={player.merit}
        totalSalary={player.salary}
        onRestart={resetGame}
      />
    )
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col max-w-md mx-auto relative">
      {/* 오프라인 보상 모달 */}
      {offlineReward && (
        <OfflineRewardModal
          merit={offlineReward.merit}
          salary={offlineReward.salary}
          onDismiss={dismissOfflineReward}
        />
      )}

      {/* 이벤트 모달 */}
      {activeEvent && !offlineReward && (
        <EventModal
          event={activeEvent}
          player={player}
          onChoose={i => resolveChoice(activeEvent.choices[i])}
        />
      )}

      {/* 이벤트 결과 모달 */}
      {eventResult && !activeEvent && (
        <EventResultModal
          result={eventResult}
          onDismiss={dismissEventResult}
        />
      )}

      {/* 상단 상태바 */}
      <StatusBar player={player} />

      {/* 캐릭터 표시 영역 */}
      <CharacterDisplay player={player} />

      {/* 탭 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {tab === 'work' && (
          <WorkPanel
            player={player}
            onSetWork={setWork}
            onRecover={() => recoverMental(30)}
            onRecoverStamina={() => recoverStamina(30)}
          />
        )}
        {tab === 'stats' && (
          <StatsPanel
            player={player}
            onUpgradeStat={upgradeStat}
            onUpgradeEquip={upgradeEquipment}
          />
        )}
        {tab === 'promotion' && (
          <PromotionPanel
            player={player}
            onAttempt={attemptPromotion}
          />
        )}
      </div>

      {/* 하단 탭바 */}
      <nav className="bg-stone-900 border-t border-stone-700 flex">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
              tab === t.id
                ? 'text-amber-400 bg-stone-800'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <span className="text-lg">{t.emoji}</span>
            <span className="text-xs">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
