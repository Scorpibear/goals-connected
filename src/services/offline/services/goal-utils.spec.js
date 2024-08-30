import { getGoalData } from './goal-utils'

describe('goal-utils', () => {
  describe('getGoalData', () => {
    it('returns parentContainer for threefold goal', () => {
      const goalList = [{ id: 'goal1', children: [{ id: 'goal2', children: [{ id: 'goal3' }] }] }]
      const { parentContainer } = getGoalData(goalList, 'goal3')
      expect(parentContainer).toBe(goalList[0].children)
    })
    it('specifies container correctly for the top level goal', () => {
      const goalList = [
        { id: '1', title: 'goal1' },
        { id: '2', title: 'goal2' }
      ]
      const { container } = getGoalData(goalList, '2')
      expect(container).toBe(goalList)
    })
    it('shows correct parent container and container for the goal on the 2nd hierarchy level', () => {
      const goalList = [{ id: '1', title: 'goal1', children: [{ id: '2', title: 'goal2' }] }]
      const { parent, container, parentContainer } = getGoalData(goalList, '2')
      expect(parent).toBe(goalList[0])
      expect(container).toBe(goalList[0].children)
      expect(parentContainer).toBe(goalList)
    })
    it('get corrent parent for second child', () => {
      const goalList = [
        {
          id: '1',
          title: 'goal1',
          children: [
            { id: '1.1', title: 'goal1.1' },
            { id: '1.2', title: 'goal1.2' }
          ]
        }
      ]
      const { parent } = getGoalData(goalList, '1.2')
      expect(parent).toBe(goalList[0])
    })
    it('shows correct container for root->[goal->child,goal2]', () => {
      const goalList = [
        {
          id: 'root1',
          children: [{ id: 'goal1', children: [{ id: 'child1' }] }, { id: 'goal2' }]
        }
      ]
      const { container } = getGoalData(goalList, 'goal2')
      expect(container).toBe(goalList[0].children)
    })
  })
})
