import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Media } from '@/types/anilist/MediaListCollections'

export const useRankingStore = defineStore('rankings', () => {
  const rankings = ref<Media[]>()

  return { rankings}
})
