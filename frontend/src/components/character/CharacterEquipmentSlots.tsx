import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Shield, Layers, Footprints } from 'lucide-react'
import { sound } from '../../lib/sound'

export type EquipmentSlotId = 'head' | 'chest' | 'pants' | 'boots'

interface EquipmentSlotDef {
  id: EquipmentSlotId
  label: string
  slotName: string
  itemName: string
  rarity: string
  icon: React.ComponentType<{ className?: string }>
}

interface CharacterEquipmentSlotsProps {
  selectedSlot: EquipmentSlotId | null
  onSelectSlot: (slot: EquipmentSlotId) => void
}

const EQUIPMENT_SLOTS: EquipmentSlotDef[] = [
  {
    id: 'head',
    label: 'HEAD / HOOD',
    slotName: 'Cranial Rig',
    itemName: 'Carbon-Mesh Respirator',
    rarity: 'LEGENDARY',
    icon: Eye,
  },
  {
    id: 'chest',
    label: 'CHEST ARMOR',
    slotName: 'Thoracic Plate',
    itemName: 'Arasaka Nano-Weave Vest',
    rarity: 'EPIC',
    icon: Shield,
  },
  {
    id: 'pants',
    label: 'PANTS',
    slotName: 'Leg Chassis',
    itemName: 'Modular Techwear Cargo',
    rarity: 'RARE',
    icon: Layers,
  },
  {
    id: 'boots',
    label: 'BOOTS',
    slotName: 'Kinetic Base',
    itemName: 'High-Impact Exo Boots',
    rarity: 'EPIC',
    icon: Footprints,
  },
]

export const CharacterEquipmentSlots: React.FC<CharacterEquipmentSlotsProps> = ({
  selectedSlot,
  onSelectSlot,
}) => {
  return (
    <div className="flex flex-col gap-2.5 z-20">
      <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/80 mb-0.5 text-center hidden sm:block">
        [EQUIP]
      </div>
      {EQUIPMENT_SLOTS.map((slot) => {
        const isSelected = selectedSlot === slot.id
        const IconComponent = slot.icon

        return (
          <div key={slot.id} className="relative group">
            {/* Slot Box Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                sound.playClick()
                onSelectSlot(slot.id)
              }}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-cyan-500/25 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_18px_rgba(0,229,255,0.6)]'
                  : 'bg-[#050816]/85 border border-cyan-500/35 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,229,255,0.3)]'
              }`}
              title={slot.label}
            >
              <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />

              {/* Selected indicator dot */}
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
              )}
            </motion.button>

            {/* Hover Floating Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col items-end pointer-events-none z-30 whitespace-nowrap">
              <div className="px-2.5 py-1.5 rounded-lg bg-[#050816]/95 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.3)] backdrop-blur-md">
                <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  {slot.label}
                </div>
                <div className="text-xs font-mono font-bold text-slate-100">
                  {slot.itemName}
                </div>
                <div className="text-[9px] font-mono text-pink-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block" />
                  {slot.rarity} // {slot.slotName}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
