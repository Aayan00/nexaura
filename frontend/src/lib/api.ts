// Nexaura Native Fetch API Client (Strictly No Axios)
import type { Task, UserProfile, Achievement, ShopItem, FocusSession } from '../types/rpg';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: unknown) {
    // Return friendly error or propagate
    console.warn(`[Nexaura API] ${endpoint} request error:`, err);
    throw err;
  }
}

export const api = {
  // Authentication & Session
  auth: {
    getMe: () => request<{ success: boolean; user: UserProfile }>('/auth/me'),
    register: (data: { username: string; email: string; password: string; character_class?: string }) =>
      request<{ success: boolean; message: string; user?: UserProfile }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    signup: (username: string, email: string, password?: string, character_class?: string) =>
      request<{ success: boolean; message: string; user?: UserProfile }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password: password || '', character_class }),
      }),
    login: (usernameOrEmail: string, password?: string) =>
      request<{ success: boolean; message: string; user: UserProfile }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: usernameOrEmail,
          email: usernameOrEmail,
          password: password || '',
        }),
      }),
    logout: () => request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),
  },

  // Tasks & Boss Missions
  tasks: {
    getAll: () => request<{ success: boolean; tasks: Task[] }>('/tasks'),
    create: (data: Partial<Task>) =>
      request<{ success: boolean; task: Task }>('/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Task>) =>
      request<{ success: boolean; task: Task }>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/tasks/${id}`, {
        method: 'DELETE',
      }),
    toggleSubtask: (taskId: string, subtaskId: string) =>
      request<{ success: boolean; task: Task; subtaskCompleted: boolean }>(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
        method: 'PATCH',
      }),
    complete: (id: string) =>
      request<{ success: boolean; task: Task; user: UserProfile; leveledUp: boolean; newAchievements: Achievement[] }>(`/tasks/${id}/complete`, {
        method: 'POST',
      }),
  },

  // User Stats & Character
  user: {
    getProfile: () => request<{ success: boolean; user: UserProfile }>('/user/profile'),
    updateProfile: (data: Partial<UserProfile>) =>
      request<{ success: boolean; user: UserProfile }>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    allocateStat: (stat: 'intelligence' | 'strength' | 'dexterity' | 'vitality' | 'discipline', amount: number = 1) =>
      request<{ success: boolean; user: UserProfile }>('/user/allocate-stat', {
        method: 'POST',
        body: JSON.stringify({ stat, amount }),
      }),
    getHeatmap: () => request<{ success: boolean; heatmap: { date: string; count: number; xp: number }[] }>('/user/heatmap'),
  },

  // Shop & Inventory
  shop: {
    getItems: () => request<{ success: boolean; items: ShopItem[] }>('/shop/items'),
    purchase: (itemId: string) =>
      request<{ success: boolean; user: UserProfile; item: ShopItem }>(`/shop/purchase/${itemId}`, {
        method: 'POST',
      }),
    equip: (itemId: string) =>
      request<{ success: boolean; user: UserProfile; equippedSlot: string }>(`/shop/equip/${itemId}`, {
        method: 'POST',
      }),
  },

  // Achievements
  achievements: {
    getAll: () => request<{ success: boolean; achievements: Achievement[] }>('/achievements'),
    claim: (id: string) =>
      request<{ success: boolean; achievement: Achievement; user: UserProfile }>(`/achievements/${id}/claim`, {
        method: 'POST',
      }),
  },

  // Focus Sessions
  focus: {
    getHistory: () => request<{ success: boolean; sessions: FocusSession[] }>('/focus/history'),
    complete: (durationMinutes: number, taskId?: string, notes?: string) =>
      request<{ success: boolean; session: FocusSession; user: UserProfile; xpGained: number; creditsGained: number }>('/focus/complete', {
        method: 'POST',
        body: JSON.stringify({ durationMinutes, taskId, notes }),
      }),
  },
};
