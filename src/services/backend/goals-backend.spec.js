import { GoalsBackend } from './goals-backend'
import { vi } from 'vitest'

const response = { json: () => Promise.resolve({}) }
const fetchResultStub = Promise.resolve(response)

describe('goals-backend', () => {
  describe('constructor', () => {
    it('loads userId from localStorage', () => {
      localStorage.setItem('userId', 'userId')
      const instance = new GoalsBackend()
      console.debug(instance)
      expect(instance.userId).toBe('userId')
    })
  })
  let backend
  beforeEach(() => {
    backend = new GoalsBackend()
  })
  afterEach(() => {
    vi.resetAllMocks()
  })
  describe('create', () => {
    it('executes POST /goal request', () => {
      vi.spyOn(backend, 'fetch').mockResolvedValue(fetchResultStub)
      let goalData = { title: 'new title', id: 'id2', parentId: 'id1' }

      backend.create(goalData)

      expect(backend.fetch).toHaveBeenCalledWith(expect.stringContaining('/goal'), {
        method: 'POST',
        body: JSON.stringify(goalData)
      })
    })
    it('provides json data as output', async () => {
      vi.spyOn(backend, 'fetch').mockResolvedValue(fetchResultStub)
      vi.spyOn(response, 'json').mockResolvedValue({ id: 'server-provided', title: 'goal1' })

      const output = await backend.create({ id: 'local-id', title: 'goal1' })

      expect(output).toEqual({ id: 'server-provided', title: 'goal1' })
    })
  })
  describe('getActGoals', () => {
    it('fetch is used', () => {
      vi.spyOn(backend, 'fetch').mockResolvedValue(fetchResultStub)
      backend.getActGoals()
      expect(backend.fetch).toHaveBeenCalled()
    })
    afterEach(() => {
      vi.resetAllMocks()
    })
  })
  describe('getDefaultInstance', () => {
    it('is not null', () => {
      expect(GoalsBackend.getDefaultInstance()).toBeDefined()
    })
    it('returns each time the same instance', () => {
      const instance1 = GoalsBackend.getDefaultInstance()
      const instance2 = GoalsBackend.getDefaultInstance()
      expect(instance1).toBe(instance2)
    })
    it('is a GoalsBackend class instance', () => {
      const instance = GoalsBackend.getDefaultInstance()
      expect(instance.constructor.name).toBe('GoalsBackend')
    })
  })

  describe('moveUp', () => {
    it('calls PATCH /goal with action:moveUp', async () => {
      await backend.moveUp('id-12')
      expect(backend.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/goal\?(.*)id=id-12&action=moveUp/),
        { method: 'PATCH' }
      )
    })
  })
  describe('complete', () => {
    it('calls PATCH /goal with action:complete', async () => {
      vi.spyOn(backend, 'fetch').mockResolvedValue(fetchResultStub)

      await backend.complete('id-12', true)

      expect(backend.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/goal\?(.*)id=id-12&action=complete&value=true/),
        { method: 'PATCH' }
      )
    })
  })
})
