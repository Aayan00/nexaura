import { getDB, fallbackStore } from '../config/db.js'

const CATALOG = [
  {
    id: 'cw-1',
    name: 'Neural Cortex Overclocker v4',
    type: 'cyberware',
    rarity: 'Epic',
    price: 1500,
    description: 'Military-grade neural bus implant that boosts cognitive throughput and accelerates XP accumulation.',
    perk: '+15% XP earned from all INT missions',
    icon: 'Cpu',
    slot: 'neural',
  },
  {
    id: 'cw-2',
    name: 'Kiroshi Tactical HUD Optics mk.3',
    type: 'cyberware',
    rarity: 'Legendary',
    price: 3200,
    description: 'Optical scanner suite with high-frequency threat detection and mission priority tracking.',
    perk: '+25% Credit bounty rewards & critical quest highlights',
    icon: 'Eye',
    slot: 'optics',
  },
  {
    id: 'cw-3',
    name: 'Subdermal Titanium Exoweave',
    type: 'cyberware',
    rarity: 'Rare',
    price: 950,
    description: 'Reinforced bio-polymer mesh layered beneath dermis to increase physical load resistance.',
    perk: '+10% STR mission XP & fatigue resistance',
    icon: 'Shield',
    slot: 'subdermal',
  },
  {
    id: 'cw-4',
    name: 'Synaptic Bio-Monitor Pro',
    type: 'cyberware',
    rarity: 'Epic',
    price: 1800,
    description: 'Continuous biometric telemetry engine providing instant vitality and cortisol feedback.',
    perk: 'Protects streak from resetting on 1 missed day',
    icon: 'Activity',
    slot: 'biomonitor',
  },
  {
    id: 'th-1',
    name: 'Cyan Void [Default]',
    type: 'theme',
    rarity: 'Common',
    price: 0,
    description: 'The standard issue high-contrast electric cyan operating system interface.',
    perk: 'Default Nexaura.exe OS aesthetic',
    icon: 'Palette',
    previewColor: '#00f0ff',
  },
  {
    id: 'th-2',
    name: 'Neo-Tokyo Magenta',
    type: 'theme',
    rarity: 'Rare',
    price: 800,
    description: 'Radiant synthwave magenta HUD skin with deep violet ambient glows.',
    perk: 'Custom glowing magenta HUD accents',
    icon: 'Sparkles',
    previewColor: '#ff007f',
  },
  {
    id: 'th-3',
    name: 'Amber Terminal Fallout',
    type: 'theme',
    rarity: 'Epic',
    price: 1400,
    description: 'Retro-futuristic amber CRT phosphor aesthetic with CRT distortion shader simulation.',
    perk: 'Amber phosphor matrix & vintage telemetry font',
    icon: 'Terminal',
    previewColor: '#facc15',
  },
  {
    id: 'th-4',
    name: 'Matrix Emerald Protocol',
    type: 'theme',
    rarity: 'Legendary',
    price: 2500,
    description: 'Cascading digital rain green palette favored by elite rogue network operatives.',
    perk: 'Digital matrix particle backdrop & emerald glows',
    icon: 'Zap',
    previewColor: '#10b981',
  },
  {
    id: 'tt-1',
    name: 'Title: Ghost In The Wire',
    type: 'title',
    rarity: 'Rare',
    price: 600,
    description: 'Awarded to operatives who slip undetected through high-stakes codebases.',
    perk: 'Display title under operative profile HUD',
    icon: 'Award',
  },
  {
    id: 'tt-2',
    name: 'Title: Shadow Architect',
    type: 'title',
    rarity: 'Epic',
    price: 1200,
    description: 'Title carried by high-level system designers and autonomous agent builders.',
    perk: '+5% global INT & DIS scaling multiplier',
    icon: 'Crown',
  },
  {
    id: 'tt-3',
    name: 'Title: Night City Apex',
    type: 'title',
    rarity: 'Legendary',
    price: 3500,
    description: 'The supreme designation given only to legendary life-RPG operatives.',
    perk: 'Gold glowing border badge & prestige fanfare',
    icon: 'Flame',
  },
]

