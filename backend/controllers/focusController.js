import { isDBConnected, query, memoryStore } from '../db.js';

export const focusController = {
  getHistory: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');

      if (isDBConnected()) {
        const sessions = await query('SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY completed_at DESC', [userId]);
        return res.json({
          success: true,
          sessions: (sessions || []).map((s) => ({
            id: s.id,
            taskId: s.task_id,
            durationMinutes: s.duration_minutes,
            notes: s.notes,
            xpGained: s.xp_gained,
            creditsGained: s.credits_gained,
            completedAt: s.completed_at,
          })),
        });
      } else {
        return res.json({
          success: true,
          sessions: memoryStore.focus_sessions.map((s) => ({
            id: s.id,
            taskId: s.task_id,
            durationMinutes: s.duration_minutes,
            notes: s.notes,
            xpGained: s.xp_gained,
            creditsGained: s.credits_gained,
            completedAt: s.completed_at,
          })),
        });
      }
    } catch (err) {
      console.error('[Focus getHistory Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch focus session telemetry.' });
    }
  },

  completeSession: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');
      const { durationMinutes = 25, taskId = null, notes = '' } = req.body;

      const xpGained = Math.round(durationMinutes * 2); // e.g. 25m = 50 XP
      const creditsGained = Math.round(durationMinutes * 0.8); // e.g. 25m = 20 Credits
      const sessionId = 'foc_' + Date.now();
      const completedAt = new Date().toISOString();

      let stats = null;

      if (isDBConnected()) {
        await query(
          'INSERT INTO focus_sessions (id, user_id, task_id, duration_minutes, notes, xp_gained, credits_gained, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [sessionId, userId, taskId, durationMinutes, notes, xpGained, creditsGained, completedAt]
        );

        const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        if (userStats && userStats.length > 0) stats = userStats[0];

        const newXP = (stats?.xp || 0) + xpGained;
        const newCredits = (stats?.credits || 500) + creditsGained;

        await query('UPDATE user_stats SET xp = ?, credits = ? WHERE user_id = ?', [newXP, newCredits, userId]);
        await query('INSERT INTO activity_logs (id, user_id, type, description, xp_delta, credits_delta) VALUES (?, ?, ?, ?, ?, ?)', [
          'act_' + Date.now(),
          userId,
          'FOCUS_SESSION',
          `Logged ${durationMinutes}m deep work focus session.`,
          xpGained,
          creditsGained,
        ]);
      } else {
        memoryStore.focus_sessions.unshift({
          id: sessionId,
          user_id: userId,
          task_id: taskId,
          duration_minutes: durationMinutes,
          notes,
          xp_gained: xpGained,
          credits_gained: creditsGained,
          completed_at: completedAt,
        });

        stats = memoryStore.user_stats.find((s) => s.user_id === userId) || memoryStore.user_stats[0];
        if (stats) {
          stats.xp = (stats.xp || 0) + xpGained;
          stats.credits = (stats.credits || 500) + creditsGained;
        }

        memoryStore.activity_logs.unshift({
          id: 'act_' + Date.now(),
          user_id: userId,
          type: 'FOCUS_SESSION',
          description: `Logged ${durationMinutes}m deep work focus session.`,
          xp_delta: xpGained,
          credits_delta: creditsGained,
          created_at: completedAt,
        });
      }

      return res.json({
        success: true,
        message: `Focus Chamber Complete! +${xpGained} XP, +${creditsGained} Credits!`,
        session: {
          id: sessionId,
          durationMinutes,
          taskId,
          notes,
          xpGained,
          creditsGained,
          completedAt,
        },
        xpGained,
        creditsGained,
      });
    } catch (err) {
      console.error('[Focus completeSession Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to record focus session.' });
    }
  },
};
