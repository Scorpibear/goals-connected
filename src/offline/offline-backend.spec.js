import { OfflineBackend } from './offline-backend'
import { vi } from 'vitest'

describe('OfflineBackend', () => {
  describe('defaultInstance', () => {
    it('returns the same instance', () => {
      const instance1 = OfflineBackend.getDefaultInstance()
      const instance2 = OfflineBackend.getDefaultInstance()
      expect(instance1).toBe(instance2)
    })
  })
  describe('getTimeline', () => {
    it('returns the timeline', () => {
      const timeline = OfflineBackend.getDefaultInstance().getTimeline()
      expect('length' in timeline).toBeTruthy()
    })
    it('loads goals from localstorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue('[]')
    })
    it('calls offline/timeline/index default function')
    afterEach(() => {
      vi.clearAllMocks()
    })
  })
})
