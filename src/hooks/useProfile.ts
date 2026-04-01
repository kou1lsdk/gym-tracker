import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import type { UserProfile } from '../types/workout'

export function useProfile() {
  const profile = useLiveQuery(() => db.userProfile.get(1))
  const isLoading = profile === undefined

  async function saveProfile(data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const existing = await db.userProfile.get(1)
    if (existing) {
      await db.userProfile.update(1, { ...data, updatedAt: now })
    } else {
      await db.userProfile.add({ ...data, id: 1, createdAt: now, updatedAt: now } as UserProfile)
    }
  }

  return { profile: profile ?? null, isLoading, saveProfile }
}
