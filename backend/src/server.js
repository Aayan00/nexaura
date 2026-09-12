import express from 'express'
import session from 'express-session'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDB } from './config/db.js'

import * as authCtrl from './controllers/authController.js'
import * as taskCtrl from './controllers/taskController.js'
import * as userCtrl from './controllers/userController.js'
import * as shopCtrl from './controllers/shopController.js'
import * as achCtrl from './controllers/achievementController.js'
import * as focusCtrl from './controllers/focusController.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS setup to allow frontend requests
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'nexaura_cyber_secret_0x89',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
)

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Nexaura.exe Core Engine',
    timestamp: new Date().toISOString(),
    version: '4.2.0_CYBER_RPG',
  })
})

// Authentication Routes
app.post('/api/auth/signup', authCtrl.signup)
app.post('/api/auth/login', authCtrl.login)
app.post('/api/auth/logout', authCtrl.logout)
app.get('/api/auth/me', authCtrl.getMe)

// Tasks & Missions Routes
app.get('/api/tasks', taskCtrl.getTasks)
app.post('/api/tasks', taskCtrl.createTask)
app.put('/api/tasks/:id', taskCtrl.updateTask)
app.delete('/api/tasks/:id', taskCtrl.deleteTask)
app.patch('/api/tasks/:id/complete', taskCtrl.completeTask)
app.post('/api/tasks/:id/complete', taskCtrl.completeTask)
app.patch('/api/tasks/:id/status', taskCtrl.setTaskStatus)

// Subtasks Routes
app.post('/api/tasks/:id/subtasks', taskCtrl.addSubtask)
app.patch('/api/subtasks/:id', taskCtrl.toggleSubtask)
app.patch('/api/tasks/:id/subtasks/:subtaskId/toggle', taskCtrl.toggleSubtask)
app.delete('/api/subtasks/:id', taskCtrl.deleteSubtask)

// User & Analytics Routes
app.get('/api/user/profile', userCtrl.getUserProfile)
app.get('/api/user/stats', userCtrl.getUserStats)
app.post('/api/user/allocate-stat', userCtrl.allocateStat)
app.get('/api/user/analytics', userCtrl.getUserAnalytics)
app.get('/api/user/heatmap', userCtrl.getUserAnalytics)
app.get('/api/user/activity', userCtrl.getUserActivity)

// Shop & Black Market Routes
app.get('/api/shop', shopCtrl.getShopCatalog)
app.get('/api/shop/items', shopCtrl.getShopCatalog)
app.post('/api/shop/purchase', shopCtrl.purchaseItem)
app.post('/api/shop/purchase/:id', (req, res) => {
  req.body.itemId = req.params.id
  return shopCtrl.purchaseItem(req, res)
})
app.post('/api/shop/equip', shopCtrl.equipItem)
app.post('/api/shop/equip/:id', (req, res) => {
  req.body.itemId = req.params.id
  return shopCtrl.equipItem(req, res)
})

// Achievements Routes
app.get('/api/achievements', achCtrl.getAchievements)
app.post('/api/achievements/:id/claim', achCtrl.claimAchievement)

// Focus Mode Routes
app.post('/api/focus/start', focusCtrl.startFocusSession)
app.post('/api/focus/complete', focusCtrl.completeFocusSession)
app.get('/api/focus/history', focusCtrl.getFocusHistory)

// Start Server & Initialize Database
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[SYS_INIT] Nexaura.exe Backend Engine listening on http://127.0.0.1:${PORT}`)
  })
})
