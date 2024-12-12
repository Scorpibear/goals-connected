import GoalsProvider from './local-goals-provider'

describe('GoalsProvider', () => {
  describe('loadGoalsData', () => {
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

    it('returns empty goals template if no data in localStorage', () => {
      getItemSpy.mockReturnValue(null)
      let goalsProvider = new GoalsProvider()
      const goalsData = goalsProvider.loadGoalsData()
      expect(goalsData).toBeDefined()
      expect(goalsData.goals).toBeDefined()
      expect(goalsData.types).toBeDefined()
    })
  })

  describe('saveGoalsData', () => {
    it('saves goals data to localStorage', () => {
      let goalsProvider = new GoalsProvider('test-key')
      const goalsData = { goals: [{ id: '1-2-3', title: 'test' }], types: [] }
      goalsProvider.saveGoalsData(goalsData)
      expect(localStorage.getItem('test-key')).toEqual(JSON.stringify(goalsData))
    })
  })
})
