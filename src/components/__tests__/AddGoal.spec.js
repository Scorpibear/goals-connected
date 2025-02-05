import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AddGoal from '../AddGoal.vue'

describe('AddGoalFromTimelineTests', () => {
  const backend = { create: () => Promise.resolve({ id: 'goalId' }) }
  it('renders properly', () => {
    const wrapper = mount(AddGoal, {
      props: { baseGoalProps: { tags: ['Семья'], targetDate: '2024-07-19' }, backend }
    })
    expect(wrapper.text()).toContain('+')
  })
})
