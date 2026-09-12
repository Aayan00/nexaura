# ⚡ Nexaura.exe // Upgrade Your Reality.

> **Cyberpunk Life-RPG Operating System** that converts real-world tasks, habits, and daily routines into high-stakes gamified missions. Complete directives, earn XP & Credits, level up, upgrade 5 core human attributes (INT, STR, DEX, VIT, DIS), maintain streaks, unlock trophies, and trade credits in the Black Market.

---

## 🌌 Core Features & Systems

### 1. 🧬 5 Core Human Attributes
- **INT (Intellect)**: Technical mastery, deep work sprints, coding, and knowledge synthesis (+XP perks).
- **STR (Strength)**: Hypertrophy conditioning, physical power, and workout volume (+Credit perks).
- **DEX (Dexterity)**: Habit stacking speed, reflex agility, and fast backlog execution (+Bounty slots).
- **VIT (Vitality)**: Sleep hygiene, hydration matrix, and biometric resilience (+Streak protection).
- **DIS (Discipline)**: Willpower core, digital distraction blackout, and unbroken daily streaks (+Multiplier boosts).

### 2. 🎯 Quest & Directive Matrix (`/missions`)
- Categorized by **Daily Protocols**, **Primary Directives (Main Quests)**, and **Bounty Targets**.
- Ranked by difficulty: **S-Rank**, **A-Rank**, **B-Rank**, **C-Rank**, and **D-Rank**.
- Dynamic custom mission logger with custom rank, category, and attribute tag allocation.
- Interactive completion with instant XP/Credit feedback and celebration particle engine.

### 3. 🛡️ Operative Dossier (`/character`)
- 3D holographic avatar preview with animated cyberpunk status rings.
- Overall Operative Power Rating formula.
- **Unassigned Stat Point Allocation Center** (gain +3 stat points on every level up to inject into any attribute).
- 4 Modular Cyberware Augment Sockets: *Neural Bus*, *Tactical HUD Optics*, *Subdermal Titanium Weave*, and *Bio-Telemetry Monitor*.

### 4. 🛒 The Black Market (`/shop`)
- Real-time Credit currency expenditure.
- Unlockable HUD Themes (*Cyan Void*, *Neo-Tokyo Magenta*, *Amber Fallout Terminal*, *Matrix Emerald Protocol*).
- Military-grade Cyberware augments and prestigious Operative Titles.
- Dynamic equip/unequip functionality with live state persistence.

### 5. 🏆 Milestones & Accolades (`/achievements`)
- Track milestone progress across Combat, Neural, Protocol/Streak, and Market tiers.
- Claimable reward payouts with celebration fireworks and level-up audio triggers.

### 6. 🔊 Web Audio Synthesizer Engine
- Zero-external-asset Web Audio API retro-futuristic sound effects (clicks, mission completions, level-up arpeggios, credit transactions, stat surges) with master HUD mute toggle.

---

## 🛠️ Technology Stack

- **React 19**
- **Vite**
- **Tailwind CSS v4** + Custom Cyberpunk Design System
- **Framer Motion** (Spring animations, layout transitions)
- **Lucide React** (Cyber icons)
- **React Router v7**
- **Canvas Confetti**

---

## 🚀 Quickstart Guide

### 1. Enter Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

Visit **`http://127.0.0.1:5173/`** in your browser to experience **Nexaura.exe**.

### 4. Production Build
```bash
npm run build
```

---

## ⚡ Demo Showcase Account & Security Notice

Nexaura includes a dedicated, preconfigured showcase account at maximum operative level (Level 50, all attributes at 99, 99,999 Credits, all achievements unlocked and claimed, all Black Market cyberware equipped, completed directives, and vanquished S-Tier boss battle).

### Demo Credentials (Development & Showcase Only)
- **Operative Callsign**: `demo_netrunner` (or email: `demo@nexaura.exe`)
- **Cybernetic Passkey**: Configured in `backend/.env` under `DEMO_PASSWORD` (default: `SetYourDemoPasswordHere`)

> [!WARNING]
> **Production Deployment Security Warning**:
> The demo account credentials (`DEMO_PASSWORD`) are strictly for local showcase and development demonstration. You **MUST** change `DEMO_PASSWORD` in `backend/.env` to a secure secret or disable the demo account before deploying Nexaura.exe to any public or production environment.
