import { isDBConnected, query, memoryStore } from '../db.js';

const SHOP_CATALOG = [
  {
    id: 'cw_01',
    name: 'Neural Co-Processor V2',
    description: 'Advanced cranial overclock unit. Boosts task throughput and INT calculation speed.',
    price: 450,
    type: 'cyberware',
    slot: 'implant',
    rarity: 'Rare',
    stats: '+5 INT, +10% Focus XP',
    icon: 'Cpu',
  },
  {
    id: 'cw_02',
    name: 'Titanium Exosuit Bracing',
    description: 'Reinforced spinal titanium chassis. Enhances physical stability and stamina.',
    price: 600,
    type: 'cyberware',
    slot: 'armor',
    rarity: 'Epic',
    stats: '+8 STR, +15% HP Shield',
    icon: 'Shield',
  },
  {
    id: 'cw_03',
    name: 'Ocular HUD Mark IV',
    description: 'Tactical eye implant providing real-time telemetry and target acquisition.',
    price: 350,
    type: 'cyberware',
    slot: 'implant',
    rarity: 'Rare',
    stats: '+4 DEX, +5% Crit Reward',
    icon: 'Eye',
  },
  {
    id: 'th_01',
    name: 'Neon Cyan Protocol',
    description: 'Electric azure HUD theme with high-intensity scanlines.',
    price: 200,
    type: 'theme',
    slot: 'hud',
    rarity: 'Common',
    stats: 'Aesthetic: Neon Cyan',
    icon: 'Palette',
  },
  {
    id: 'th_02',
    name: 'Cyber Magenta Matrix',
    description: 'Synthwave hot pink and deep neural purple aesthetic.',
    price: 250,
    type: 'theme',
    slot: 'hud',
    rarity: 'Rare',
    stats: 'Aesthetic: Cyber Magenta',
    icon: 'Palette',
  },
  {
    id: 'th_03',
    name: 'Amber Industrial Reactor',
    description: 'High-contrast hazard amber core UI with gold glow accents.',
    price: 300,
    type: 'theme',
    slot: 'hud',
    rarity: 'Epic',
    stats: 'Aesthetic: Amber Gold',
    icon: 'Palette',
  },
  {
    id: 'tit_01',
    name: 'Callsign: Ghost Operative',
    description: 'Classified shadow operative designation.',
    price: 500,
    type: 'title',
    slot: 'title',
    rarity: 'Legendary',
    stats: 'Title Unlock',
    icon: 'Award',
  },
  {
    id: 'tit_02',
    name: 'Callsign: Cyber SamurAI',
    description: 'Elite martial ronin title of the Neo-Tokyo underground.',
    price: 750,
    type: 'title',
    slot: 'title',
    rarity: 'Legendary',
    stats: 'Title Unlock',
    icon: 'Award',
  },
];

