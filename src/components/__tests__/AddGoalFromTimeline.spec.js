import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AddGoalFromTimeline from '../AddGoalFromTimeline.vue'

describe('AddGoalFromTimelineTests', () => {
  it('renders properly', () => {
    const wrapper = mount(AddGoalFromTimeline, {
      props: { baseGoalProps: { tags: ['Семья'], targetDate: '2024-07-19' } }
    })
    expect(wrapper.text()).toContain('+')
  })
})
