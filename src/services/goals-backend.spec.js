import { GoalsBackend } from './goals-backend'
import { vi } from 'vitest'

const response = { json: () => Promise.resolve({}) }
const fetchResultStub = Promise.resolve(response)

/*global global*/
describe('goals-backend', () => {
  describe('create', () => {
    let backend
    beforeEach(() => {
      backend = new GoalsBackend()
    })
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
    afterEach(() => {
      vi.resetAllMocks()
    })
  })
  describe('getActGoals', () => {
    it('fetch is used', () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(fetchResultStub)
      let backend = new GoalsBackend()
      backend.getActGoals()
      expect(global.fetch).toHaveBeenCalled()
    })
    afterEach(() => {
      vi.resetAllMocks()
    })
  })
  describe('getDefaultInstance', () => {
    it('is not null', () => {
      expect(GoalsBackend.getDefaultInstance()).toBeDefined()
    })
    it('returns each type the same instance')
    it('is a GoalsBackend class instance')
  })

  describe('moveUp', () => {
    it('calls PATCH /goal with action:moveUp', () => {
      let backend = new GoalsBackend()
      backend.moveUp('id-12')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/goal\?(.*)id=id-12&action=moveUp/),
        { method: 'PATCH' }
      )
    })
  })
})
