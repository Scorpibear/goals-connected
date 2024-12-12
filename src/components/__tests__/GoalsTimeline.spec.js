import { mount } from '@vue/test-utils'
import GoalsTimeline from '@/components/GoalsTimeline.vue'

describe('GoalsTimeline', () => {
  const goals = [
    {
      title: 'Week',
      goals: [
        { id: 1, title: 'Goal 1', completed: false },
        { id: 2, title: 'Goal 2', completed: true }
      ],
      end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    },
    {
      title: 'Month',
      goals: [{ id: 3, title: 'Goal 3', completed: false }],
      end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
    }
  ]

  const backend = { getTimeline: Promise.resolve(goals) }

  it('could be initialized', () => {
    const wrapper = mount(GoalsTimeline, {
      propsData: {
        initGoals: goals,
        backend: null
      }
    })

    expect(wrapper).toBeDefined()
  })
})
