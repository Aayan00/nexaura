export type AttributeType = 'INT' | 'STR' | 'DEX' | 'VIT' | 'DIS'

export interface AttributeData {
  code: AttributeType
  name: string
  fullName: string
  value: number
  level: number
  description: string
  perk: string
  color: string
  glowColor: string
}

export type MissionRank = 'D' | 'C' | 'B' | 'A' | 'S'
export type MissionCategory = 'Coding' | 'Study' | 'Fitness' | 'Health' | 'Personal' | 'Creative' | 'Habits' | 'Project' | 'daily' | 'main' | 'bounty'
export type MissionPriority = 'critical' | 'high' | 'medium' | 'low'
export type MissionStatus = 'pending' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'expired'

export interface Subtask {
  id: number
  task_id?: number | string
  title: string
  completed: number | boolean
}

export interface Mission {
  id: string | number
  title: string
  description: string
  attribute: AttributeType
  rank: MissionRank
  category: MissionCategory
  priority?: MissionPriority
  status?: MissionStatus
  xpReward: number
  creditReward: number
  statPoints: number
  completed: boolean
  completedAt?: string
  difficultyLabel?: string
  dueDate?: string
  estimatedDuration?: number
  isBoss?: boolean | number
  recurrence?: string
  isCustom?: boolean
  subtasks?: Subtask[]
  // Compatibility with backend task schema:
  stat_type?: string
  difficulty?: string
  xp_reward?: number
  credit_reward?: number
  is_boss?: number | boolean
  created_at?: string
}

export type Task = Mission

export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary'
export type ItemType = 'cyberware' | 'theme' | 'avatar' | 'title' | 'audio'

export interface ShopItem {
  id: string
  name: string
  type: ItemType
  rarity: ItemRarity
  price: number
  description: string
  perk: string
  icon: string
  owned: boolean
  equipped: boolean
  previewColor?: string
  slot?: 'neural' | 'optics' | 'subdermal' | 'biomonitor'
}

export type AchievementCategory = 'combat' | 'neural' | 'protocol' | 'market'

export interface Achievement {
  id: string
  title: string
  category: AchievementCategory
  description: string
  current: number
  max: number
  unlocked: boolean
  claimed: boolean
  xpReward: number
  creditReward: number
  icon: string
}

export interface FocusSession {
  id: number
  task_id?: number | null
  duration_minutes: number
  session_type: string
  xp_earned: number
  completed: boolean | number
  created_at: string
}

export interface ActivityLog {
  id: string | number
  timestamp?: string
  created_at?: string
  title: string
  details: string
  type: 'mission' | 'level' | 'stat' | 'shop' | 'achievement'
  xpGained?: number
  creditsGained?: number
  xp_gained?: number
  credits_gained?: number
}

export interface UserProfile {
  id?: number
  username: string
  title: string
  level: number
  currentXP: number
  maxXP: number
  credits: number
  streakDays: number
  longestStreak?: number
  operativeClass: string
  unassignedPoints: number
  avatarUrl?: string
  soundEnabled: boolean
  systemOnline?: boolean
  theme: string
  performanceMode?: 'ultra' | 'balanced' | 'low'
  environment?: 'city' | 'space' | 'matrix' | 'neon' | 'amber' | 'void'
}
