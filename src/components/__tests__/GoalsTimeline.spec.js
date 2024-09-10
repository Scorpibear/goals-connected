import { mount } from '@vue/test-utils'
import GoalsTimeline from '@/components/GoalsTimeline.vue'

describe('GoalsTimeline', () => {
  const goals = [
    {
      title: 'Week',
      goals: [
        { id: 1, title: 'Goal 1', completed: false },
        { id: 2, title: 'Goal 2', completed: true }
      ]
    },
    { title: 'Month', goals: [{ id: 3, title: 'Goal 3', completed: false }] }
  ]

  it('shows goals', () => {
    const wrapper = mount(GoalsTimeline, {
      propsData: {
        initGoals: goals,
        backend: null
      }
    })

    expect(wrapper.text()).toContain('Goal 1')
  })
})
