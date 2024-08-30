// services/backend-selector.spec.js
import BackendSelector from './backend-selector'
import { vi } from 'vitest'

describe('BackendSelector', () => {
  describe('getBackend', () => {
    const setLocationSearch = (search) => {
      Object.defineProperty(window, 'location', {
        value: {
          search
        }
      })
    }

    it('returns a backend', () => {
      const backend = BackendSelector.getBackend()
      expect(backend).toBeDefined()
    })

    it('returns offline backend if offline mode is on', () => {
      setLocationSearch('?offline=true')

      const backend = BackendSelector.getBackend()
      expect(backend.constructor.name).toBe('OfflineBackend')
    })

    it('returns offline backend if offline mode is on with no value', () => {
      setLocationSearch('?offline')

      const backend = BackendSelector.getBackend()
      expect(backend.constructor.name).toBe('OfflineBackend')
    })

    it('returns goals backend if offline mode is off and userId is present', () => {
      setLocationSearch('?offline=false')
      localStorage.setItem('userId', 'user123')

      const backend = BackendSelector.getBackend()
      expect(backend.constructor.name).toBe('GoalsBackend')
    })

    it('returns offline backend if offline mode is off and userId is absent', () => {
      setLocationSearch('')
      localStorage.removeItem('userId')

      const backend = BackendSelector.getBackend()
      expect(backend.constructor.name).toBe('OfflineBackend')
    })
    afterEach(() => {
      vi.clearAllMocks()
    })
  })
})