export const shopController = {
  getItems: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');
      let userInventory = [];

      if (isDBConnected()) {
        const inv = await query('SELECT * FROM inventory WHERE user_id = ?', [userId]);
        userInventory = inv || [];
      } else {
        userInventory = memoryStore.inventory.filter((i) => i.user_id === userId);
      }

      const items = SHOP_CATALOG.map((item) => {
        const ownedRecord = userInventory.find((inv) => inv.item_id === item.id);
        return {
          ...item,
          owned: Boolean(ownedRecord),
          equipped: Boolean(ownedRecord?.equipped),
        };
      });

      return res.json({ success: true, items });
    } catch (err) {
      console.error('[Shop getItems Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to access Black Market catalogue.' });
    }
  },

  buyItem: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');
      const { id } = req.params;
      const itemId = id || req.body.itemId;

      const item = SHOP_CATALOG.find((i) => i.id === itemId);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found in Black Market registry.' });
      }

      let stats = null;
      let userInventory = [];

      if (isDBConnected()) {
        const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        if (userStats && userStats.length > 0) stats = userStats[0];
        userInventory = (await query('SELECT * FROM inventory WHERE user_id = ?', [userId])) || [];
      } else {
        stats = memoryStore.user_stats.find((s) => s.user_id === userId) || memoryStore.user_stats[0];
        userInventory = memoryStore.inventory.filter((i) => i.user_id === userId);
      }

      const alreadyOwned = userInventory.some((i) => i.item_id === itemId);
      if (alreadyOwned) {
        return res.status(400).json({ success: false, message: 'Item is already in your inventory.' });
      }

      const currentCredits = stats?.credits || 0;
      if (currentCredits < item.price) {
        return res.status(400).json({
          success: false,
          message: `Insufficient Credits! Required: ₢${item.price}, Available: ₢${currentCredits}`,
        });
      }

      const newCredits = currentCredits - item.price;
      const invId = 'inv_' + Date.now();

      if (isDBConnected()) {
        await query('UPDATE user_stats SET credits = ? WHERE user_id = ?', [newCredits, userId]);
        await query('INSERT INTO inventory (id, user_id, item_id, equipped) VALUES (?, ?, ?, false)', [
          invId,
          userId,
          itemId,
        ]);
        await query('INSERT INTO activity_logs (id, user_id, type, description, credits_delta) VALUES (?, ?, ?, ?, ?)', [
          'act_' + Date.now(),
          userId,
          'PURCHASE',
          `Acquired Black Market item: "${item.name}"`,
          -item.price,
        ]);
      } else {
        stats.credits = newCredits;
        memoryStore.inventory.push({ id: invId, user_id: userId, item_id: itemId, equipped: false, purchased_at: new Date().toISOString() });
        memoryStore.activity_logs.unshift({
          id: 'act_' + Date.now(),
          user_id: userId,
          type: 'PURCHASE',
          description: `Acquired Black Market item: "${item.name}"`,
          credits_delta: -item.price,
          created_at: new Date().toISOString(),
        });
      }

      return res.json({
        success: true,
        message: `Acquired ${item.name}! ₢${item.price} deducted.`,
        item: { ...item, owned: true, equipped: false },
        credits: newCredits,
      });
    } catch (err) {
      console.error('[Shop buyItem Error]:', err);
      return res.status(500).json({ success: false, message: 'Transaction error during purchase.' });
    }
  },

  equipItem: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');
      const { id } = req.params;
      const itemId = id || req.body.itemId;

      const item = SHOP_CATALOG.find((i) => i.id === itemId);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found.' });
      }

      if (isDBConnected()) {
        // Toggle equipped
        const inv = await query('SELECT * FROM inventory WHERE user_id = ? AND item_id = ?', [userId, itemId]);
        if (!inv || inv.length === 0) {
          return res.status(400).json({ success: false, message: 'Must purchase item before equipping.' });
        }
        const nowEquipped = !inv[0].equipped;
        await query('UPDATE inventory SET equipped = ? WHERE user_id = ? AND item_id = ?', [nowEquipped, userId, itemId]);

        if (item.type === 'theme' && nowEquipped) {
          const themeName = item.id === 'th-2' || item.id === 'th_02' ? 'magenta' : item.id === 'th-3' || item.id === 'th_03' ? 'amber' : 'neon-cyan';
          await query('UPDATE user_stats SET theme = ? WHERE user_id = ?', [themeName, userId]);
        }
      } else {
        const record = memoryStore.inventory.find((i) => i.user_id === userId && i.item_id === itemId);
        if (!record) {
          return res.status(400).json({ success: false, message: 'Must purchase item before equipping.' });
        }
        record.equipped = !record.equipped;
        if (item.type === 'theme' && record.equipped) {
          const themeName = item.id === 'th-2' || item.id === 'th_02' ? 'magenta' : item.id === 'th-3' || item.id === 'th_03' ? 'amber' : 'neon-cyan';
          const stats = memoryStore.user_stats.find((s) => s.user_id === userId) || memoryStore.user_stats[0];
          if (stats) stats.theme = themeName;
        }
      }

      return res.json({
        success: true,
        message: `${item.name} status updated.`,
        itemId,
      });
    } catch (err) {
      console.error('[Shop equipItem Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to update equipment.' });
    }
  },
};
