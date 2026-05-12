import { useState, useEffect, useCallback, useRef } from 'react'
import type { Player, WorkType } from '../types/game'
import type { GameEvent, EventChoice } from '../types/event'
import { WORKS } from '../data/works'
import { RANKS, MAX_RANK_INDEX } from '../data/ranks'
import { EVENTS, TUTORIAL_EVENT } from '../data/events'
import { loadCloudSave, saveCloudPlayer } from '../lib/supabase'

const SAVE_KEY = 'joseon_save'
const TICK_MS = 1000
const MAX_OFFLINE_HOURS = 8
const OFFLINE_MIN_MENTAL = 10
const HALF_HOUR_MS = 30 * 60 * 1000  // 정각·30분 슬롯 단위

function createNewPlayer(name: string): Player {
  return {
    name,
    rankIndex: 0,
    merit: 0,
    salary: 0,
    mental: 100,
    stamina: 100,
    reputation: 10,
    stats: { writing: 1, sense: 1, politics: 1 },
    equipment: { brush: 1, desk: 1, robe: 1 },
    statExp: { writing: 0, sense: 0, politics: 0 },
    currentWork: 'petition',
    lastSaveTime: Date.now(),
  }
}

function loadPlayer(): Player | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? (JSON.parse(raw) as Player) : null
  } catch {
    return null
  }
}

function savePlayer(player: Player) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...player, lastSaveTime: Date.now() }))
}

function calcTick(player: Player, seconds: number): Partial<Player> {
  const work = WORKS.find(w => w.id === player.currentWork)!
  const statBonus = 1 + (player.stats[work.statScaling] - 1) * 0.1
  const brushBonus = 1 + (player.equipment.brush - 1) * 0.05
  const deskBonus = 1 + (player.equipment.desk - 1) * 0.03
  const robeBonus = 1 + (player.equipment.robe - 1) * 0.02

  // 체력 패널티: 30 미만이면 -20%, 0이면 -50%
  const staminaPenalty = player.stamina === 0 ? 0.5 : player.stamina < 30 ? 0.8 : 1

  const meritGain = work.meritPerSec * statBonus * brushBonus * deskBonus * staminaPenalty * seconds
  const salaryGain = work.salaryPerSec * deskBonus * seconds
  const mentalLoss = work.mentalCost / 60 * seconds
  const staminaLoss = work.staminaCost / 60 * seconds

  return {
    merit: Math.min(999999, player.merit + meritGain),
    salary: player.salary + salaryGain,
    mental: Math.max(0, player.mental - mentalLoss),
    stamina: Math.max(0, player.stamina - staminaLoss),
    reputation: Math.min(100, player.reputation + (robeBonus - 1) * 0.01 * seconds),
  }
}

function calcOfflineWorkSeconds(player: Player, elapsedSeconds: number) {
  const work = WORKS.find(w => w.id === player.currentWork)!
  const mentalLossPerSecond = work.mentalCost / 60

  if (player.mental <= OFFLINE_MIN_MENTAL) return 0
  if (mentalLossPerSecond <= 0) return elapsedSeconds

  const secondsUntilRest = (player.mental - OFFLINE_MIN_MENTAL) / mentalLossPerSecond
  return Math.min(elapsedSeconds, Math.max(0, secondsUntilRest))
}

function calcStatExp(player: Player, seconds: number): Partial<Player> {
  const work = WORKS.find(w => w.id === player.currentWork)!
  const key = work.statScaling
  const expGain = 0.1 * seconds
  const newExp = { ...player.statExp, [key]: player.statExp[key] + expGain }
  const newStats = { ...player.stats }

  if (newExp[key] >= 100 && newStats[key] < 50) {
    newExp[key] -= 100
    newStats[key] += 1
  }

  return { statExp: newExp, stats: newStats }
}

function pickEvent(player: Player, recentIds: string[]): GameEvent | null {
  const eligible = EVENTS.filter(ev => {
    if (recentIds.includes(ev.id)) return false
    const c = ev.condition
    if (!c) return true
    if (c.minRank !== undefined && player.rankIndex < c.minRank) return false
    if (c.maxRank !== undefined && player.rankIndex > c.maxRank) return false
    if (c.minMental !== undefined && player.mental < c.minMental) return false
    if (c.maxMental !== undefined && player.mental > c.maxMental) return false
    return true
  })
  if (eligible.length === 0) return null
  return eligible[Math.floor(Math.random() * eligible.length)]
}

