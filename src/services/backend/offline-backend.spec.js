import { OfflineBackend } from './offline-backend'
import { vi } from 'vitest'

describe('OfflineBackend', () => {
  const goalsData = {
    goals: [
      {
        id: '986c1013-5dc4-4d64-92e0-1c1c3428eb4a',
        title: 'Be happy',
        type: 0,
        children: [
          {
            id: 'e12072c2-39af-451b-be64-e50e4a1b1550',
            title: 'оказываю позитивное влияние',
            type: 0,
            children: [
              {
                id: 'f27d50c7-4a85-47a2-a479-bdbd2cf8ca07',
                title: '12 push-ups',
                type: 1
              }
            ]
          },
          {
            id: '2024-03-15 08:47:00.000:0000',
            title: 'To have 1 billion of dollars',
            type: 1,
            date: '2030',
            tags: ['family'],
            children: [
              {
                id: '8e83fcd6-3a31-48fb-bee8-778ba026cfeb',
                title: 'Find a job',
                date: '2024-05-04',
                type: 1
              }
            ]
          }
        ]
      }
    ],
    types: [
      {
        title: 'State'
      },
      {
        title: 'Result'
      },
      {
        title: 'Action'
      }
    ]
  }
  let getItemSpy
  let setItemSpy
  let removeItemSpy

  beforeEach(() => {
    getItemSpy = vi.spyOn(localStorage, 'getItem')
    setItemSpy = vi.spyOn(localStorage, 'setItem')
    removeItemSpy = vi.spyOn(localStorage, 'removeItem')
  })

  afterEach(() => {
    getItemSpy.mockRestore()
    setItemSpy.mockRestore()
    removeItemSpy.mockRestore()
  })

  describe('defaultInstance', () => {
    it('returns the same instance', () => {
      const instance1 = OfflineBackend.getDefaultInstance()
      const instance2 = OfflineBackend.getDefaultInstance()
      expect(instance1).toBe(instance2)
    })
  })

  const goalsProvider = { loadGoalsData: () => goalsData, saveGoalsData: () => {} }

  describe('getTimeline', () => {
    it('returns the timeline', async () => {
      let backend = new OfflineBackend(goalsProvider)
      const timeline = await backend.getTimeline()
      expect(timeline).toBeDefined()
      expect('length' in timeline).toBeTruthy()
    })
    afterEach(() => {
      vi.clearAllMocks()
    })
  })
})