export async function getShopCatalog(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const inv = fallbackStore.inventory.filter((i) => i.user_id === userId || i.user_id === 1)
      const items = CATALOG.map((catItem) => {
        const ownedItem = inv.find((i) => i.item_id === catItem.id)
        return {
          ...catItem,
          owned: Boolean(ownedItem) || catItem.price === 0,
          equipped: Boolean(ownedItem?.equipped) || (catItem.id === 'th-1' && !inv.some((i) => i.item_id.startsWith('th-') && i.equipped)),
        }
      })
      return res.json({ success: true, items })
    }

    const [invRows] = await pool.query('SELECT * FROM inventory WHERE user_id = ?', [userId])
    const items = CATALOG.map((catItem) => {
      const ownedItem = invRows.find((i) => i.item_id === catItem.id)
      return {
        ...catItem,
        owned: Boolean(ownedItem) || catItem.price === 0,
        equipped: Boolean(ownedItem?.equipped) || (catItem.id === 'th-1' && !invRows.some((i) => i.item_id.startsWith('th-') && i.equipped)),
      }
    })

    res.json({ success: true, items })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function purchaseItem(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { itemId } = req.body
    const targetItem = CATALOG.find((i) => i.id === itemId)
    if (!targetItem) return res.status(404).json({ error: 'Item not in Black Market catalog' })

    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const user = fallbackStore.users.find((u) => u.id === userId) || fallbackStore.users[0]
      if (user.credits < targetItem.price) {
        return res.status(400).json({ error: 'Insufficient credits' })
      }

      user.credits -= targetItem.price
      const existing = fallbackStore.inventory.find((i) => i.user_id === user.id && i.item_id === itemId)
      if (!existing) {
        fallbackStore.inventory.push({
          id: fallbackStore.inventory.length + 1,
          user_id: user.id,
          item_id: itemId,
          equipped: 1,
        })
      }

      fallbackStore.activity_logs.unshift({
        id: fallbackStore.activity_logs.length + 1,
        user_id: user.id,
        type: 'shop',
        title: 'Black Market Acquisition',
        details: `Acquired ${targetItem.name} for ${targetItem.price} Credits.`,
        xp_gained: 0,
        credits_gained: -targetItem.price,
        created_at: new Date().toISOString(),
      })

      return res.json({ success: true, user, item: targetItem })
    }

    const [userRows] = await pool.query('SELECT credits FROM users WHERE id = ?', [userId])
    if (userRows[0].credits < targetItem.price) {
      return res.status(400).json({ error: 'Insufficient credits' })
    }

    await pool.query('UPDATE users SET credits = credits - ? WHERE id = ?', [targetItem.price, userId])
    await pool.query(
      `INSERT INTO inventory (user_id, item_id, equipped)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE equipped = 1`,
      [userId, itemId]
    )

    await pool.query(
      `INSERT INTO activity_logs (user_id, type, title, details, credits_gained)
       VALUES (?, 'shop', 'Black Market Acquisition', ?, ?)`,
      [userId, `Acquired ${targetItem.name} for ${targetItem.price} Credits.`, -targetItem.price]
    )

    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    res.json({ success: true, user: updatedUser[0], item: targetItem })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function equipItem(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { itemId } = req.body
    const targetItem = CATALOG.find((i) => i.id === itemId)
    if (!targetItem) return res.status(404).json({ error: 'Item not found' })

    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const inv = fallbackStore.inventory.find((i) => i.user_id === userId && i.item_id === itemId)
      if (inv) {
        inv.equipped = inv.equipped ? 0 : 1
      }
      return res.json({ success: true, item: targetItem })
    }

    await pool.query(
      `UPDATE inventory SET equipped = NOT equipped WHERE user_id = ? AND item_id = ?`,
      [userId, itemId]
    )

    res.json({ success: true, item: targetItem })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
