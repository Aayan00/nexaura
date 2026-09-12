import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import type {
  UserProfile,
  AttributeData,
  AttributeType,
  Mission,
  ShopItem,
  Achievement,
  ActivityLog,
  FocusSession,
  Subtask,
} from '../types/rpg'
import {
  initialUserProfile,
  initialAttributes,
  initialMissions,
  initialShopItems,
  initialAchievements,
  initialActivityLogs,
} from '../data/mockData'
import { sound } from '../lib/sound'
import { api } from '../lib/api'

export interface ToastMessage {
  id: string
  title: string
  message: string
  type: 'success' | 'level' | 'reward' | 'error' | 'info'
  xp?: number
  credits?: number
}

export type AvatarAnimState = 'idle' | 'focus' | 'complete' | 'levelup' | 'victory'

interface RPGContextType {
  user: UserProfile
  attributes: AttributeData[]
  missions: Mission[]
  shopItems: ShopItem[]
  achievements: Achievement[]
  activityLogs: ActivityLog[]
  focusSessions: FocusSession[]
  toast: ToastMessage | null
  isAuthenticated: boolean
  avatarState: AvatarAnimState
  setAvatarState: (state: AvatarAnimState) => void
  completeMission: (missionId: string | number) => void
  toggleSubtask: (missionId: string | number, subtaskId: number) => void
  allocateStatPoint: (code: AttributeType) => void
  buyShopItem: (itemId: string) => boolean
  equipShopItem: (itemId: string) => void
  claimAchievement: (achievementId: string) => void
  addCustomMission: (mission: Omit<Mission, 'id' | 'completed'>) => void
  deleteMission: (missionId: string | number) => void
  completeFocusSession: (durationMinutes: number, taskId?: string | number, notes?: string) => void
  setPerformanceMode: (mode: 'ultra' | 'balanced' | 'low') => void
  setEnvironmentTheme: (env: 'city' | 'space' | 'matrix' | 'neon' | 'amber' | 'void') => void
  updateUserProfile: (data: Partial<UserProfile>) => void
  toggleSound: () => void
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
  dismissToast: () => void
  login: (username: string) => void
  signup: (username: string, operativeClass: string, favoredStat: AttributeType) => void
  logout: () => void
}

const RPGContext = createContext<RPGContextType | undefined>(undefined)

const STORAGE_KEY = 'nexaura_rpg_state_v2'

