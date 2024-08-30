import { OnlineBackend } from './online-backend'
import { vi } from 'vitest'

const response = { json: () => Promise.resolve({}) }
const fetchResultStub = Promise.resolve(response)

/*global global*/
describe('OnlineBackend', () => {
  describe('constructor', () => {
    it('loads userId from localStorage', () => {
      localStorage.setItem('userId', 'userId')
      const instance = new OnlineBackend()
      console.debug(instance)
      expect(instance.userId).toBe('userId')
    })
  })
  let backend
  beforeEach(() => {
    backend = new OnlineBackend()
  })
  afterEach(() => {
    vi.resetAllMocks()
  })
  describe('create', () => {
    it('executes POST /goal request', () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(fetchResultStub)
      let goalData = { title: 'new title', id: 'id2', parentId: 'id1' }

      backend.create(goalData)

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/goal'), {
        method: 'POST',
        body: JSON.stringify(goalData)
      })
    })
    it('provides json data as output', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(fetchResultStub)
      vi.spyOn(response, 'json').mockResolvedValue({ id: 'server-provided', title: 'goal1' })

      const output = await backend.create({ id: 'local-id', title: 'goal1' })

      expect(output).toEqual({ id: 'server-provided', title: 'goal1' })
    })
  })
  describe('getActGoals', () => {
    it('fetch is used', () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(fetchResultStub)
      backend.getActGoals()
      expect(global.fetch).toHaveBeenCalled()
    })
    afterEach(() => {
      vi.resetAllMocks()
    })
  })
  describe('getDefaultInstance', () => {
    it('is not null', () => {
      expect(OnlineBackend.getDefaultInstance()).toBeDefined()
    })
    it('returns each time the same instance', () => {
      const instance1 = OnlineBackend.getDefaultInstance()
      const instance2 = OnlineBackend.getDefaultInstance()
      expect(instance1).toBe(instance2)
    })
    it('is a OnlineBackend class instance', () => {
      const instance = OnlineBackend.getDefaultInstance()
      expect(instance.constructor.name).toBe('OnlineBackend')
    })
  })

  describe('moveUp', () => {
    it('calls PATCH /goal with action:moveUp', async () => {
      await backend.moveUp('id-12')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/goal\?(.*)id=id-12&action=moveUp/),
        { method: 'PATCH' }
      )
    })
  })
  describe('complete', () => {
    it('calls PATCH /goal with action:complete', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(fetchResultStub)

      await backend.complete('id-12', true)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/goal\?(.*)id=id-12&action=complete&value=true/),
        { method: 'PATCH' }
      )
    })
  })
})
