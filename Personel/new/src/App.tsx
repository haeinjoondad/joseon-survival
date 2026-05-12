import { useState } from 'react'
import { useGameStore } from './store/useGameStore'
import { useAuth } from './store/useAuth'
import { useTutorial } from './store/useTutorial'
import { StartScreen } from './components/StartScreen'
import { AuthPanel } from './components/AuthPanel'
import { AccountPanel } from './components/AccountPanel'
import { StatusBar } from './components/StatusBar'
import { WorkPanel } from './components/WorkPanel'
import { StatsPanel } from './components/StatsPanel'
import { PromotionPanel } from './components/PromotionPanel'
import { OfflineRewardModal } from './components/OfflineRewardModal'
import { EventModal, EventResultModal } from './components/EventModal'
import { CharacterDisplay } from './components/CharacterDisplay'
import { PromotionGoalPanel } from './components/PromotionGoalPanel'
import { GameOverScreen } from './components/GameOverScreen'
import { TutorialBanner } from './components/TutorialBanner'
import { PromotionCelebration } from './components/PromotionCelebration'
import type { TabType } from './types/game'

const TABS: { id: TabType; label: string; emoji: string }[] = [
  { id: 'work',      label: '업무',  emoji: '📜' },
  { id: 'stats',     label: '성장',  emoji: '⬆️' },
  { id: 'promotion', label: '승진',  emoji: '🏆' },
]

// 튜토리얼 단계에서 하이라이트할 탭
const TUTORIAL_TAB_HIGHLIGHT: Record<string, TabType> = {
  work:       'work',
  accumulate: 'work',
  stats:      'stats',
  promotion:  'promotion',
}

export default function App() {
  const auth = useAuth()
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
    resetGame,
    promotionCelebration,
    dismissPromotion,
    saveConflict,
    cloudStatus,
    useGuestSaveForAccount,
    useAccountSave,
  } = useGameStore({ userId: auth.user?.id ?? null })

  const { step: tutorialStep, completeTutorial, resetTutorial } = useTutorial(player)

  const [tab, setTab] = useState<TabType>('work')

  if (!player) {
    return (
      <StartScreen
        onStart={(name) => { resetTutorial(); startGame(name) }}
        authPanel={
          <AuthPanel
            disabled={auth.loading}
            error={auth.authError}
            isConfigured={auth.isConfigured}
            onSignIn={auth.signIn}
            onSignUp={auth.signUp}
          />
        }
      />
    )
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

  const highlightTab = tutorialStep !== 'done'
    ? TUTORIAL_TAB_HIGHLIGHT[tutorialStep]
    : null

  // 튜토리얼 승진 탭 방문 시 완료
  function handleTabChange(t: TabType) {
    setTab(t)
    if (tutorialStep === 'promotion' && t === 'promotion') {
      completeTutorial()
    }
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col max-w-md mx-auto relative">
      {/* 오프라인 보상 모달 */}
      {offlineReward && (
        <OfflineRewardModal
          merit={offlineReward.merit}
          salary={offlineReward.salary}
          workedSeconds={offlineReward.workedSeconds}
          stoppedByMental={offlineReward.stoppedByMental}
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

      {/* 승진 축하 연출 */}
      {promotionCelebration && (
        <PromotionCelebration
          rankIndex={promotionCelebration.rankIndex}
          onDismiss={dismissPromotion}
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

      <AccountPanel
        user={auth.user}
        conflict={saveConflict}
        cloudStatus={cloudStatus}
        onUseGuestSave={useGuestSaveForAccount}
        onUseCloudSave={useAccountSave}
        onSignOut={() => { void auth.signOut() }}
      />

      {/* 캐릭터 표시 영역 */}
      <CharacterDisplay player={player} />

      <PromotionGoalPanel
        player={player}
        onOpenPromotion={() => handleTabChange('promotion')}
      />

      {/* 튜토리얼 배너 */}
      <TutorialBanner
        step={tutorialStep}
        currentTab={tab}
        onSkip={completeTutorial}
      />

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
        {TABS.map(t => {
          const isActive = tab === t.id
          const isHighlighted = highlightTab === t.id && !isActive
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors relative ${
                isActive
                  ? 'text-amber-400 bg-stone-800'
                  : isHighlighted
                  ? 'text-amber-300 bg-amber-950'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="text-xs">{t.label}</span>
              {/* 하이라이트 점 */}
              {isHighlighted && (
                <span className="absolute top-1.5 right-3 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