export interface EventResult {
  choiceText: string
  success?: boolean
  message: string
  effects: Record<string, number>
}

interface UseGameStoreOptions {
  userId?: string | null
}

export function useGameStore({ userId = null }: UseGameStoreOptions = {}) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [offlineReward, setOfflineReward] = useState<{
    merit: number
    salary: number
    workedSeconds: number
    stoppedByMental: boolean
  } | null>(null)
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null)
  const [eventResult, setEventResult] = useState<EventResult | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [promotionCelebration, setPromotionCelebration] = useState<{ rankIndex: number } | null>(null)
  const [saveConflict, setSaveConflict] = useState(false)
  const [cloudStatus, setCloudStatus] = useState<string | null>(null)

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cloudSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userIdRef = useRef<string | null>(userId)
  const latestPlayerRef = useRef<Player | null>(null)
  const cloudPlayerRef = useRef<Player | null>(null)
  // 마지막으로 이벤트를 발생시킨 30분 슬롯 번호
  const lastEventSlot = useRef(Math.floor(Date.now() / HALF_HOUR_MS))
  // 최근 발생한 이벤트 id 3개 기억 (반복 방지)
  const recentEventIds = useRef<string[]>([])

  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  const persistPlayer = useCallback((next: Player) => {
    savePlayer(next)
    latestPlayerRef.current = next

    const currentUserId = userIdRef.current
    if (!currentUserId || cloudSyncRef.current) return

    cloudSyncRef.current = setTimeout(() => {
      const latest = latestPlayerRef.current
      const syncUserId = userIdRef.current
      cloudSyncRef.current = null
      if (!latest || !syncUserId) return

      saveCloudPlayer(syncUserId, latest)
        .then(() => setCloudStatus('계정 저장 완료'))
        .catch(() => setCloudStatus('계정 저장에 실패했습니다'))
    }, 5000)
  }, [])

  // 초기 로드
  useEffect(() => {
    const saved = loadPlayer()
    if (saved) {
      const elapsed = Math.min(
        (Date.now() - saved.lastSaveTime) / 1000,
        MAX_OFFLINE_HOURS * 3600
      )
      if (elapsed > 30) {
        const workedSeconds = calcOfflineWorkSeconds(saved, elapsed)
        const stoppedByMental = workedSeconds < elapsed
        const reward = calcTick(saved, workedSeconds)
        const rewardMerit = (reward.merit ?? saved.merit) - saved.merit
        const rewardSalary = (reward.salary ?? saved.salary) - saved.salary
        const updated = {
          ...saved,
          ...reward,
          mental: stoppedByMental ? OFFLINE_MIN_MENTAL : (reward.mental ?? saved.mental),
        }
        setOfflineReward({
          merit: Math.floor(rewardMerit),
          salary: Math.floor(rewardSalary),
          workedSeconds: Math.floor(workedSeconds),
          stoppedByMental,
        })
        setPlayer(updated)
        persistPlayer(updated)
      } else {
        setPlayer(saved)
      }
    }
  }, [persistPlayer])

  useEffect(() => {
    if (!userId) {
      setSaveConflict(false)
      setCloudStatus(null)
      cloudPlayerRef.current = null
      return
    }

    let cancelled = false
    setCloudStatus('계정 저장본 확인 중...')

    loadCloudSave(userId)
      .then(save => {
        if (cancelled) return
        const local = loadPlayer()

        if (!save?.player) {
          if (local) {
            return saveCloudPlayer(userId, local).then(() => {
              if (!cancelled) setCloudStatus('현재 진행도를 계정에 저장했습니다')
            })
          }
          setCloudStatus(null)
          return
        }

        cloudPlayerRef.current = save.player

        if (local && JSON.stringify(local) !== JSON.stringify(save.player)) {
          setSaveConflict(true)
          setCloudStatus(null)
          return
        }

        savePlayer(save.player)
        setPlayer(save.player)
        setCloudStatus('계정 저장본을 불러왔습니다')
      })
      .catch(() => {
        if (!cancelled) setCloudStatus('계정 저장본을 불러오지 못했습니다')
      })

    return () => { cancelled = true }
  }, [userId])

  // 자동 tick
  useEffect(() => {
    if (!player) return
    tickRef.current = setInterval(() => {
      setPlayer(prev => {
        if (!prev) return prev
        const tickResult = calcTick(prev, 1)
        const expResult = calcStatExp(prev, 1)
        const updated = { ...prev, ...tickResult, ...expResult }
        persistPlayer(updated)

        // 멘탈 0 → 게임오버
        if (updated.mental === 0) {
          setIsGameOver(true)
        }

        // 정각·30분 슬롯이 바뀌면 이벤트 발생 시도
        const currentSlot = Math.floor(Date.now() / HALF_HOUR_MS)
        if (currentSlot !== lastEventSlot.current) {
          lastEventSlot.current = currentSlot
          setActiveEvent(current => {
            if (current) return current  // 이미 이벤트 중이면 유지
            const ev = pickEvent(updated, recentEventIds.current)
            if (ev) {
              recentEventIds.current = [ev.id, ...recentEventIds.current].slice(0, 3)
            }
            return ev
          })
        }

        return updated
      })
    }, TICK_MS)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [player?.currentWork, player === null])

  const resolveChoice = useCallback((choice: EventChoice) => {
    if (!player) return

    let success: boolean | undefined
    let message: string
    let appliedEffect = choice.effect

    if (choice.check) {
      const statVal = player.stats[choice.check.stat]
      success = statVal >= choice.check.threshold
      message = success
        ? (choice.successMsg ?? '성공했다.')
        : (choice.failMsg ?? '실패했다.')
      if (!success) appliedEffect = choice.failEffect
    } else {
      message = choice.resultMsg ?? ''
    }

    const effects: Record<string, number> = {}

    setPlayer(prev => {
      if (!prev || !appliedEffect) return prev
      const e = appliedEffect
      const next = { ...prev }

      if (e.merit)      { next.merit      = Math.max(0, prev.merit      + e.merit);      effects['공적']  = e.merit }
      if (e.salary)     { next.salary     = Math.max(0, prev.salary     + e.salary);     effects['녹봉']  = e.salary }
      if (e.mental)     { next.mental     = Math.min(100, Math.max(0, prev.mental     + e.mental));     effects['멘탈']  = e.mental }
      if (e.stamina)    { next.stamina    = Math.min(100, Math.max(0, prev.stamina    + e.stamina));    effects['체력']  = e.stamina }
      if (e.reputation) { next.reputation = Math.min(100, Math.max(0, prev.reputation + e.reputation)); effects['평판']  = e.reputation }
      if (e.writingExp) { next.statExp = { ...next.statExp, writing:  next.statExp.writing  + e.writingExp  } }
      if (e.senseExp)   { next.statExp = { ...next.statExp, sense:    next.statExp.sense    + e.senseExp    } }
      if (e.politicsExp){ next.statExp = { ...next.statExp, politics: next.statExp.politics + e.politicsExp } }

      persistPlayer(next)
      return next
    })

    setEventResult({ choiceText: choice.text, success, message, effects })
    setActiveEvent(null)
  }, [player])

  const dismissEventResult = useCallback(() => setEventResult(null), [])

  const startGame = useCallback((name: string) => {
    const p = createNewPlayer(name.trim() || '이름없는 관리')
    persistPlayer(p)
    setPlayer(p)
    // 게임 시작 직후 튜토리얼 첫 이벤트 발생
    setTimeout(() => setActiveEvent(TUTORIAL_EVENT), 800)
  }, [])

  const setWork = useCallback((work: WorkType) => {
    setPlayer(prev => {
      if (!prev) return prev
      const updated = { ...prev, currentWork: work }
      persistPlayer(updated)
      return updated
    })
  }, [])

  const upgradeEquipment = useCallback((slot: keyof Player['equipment']) => {
    setPlayer(prev => {
      if (!prev) return prev
      const cost = prev.equipment[slot] * 50
      if (prev.salary < cost) return prev
      const updated = {
        ...prev,
        salary: prev.salary - cost,
        equipment: { ...prev.equipment, [slot]: prev.equipment[slot] + 1 },
      }
      persistPlayer(updated)
      return updated
    })
  }, [])

  const upgradeStat = useCallback((stat: keyof Player['stats']) => {
    setPlayer(prev => {
      if (!prev) return prev
      const cost = prev.stats[stat] * 30
      if (prev.salary < cost) return prev
      const updated = {
        ...prev,
        salary: prev.salary - cost,
        stats: { ...prev.stats, [stat]: prev.stats[stat] + 1 },
      }
      persistPlayer(updated)
      return updated
    })
  }, [])

  const RECOVER_COST = 50

  const recoverMental = useCallback((amount: number) => {
    setPlayer(prev => {
      if (!prev || prev.salary < RECOVER_COST) return prev
      const updated = { ...prev, salary: prev.salary - RECOVER_COST, mental: Math.min(100, prev.mental + amount) }
      persistPlayer(updated)
      return updated
    })
  }, [])

  const recoverStamina = useCallback((amount: number) => {
    setPlayer(prev => {
      if (!prev || prev.salary < RECOVER_COST) return prev
      const updated = { ...prev, salary: prev.salary - RECOVER_COST, stamina: Math.min(100, prev.stamina + amount) }
      persistPlayer(updated)
      return updated
    })
  }, [])

  const attemptPromotion = useCallback((): 'success' | 'fail' | 'max' | 'not_ready' => {
    if (!player) return 'not_ready'
    if (player.rankIndex >= MAX_RANK_INDEX) return 'max'

    const nextRank = RANKS[player.rankIndex + 1]
    if (
      player.merit < nextRank.meritRequired ||
      player.reputation < nextRank.reputationRequired
    ) return 'not_ready'

    const basePct = 40
    const meritBonus = Math.min(30, (player.merit - nextRank.meritRequired) / nextRank.meritRequired * 20)
    const repBonus = Math.min(20, (player.reputation - nextRank.reputationRequired) * 0.5)
    const politicsBonus = Math.min(10, (player.stats.politics - 1) * 2)
    const successRate = basePct + meritBonus + repBonus + politicsBonus

    const success = Math.random() * 100 < successRate

    setPlayer(prev => {
      if (!prev) return prev
      const updated = success
        ? {
            ...prev,
            rankIndex: prev.rankIndex + 1,
            merit: 0,
            reputation: Math.min(100, prev.reputation + 10),
          }
        : {
            ...prev,
            merit: Math.floor(prev.merit * 0.9),
          }
      persistPlayer(updated)
      return updated
    })

    if (success) {
      setPromotionCelebration({ rankIndex: player.rankIndex + 1 })
    }
    return success ? 'success' : 'fail'
  }, [persistPlayer, player])

  const dismissOfflineReward = useCallback(() => setOfflineReward(null), [])

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY)
    setPlayer(null)
    setOfflineReward(null)
    setActiveEvent(null)
    setEventResult(null)
    setIsGameOver(false)
  }, [])

  const useGuestSaveForAccount = useCallback(() => {
    const currentUserId = userIdRef.current
    const currentPlayer = latestPlayerRef.current ?? player ?? loadPlayer()
    if (!currentUserId || !currentPlayer) return

    saveCloudPlayer(currentUserId, currentPlayer)
      .then(() => {
        setSaveConflict(false)
        setCloudStatus('현재 진행도를 계정에 저장했습니다')
      })
      .catch(() => setCloudStatus('계정 저장에 실패했습니다'))
  }, [player])

  const useAccountSave = useCallback(() => {
    const accountPlayer = cloudPlayerRef.current
    if (!accountPlayer) return

    savePlayer(accountPlayer)
    latestPlayerRef.current = accountPlayer
    setPlayer(accountPlayer)
    setSaveConflict(false)
    setCloudStatus('계정 저장본을 불러왔습니다')
  }, [])

  return {
    player,
    offlineReward,
    activeEvent,
    eventResult,
    isGameOver,
    promotionCelebration,
    saveConflict,
    cloudStatus,
    useGuestSaveForAccount,
    useAccountSave,
    dismissPromotion: () => setPromotionCelebration(null),
    startGame,
    setWork,
    upgradeEquipment,
    upgradeStat,
    recoverMental,
    resolveChoice,
    dismissEventResult,
    attemptPromotion,
    dismissOfflineReward,
    recoverStamina,
    resetGame,
  }
}