export const RPGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_auth')
    return saved !== null ? JSON.parse(saved) : true
  })

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_user')
    return saved
      ? { ...initialUserProfile, ...JSON.parse(saved) }
      : { ...initialUserProfile, performanceMode: 'ultra', environment: 'city' }
  })

  const [attributes, setAttributes] = useState<AttributeData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_attrs')
    return saved ? JSON.parse(saved) : initialAttributes
  })

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_missions')
    return saved ? JSON.parse(saved) : initialMissions
  })

  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_shop')
    return saved ? JSON.parse(saved) : initialShopItems
  })

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_achievements')
    return saved ? JSON.parse(saved) : initialAchievements
  })

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_logs')
    return saved ? JSON.parse(saved) : initialActivityLogs
  })

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_focus')
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            duration_minutes: 25,
            session_type: 'pomodoro',
            xp_earned: 50,
            completed: 1,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ]
  })

  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [avatarState, setAvatarState] = useState<AvatarAnimState>('idle')

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_auth', JSON.stringify(isAuthenticated))
    localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(user))
    localStorage.setItem(STORAGE_KEY + '_attrs', JSON.stringify(attributes))
    localStorage.setItem(STORAGE_KEY + '_missions', JSON.stringify(missions))
    localStorage.setItem(STORAGE_KEY + '_shop', JSON.stringify(shopItems))
    localStorage.setItem(STORAGE_KEY + '_achievements', JSON.stringify(achievements))
    localStorage.setItem(STORAGE_KEY + '_logs', JSON.stringify(activityLogs))
    localStorage.setItem(STORAGE_KEY + '_focus', JSON.stringify(focusSessions))
  }, [isAuthenticated, user, attributes, missions, shopItems, achievements, activityLogs, focusSessions])

  // Fetch initial data from backend if available
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [taskRes, itemRes, achRes, focusRes] = await Promise.allSettled([
          api.tasks.getAll(),
          api.shop.getItems(),
          api.achievements.getAll(),
          api.focus.getHistory(),
        ])

        if (taskRes.status === 'fulfilled' && taskRes.value.success && taskRes.value.tasks?.length > 0) {
          // Map backend tasks to Mission format
          const mappedMissions: Mission[] = taskRes.value.tasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            attribute: (t.stat_type || 'DIS') as AttributeType,
            rank: (t.difficulty === 'epic' ? 'S' : t.difficulty === 'hard' ? 'A' : t.difficulty === 'medium' ? 'B' : 'D'),
            category: (t.category as any) || 'Personal',
            priority: (t.priority as any) || 'medium',
            status: t.status as any,
            xpReward: t.xp_reward || 100,
            creditReward: t.credit_reward || 50,
            statPoints: 1,
            completed: t.status === 'completed',
            isBoss: t.is_boss === 1 || t.is_boss === true,
            subtasks: t.subtasks?.map((s) => ({
              id: s.id,
              task_id: t.id,
              title: s.title,
              completed: s.completed,
            })) || [],
          }))
          setMissions(mappedMissions)
        }

        if (itemRes.status === 'fulfilled' && itemRes.value.success && itemRes.value.items?.length > 0) {
          setShopItems(itemRes.value.items as any)
        }

        if (achRes.status === 'fulfilled' && achRes.value.success && achRes.value.achievements?.length > 0) {
          setAchievements(achRes.value.achievements as any)
        }

        if (focusRes.status === 'fulfilled' && focusRes.value.success && focusRes.value.sessions) {
          setFocusSessions(focusRes.value.sessions)
        }
      } catch (e) {
        console.warn('Backend sync fallback to local storage:', e)
      }
    }
    loadBackendData()
  }, [])

  const showToast = useCallback((toastData: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString()
    setToast({ ...toastData, id })
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  // Auto dismiss toast after 4.5s
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 4500)
    return () => clearTimeout(timer)
  }, [toast])

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ff007f', '#a855f7', '#facc15', '#10b981'],
      })
    } catch {}
  }

  const toggleSound = () => {
    const nextVal = !user.soundEnabled
    sound.toggleSound(nextVal)
    setUser((prev) => ({ ...prev, soundEnabled: nextVal }))
    if (nextVal) sound.playClick()
  }

  const setPerformanceMode = (mode: 'ultra' | 'balanced' | 'low') => {
    setUser((prev) => ({ ...prev, performanceMode: mode }))
    showToast({
      title: `[RENDER PIPELINE UPDATED]`,
      message: `Graphics preset calibrated to ${mode.toUpperCase()} mode.`,
      type: 'info',
    })
  }

  const setEnvironmentTheme = (env: 'city' | 'space' | 'matrix' | 'neon' | 'amber' | 'void') => {
    setUser((prev) => ({ ...prev, environment: env }))
    showToast({
      title: `[SIMULATION ENVIRONMENT SHIFTED]`,
      message: `Backdrop neural matrix reconfigured to ${env.toUpperCase()}.`,
      type: 'info',
    })
  }

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }))
    api.user.updateProfile(data).catch(() => {})
  }

  const completeMission = (missionId: string | number) => {
    const target = missions.find((m) => String(m.id) === String(missionId))
    if (!target || target.completed) return

    sound.playComplete()
    setAvatarState('complete')
    setTimeout(() => setAvatarState('idle'), 3000)

    const xpEarned = target.xpReward
    const creditsEarned = target.creditReward
    const statGained = target.statPoints || 1

    // Update mission status locally
    setMissions((prev) =>
      prev.map((m) =>
        String(m.id) === String(missionId)
          ? {
              ...m,
              completed: true,
              status: 'completed',
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : m
      )
    )

    // Upgrade target attribute
    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.code === target.attribute) {
          const nextVal = attr.value + statGained
          const nextLvl = Math.floor(nextVal / 10) + 1
          return {
            ...attr,
            value: nextVal,
            level: nextLvl,
          }
        }
        return attr
      })
    )

    // XP and Level Calculation
    let nextXP = user.currentXP + xpEarned
    let nextLevel = user.level
    let nextMaxXP = user.maxXP
    let newUnassigned = user.unassignedPoints
    let didLevelUp = false

    if (nextXP >= user.maxXP) {
      nextXP = nextXP - user.maxXP
      nextLevel += 1
      nextMaxXP = Math.floor(user.maxXP * 1.25)
      newUnassigned += 3
      didLevelUp = true
    }

    setUser((prev) => ({
      ...prev,
      currentXP: nextXP,
      level: nextLevel,
      maxXP: nextMaxXP,
      credits: prev.credits + creditsEarned,
      unassignedPoints: newUnassigned,
    }))

    // Add activity log
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      timestamp: 'JUST NOW',
      title: target.isBoss ? '💥 BOSS DEFEATED' : 'Mission Complete',
      details: `${target.title} executed. +${statGained} ${target.attribute} points allocated.`,
      type: 'mission',
      xpGained: xpEarned,
      creditsGained: creditsEarned,
    }
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 19)])

    // Backend call sync
    api.tasks.complete(String(missionId)).catch(() => {})

    if (didLevelUp) {
      setTimeout(() => {
        sound.playLevelUp()
        triggerConfetti()
        setAvatarState('levelup')
        setTimeout(() => setAvatarState('idle'), 4000)
        showToast({
          title: `// SYSTEM LEVEL UP: LVL ${nextLevel}`,
          message: `Neural operative rank escalated! +3 Stat Points available for allocation.`,
          type: 'level',
          xp: xpEarned,
          credits: creditsEarned,
        })
      }, 300)
    } else {
      showToast({
        title: target.isBoss ? `[BOSS MISSION TERMINATED]` : `[MISSION PROTOCOL COMPLETE]`,
        message: `${target.title}`,
        type: 'reward',
        xp: xpEarned,
        credits: creditsEarned,
      })
    }
  }

  const toggleSubtask = (missionId: string | number, subtaskId: number) => {
    sound.playClick()
    setMissions((prev) =>
      prev.map((m) => {
        if (String(m.id) === String(missionId) && m.subtasks) {
          const updatedSubtasks: Subtask[] = m.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: st.completed ? 0 : 1 } : st
          )
          // If all subtasks completed, auto mark mission done
          const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => Boolean(st.completed))
          if (allDone && !m.completed) {
            setTimeout(() => completeMission(missionId), 400)
          }
          return {
            ...m,
            subtasks: updatedSubtasks,
          }
        }
        return m
      })
    )
    api.tasks.toggleSubtask(String(missionId), String(subtaskId)).catch(() => {})
  }

  const completeFocusSession = (durationMinutes: number, taskId?: string | number, notes?: string) => {
    sound.playFocusFinish()
    const xpReward = Math.round(durationMinutes * 4)
    const creditReward = Math.round(durationMinutes * 2)

    const newSession: FocusSession = {
      id: Date.now(),
      task_id: taskId ? Number(taskId) : null,
      duration_minutes: durationMinutes,
      session_type: 'deep_work',
      xp_earned: xpReward,
      completed: 1,
      created_at: new Date().toISOString(),
    }

    setFocusSessions((prev) => [newSession, ...prev])

    // Level progression
    let nextXP = user.currentXP + xpReward
    let nextLevel = user.level
    let nextMaxXP = user.maxXP
    let newUnassigned = user.unassignedPoints
    let didLevelUp = false

    if (nextXP >= user.maxXP) {
      nextXP = nextXP - user.maxXP
      nextLevel += 1
      nextMaxXP = Math.floor(user.maxXP * 1.25)
      newUnassigned += 3
      didLevelUp = true
    }

    setUser((prev) => ({
      ...prev,
      currentXP: nextXP,
      level: nextLevel,
      maxXP: nextMaxXP,
      credits: prev.credits + creditReward,
      unassignedPoints: newUnassigned,
    }))

    setActivityLogs((prev) => [
      {
        id: 'log-' + Date.now(),
        timestamp: 'JUST NOW',
        title: 'Deep Work Reactor Focus Completed',
        details: `${durationMinutes}m focus protocol completed successfully.`,
        type: 'mission',
        xpGained: xpReward,
        creditsGained: creditReward,
      },
      ...prev.slice(0, 19),
    ])

    api.focus.complete(durationMinutes, taskId ? String(taskId) : undefined, notes).catch(() => {})

    if (didLevelUp) {
      sound.playLevelUp()
      triggerConfetti()
      setAvatarState('levelup')
      setTimeout(() => setAvatarState('idle'), 4000)
      showToast({
        title: `// SYSTEM LEVEL UP: LVL ${nextLevel}`,
        message: `Focus protocol overloaded neural synapses! +3 Stat Points awarded.`,
        type: 'level',
        xp: xpReward,
        credits: creditReward,
      })
    } else {
      showToast({
        title: `[FOCUS PROTOCOL COMPLETE]`,
        message: `${durationMinutes} minutes of intense deep work recorded.`,
        type: 'reward',
        xp: xpReward,
        credits: creditReward,
      })
    }
  }

  const allocateStatPoint = (code: AttributeType) => {
    if (user.unassignedPoints <= 0) return

    sound.playStatUpgrade()

    setUser((prev) => ({
      ...prev,
      unassignedPoints: prev.unassignedPoints - 1,
    }))

    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.code === code) {
          const nextVal = attr.value + 2
          const nextLvl = Math.floor(nextVal / 10) + 1
          return {
            ...attr,
            value: nextVal,
            level: nextLvl,
          }
        }
        return attr
      })
    )

    const targetAttr = attributes.find((a) => a.code === code)

    setActivityLogs((prev) => [
      {
        id: 'log-' + Date.now(),
        timestamp: 'JUST NOW',
        title: `${code} Attribute Surge`,
        details: `Allocated points to ${targetAttr?.name || code}. New power level: ${
          (targetAttr?.value || 0) + 2
        }.`,
        type: 'stat',
      },
      ...prev.slice(0, 19),
    ])

    const statMap: Record<AttributeType, 'intelligence' | 'strength' | 'dexterity' | 'vitality' | 'discipline'> = {
      INT: 'intelligence',
      STR: 'strength',
      DEX: 'dexterity',
      VIT: 'vitality',
      DIS: 'discipline',
    }
    api.user.allocateStat(statMap[code] || 'discipline').catch(() => {})

    showToast({
      title: `[NEURAL UPGRADE CONFIRMED]`,
      message: `+2 Points injected into ${targetAttr?.fullName || code}`,
      type: 'success',
    })
  }

  const buyShopItem = (itemId: string): boolean => {
    const item = shopItems.find((i) => i.id === itemId)
    if (!item) return false
    if (item.owned) {
      equipShopItem(itemId)
      return true
    }
    if (user.credits < item.price) {
      sound.playAlert()
      showToast({
        title: `// INSUFFICIENT CREDITS`,
        message: `You require ${item.price - user.credits} more ₢ to purchase this item.`,
        type: 'error',
      })
      return false
    }

    sound.playBuy()

    setUser((prev) => ({
      ...prev,
      credits: prev.credits - item.price,
    }))

    setShopItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              owned: true,
              equipped: true,
            }
          : i.type === item.type && (item.type === 'theme' || item.type === 'title')
          ? { ...i, equipped: false }
          : i
      )
    )

    // Apply immediate effect
    if (item.type === 'title') {
      setUser((prev) => ({ ...prev, title: item.name.replace('Title: ', '') }))
    }

    setActivityLogs((prev) => [
      {
        id: 'log-' + Date.now(),
        timestamp: 'JUST NOW',
        title: 'Black Market Acquisition',
        details: `Purchased ${item.name} for ${item.price} Credits.`,
        type: 'shop',
      },
      ...prev.slice(0, 19),
    ])

    api.shop.purchase(itemId).catch(() => {})

    showToast({
      title: `[ITEM ACQUIRED]`,
      message: `${item.name} is now in your active inventory!`,
      type: 'reward',
      credits: -item.price,
    })

    return true
  }

  const equipShopItem = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId)
    if (!item || !item.owned) return

    sound.playClick()

    setShopItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          return { ...i, equipped: !i.equipped }
        }
        if (item.type === 'theme' || item.type === 'title') {
          return { ...i, equipped: false }
        }
        if (item.type === 'cyberware' && item.slot && i.slot === item.slot) {
          return { ...i, equipped: false }
        }
        return i
      })
    )

    if (item.type === 'title') {
      setUser((prev) => ({ ...prev, title: item.name.replace('Title: ', '') }))
    }

    api.shop.equip(itemId).catch(() => {})

    showToast({
      title: `[EQUIP STATE UPDATED]`,
      message: `${item.name} loadout modified.`,
      type: 'info',
    })
  }

  const claimAchievement = (achievementId: string) => {
    const target = achievements.find((a) => a.id === achievementId)
    if (!target || !target.unlocked || target.claimed) return

    sound.playLevelUp()
    triggerConfetti()

    setAchievements((prev) =>
      prev.map((a) => (a.id === achievementId ? { ...a, claimed: true } : a))
    )

    const xpEarned = target.xpReward
    const creditsEarned = target.creditReward

    // Handle XP / Leveling
    let nextXP = user.currentXP + xpEarned
    let nextLevel = user.level
    let nextMaxXP = user.maxXP
    let newUnassigned = user.unassignedPoints

    if (nextXP >= user.maxXP) {
      nextXP = nextXP - user.maxXP
      nextLevel += 1
      nextMaxXP = Math.floor(user.maxXP * 1.25)
      newUnassigned += 3
    }

    setUser((prev) => ({
      ...prev,
      currentXP: nextXP,
      level: nextLevel,
      maxXP: nextMaxXP,
      credits: prev.credits + creditsEarned,
      unassignedPoints: newUnassigned,
    }))

    setActivityLogs((prev) => [
      {
        id: 'log-' + Date.now(),
        timestamp: 'JUST NOW',
        title: 'Achievement Claimed',
        details: `Milestone [${target.title}] claimed. +${xpEarned} XP & +${creditsEarned} Credits.`,
        type: 'achievement',
        xpGained: xpEarned,
        creditsGained: creditsEarned,
      },
      ...prev.slice(0, 19),
    ])

    api.achievements.claim(achievementId).catch(() => {})

    showToast({
      title: `[ACHIEVEMENT REWARD CLAIMED]`,
      message: `${target.title}`,
      type: 'reward',
      xp: xpEarned,
      credits: creditsEarned,
    })
  }

  const addCustomMission = (missionData: Omit<Mission, 'id' | 'completed'>) => {
    sound.playClick()
    const newMission: Mission = {
      ...missionData,
      id: 'm-custom-' + Date.now(),
      completed: false,
      isCustom: true,
      subtasks: missionData.subtasks || [],
    }

    setMissions((prev) => [newMission, ...prev])

    // Try creating on backend
    api.tasks.create({
      title: missionData.title,
      description: missionData.description,
      category: missionData.category,
      difficulty: missionData.rank === 'S' ? 'epic' : missionData.rank === 'A' ? 'hard' : missionData.rank === 'B' ? 'medium' : 'easy',
      priority: (missionData.priority as any) || 'medium',
      stat_type: missionData.attribute,
      xp_reward: missionData.xpReward,
      credit_reward: missionData.creditReward,
      is_boss: missionData.isBoss ? 1 : 0,
      subtasks: missionData.subtasks as any,
    }).catch(() => {})

    showToast({
      title: `[NEW MISSION LOGGED]`,
      message: `${newMission.title} added to active quest protocol.`,
      type: 'success',
    })
  }

  const deleteMission = (missionId: string | number) => {
    sound.playClick()
    setMissions((prev) => prev.filter((m) => String(m.id) !== String(missionId)))
    api.tasks.delete(String(missionId)).catch(() => {})
    showToast({
      title: `// MISSION PURGED`,
      message: `Directive removed from database.`,
      type: 'info',
    })
  }

  const login = (username: string) => {
    sound.playComplete()
    setUser((prev) => ({ ...prev, username: username.toUpperCase() }))
    setIsAuthenticated(true)
    api.auth.login(username).catch(() => {})
    showToast({
      title: `// NEURAL LINK ESTABLISHED`,
      message: `Welcome back, Operative ${username.toUpperCase()}. System Online.`,
      type: 'success',
    })
  }

  const signup = (username: string, operativeClass: string, favoredStat: AttributeType) => {
    sound.playLevelUp()
    triggerConfetti()

    setUser((prev) => ({
      ...prev,
      username: username.toUpperCase(),
      operativeClass,
      level: 1,
      currentXP: 0,
      maxXP: 1000,
      credits: 500,
      unassignedPoints: 5,
    }))

    // Bonus to favored stat
    setAttributes((prev) =>
      prev.map((a) => (a.code === favoredStat ? { ...a, value: a.value + 10, level: 2 } : a))
    )

    setIsAuthenticated(true)

    showToast({
      title: `// OPERATIVE INITIALIZED`,
      message: `Welcome to Nexaura.exe, ${username.toUpperCase()}. Initial 500₢ & 5 Stat Points credited.`,
      type: 'level',
      credits: 500,
    })
  }

  const logout = () => {
    sound.playAlert()
    setIsAuthenticated(false)
    api.auth.logout().catch(() => {})
    showToast({
      title: `// NEURAL LINK SEVERED`,
      message: `Session terminated. Security protocol engaged.`,
      type: 'info',
    })
  }

  return (
    <RPGContext.Provider
      value={{
        user,
        attributes,
        missions,
        shopItems,
        achievements,
        activityLogs,
        focusSessions,
        toast,
        isAuthenticated,
        avatarState,
        setAvatarState,
        completeMission,
        toggleSubtask,
        allocateStatPoint,
        buyShopItem,
        equipShopItem,
        claimAchievement,
        addCustomMission,
        deleteMission,
        completeFocusSession,
        setPerformanceMode,
        setEnvironmentTheme,
        updateUserProfile,
        toggleSound,
        showToast,
        dismissToast,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </RPGContext.Provider>
  )
}

export const useRPG = () => {
  const context = useContext(RPGContext)
  if (!context) {
    throw new Error('useRPG must be used within an RPGProvider')
  }
  return context
}
