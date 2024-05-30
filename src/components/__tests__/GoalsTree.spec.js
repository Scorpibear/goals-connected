import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import GoalsTree from '../GoalsTree.vue'

describe('GoalsTree', () => {
  it('renders properly', () => {
    const wrapper = mount(GoalsTree, { props: { initGoals: [{ title: 'The Test Goal' }] } })
    expect(wrapper.text()).toContain('The Test Goal')
  })
})
