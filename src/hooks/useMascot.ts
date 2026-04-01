import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef } from 'react'
import { db } from '../db/database'
import type { Mascot } from '../types/workout'
import { todayISO } from '../utils/dateUtils'

const XP_PER_WORKOUT = 20
const XP_PER_LEVEL = 100
const MOOD_DECAY_DAYS = 3

export interface MascotState {
  level: number
  xp: number
  xpToNext: number
  mood: number
  streak: number
  emoji: string
  title: string
  phrase: string
  ascii: string
}

const LEVELS = [
  {
    emoji: '🐒', title: 'Малюк',
    phrase: 'Давай тренуватись!',
    ascii: '   ╭───╮\n  ( •_• )\n   ╰─┬─╯\n     │\n    ╱ ╲',
  },
  {
    emoji: '🐵', title: 'Новачок',
    phrase: 'Непогано, продовжуй!',
    ascii: '   ╭───╮\n  ( •ᴗ• )\n  ╭┤   ├╮\n  │╰───╯│\n  ╱     ╲',
  },
  {
    emoji: '🦍', title: 'Качок',
    phrase: 'Качаємось!',
    ascii: '   ╭━━━╮\n  ( •ᴗ• )\n ╭┫█████┫╮\n ┃ ┃███┃ ┃\n💪╰━━━━━╯💪',
  },
  {
    emoji: '🦧', title: 'BEAST',
    phrase: 'BEAST MODE!',
    ascii: '  ╭━━━━━╮\n ( ⚡ᴗ⚡ )\n╭┫███████┫╮\n┃ ┃█████┃ ┃\n💪╰━━━━━━━╯💪',
  },
  {
    emoji: '👑🦍', title: 'ЛЕГЕНДА',
    phrase: 'ТИ — ЛЕГЕНДА!',
    ascii: '    👑\n  ╭━━━━━╮\n ( ⚡ᴗ⚡ )\n╭┫█████████┫╮\n┃ ┃███████┃ ┃\n💪╰━━━━━━━━━╯💪',
  },
]

function getMascotState(mascot: Mascot): MascotState {
  const lvlIndex = Math.min(mascot.level - 1, LEVELS.length - 1)
  const lvl = LEVELS[Math.max(0, lvlIndex)]
  let phrase = lvl.phrase
  if (mascot.mood <= 1) phrase = 'Сумую за тренуваннями...'
  else if (mascot.mood === 2) phrase = 'Давно не бачились!'

  return {
    level: mascot.level,
    xp: mascot.xp % XP_PER_LEVEL,
    xpToNext: XP_PER_LEVEL,
    mood: mascot.mood,
    streak: mascot.streak,
    emoji: lvl.emoji,
    title: lvl.title,
    phrase,
    ascii: lvl.ascii,
  }
}

// Ensure mascot record exists (run once)
async function ensureMascot(): Promise<void> {
  const count = await db.mascot.count()
  if (count === 0) {
    await db.mascot.add({
      id: 1, level: 1, xp: 0, mood: 3, streak: 0,
      lastWorkoutDate: '', createdAt: new Date().toISOString(),
    })
  }
}

export function useMascot() {
  const initialized = useRef(false)

  // Init mascot once
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      ensureMascot()
    }
  }, [])

  // Read mascot reactively (don't write inside query!)
  const mascot = useLiveQuery(() => db.mascot.get(1))
  const state = mascot ? getMascotState(mascot) : null

  async function onWorkoutComplete() {
    const m = await db.mascot.get(1)
    if (!m) return
    const today = todayISO()
    if (m.lastWorkoutDate === today) return
    const newXp = m.xp + XP_PER_WORKOUT
    const levelUps = Math.floor(newXp / XP_PER_LEVEL)
    await db.mascot.update(1, {
      xp: newXp,
      level: Math.min(m.level + levelUps, LEVELS.length),
      mood: Math.min(5, m.mood + 1),
      streak: m.streak + 1,
      lastWorkoutDate: today,
    })
  }

  async function checkMoodDecay() {
    const m = await db.mascot.get(1)
    if (!m || !m.lastWorkoutDate) return
    const daysSince = Math.floor((Date.now() - new Date(m.lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24))
    const decaySteps = Math.floor(daysSince / MOOD_DECAY_DAYS)
    if (decaySteps > 0) {
      const newMood = Math.max(1, m.mood - decaySteps)
      if (newMood !== m.mood) {
        await db.mascot.update(1, { mood: newMood })
      }
    }
  }

  return { state, onWorkoutComplete, checkMoodDecay }
}
