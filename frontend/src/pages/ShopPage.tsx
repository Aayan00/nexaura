import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Coins,
  Cpu,
  Palette,
  Award,
  Check,
  Sparkles,
  ShoppingBag,
  Shield,
  Eye,
  Activity,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { GlassPanel } from '../components/GlassPanel'
import { NeonButton } from '../components/NeonButton'
import { useRPG } from '../context/RPGContext'
import type { ItemType, ItemRarity } from '../types/rpg'
import { cn } from '../lib/utils'

export const ShopPage: React.FC = () => {
  const { user, shopItems, buyShopItem, equipShopItem } = useRPG()
  const [activeTab, setActiveTab] = useState<'all' | ItemType>('all')

  const filteredItems = shopItems.filter((item) => {
    if (activeTab === 'all') return true
    return item.type === activeTab
  })

  const getRarityBadge = (rarity: ItemRarity) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(250,204,21,0.5)]'
      case 'Epic':
        return 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
      case 'Rare':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.5)]'
      case 'Common':
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700'
    }
  }

  const getItemIcon = (name: string, type: ItemType) => {
    if (name.includes('Optics') || name.includes('HUD')) return <Eye className="w-6 h-6 text-cyan-400" />
    if (name.includes('Titanium') || name.includes('Subdermal')) return <Shield className="w-6 h-6 text-purple-400" />
    if (name.includes('Bio-Monitor')) return <Activity className="w-6 h-6 text-pink-400" />
    if (type === 'theme') return <Palette className="w-6 h-6 text-amber-400" />
    if (type === 'title') return <Award className="w-6 h-6 text-emerald-400" />
    return <Cpu className="w-6 h-6 text-cyan-400" />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        sectionCode="SEC_04_BLACK_MARKET"
        title="CYBERNETIC BLACK MARKET"
        subtitle="Trade earned habit credits for military-grade neural cyberware, holographic avatars, and custom HUD interfaces."
        actions={
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-sm font-bold shadow-[0_0_15px_rgba(250,204,21,0.2)]">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>AVAILABLE CREDITS: {user.credits.toLocaleString()} ₢</span>
          </div>
        }
      />

      {/* Category Navigation Tabs */}
      <GlassPanel variant="default" className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'ALL INVENTORY', icon: ShoppingBag },
            { id: 'cyberware', label: 'CYBERWARE IMPLANTS', icon: Cpu },
            { id: 'theme', label: 'HUD SKINS & THEMES', icon: Palette },
            { id: 'title', label: 'OPERATIVE TITLES', icon: Award },
          ].map((tab) => {
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-md font-rajdhani text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800'
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </GlassPanel>

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const canAfford = user.credits >= item.price
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="relative"
            >
              <GlassPanel
                variant={item.owned ? 'purple' : item.rarity === 'Legendary' ? 'amber' : 'cyan'}
                className="p-5 h-full flex flex-col justify-between space-y-4"
              >
                {/* Top Rarity & Type */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-mono border font-black uppercase tracking-wider',
                        getRarityBadge(item.rarity)
                      )}
                    >
                      {item.rarity}
                    </span>

                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {item.type}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-2.5">
                    <div className="p-3 rounded-lg bg-[#060a14] border border-slate-800 shrink-0">
                      {getItemIcon(item.name, item.type)}
                    </div>
                    <div>
                      <h4 className="font-orbitron text-sm font-bold text-slate-100 tracking-wide">
                        {item.name}
                      </h4>
                      {item.previewColor && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-slate-400">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-sm"
                            style={{ backgroundColor: item.previewColor }}
                          />
                          <span>HUD Accent: {item.previewColor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-sans text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Perk Badge */}
                <div className="p-2.5 rounded bg-[#060914] border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="leading-tight">{item.perk}</span>
                </div>

                {/* Bottom Action & Price */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="font-mono text-sm font-bold">
                    {item.price === 0 ? (
                      <span className="text-emerald-400">FREE BASE</span>
                    ) : (
                      <span className="text-amber-300 flex items-center gap-1">
                        <Coins className="w-4 h-4 text-amber-400" />
                        {item.price.toLocaleString()} ₢
                      </span>
                    )}
                  </div>

                  {item.owned ? (
                    <NeonButton
                      variant={item.equipped ? 'purple' : 'ghost'}
                      size="sm"
                      onClick={() => equipShopItem(item.id)}
                      leftIcon={item.equipped ? <Check className="w-3.5 h-3.5" /> : undefined}
                    >
                      {item.equipped ? 'EQUIPPED' : 'EQUIP ITEM'}
                    </NeonButton>
                  ) : (
                    <NeonButton
                      variant={canAfford ? 'cyan' : 'ghost'}
                      size="sm"
                      disabled={!canAfford}
                      onClick={() => buyShopItem(item.id)}
                    >
                      {canAfford ? 'PURCHASE' : 'LOCKED (INSUFFICIENT)'}
                    </NeonButton>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
