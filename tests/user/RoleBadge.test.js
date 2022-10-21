import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

import RoleBadge from "../../src/components/User/RoleBadge.vue";


const wrapperFactory = () => mount(RoleBadge, {
  props:{
    role: 'administrator'
  },
  global: {
    plugins: [Quasar],
    mocks: {
      $t: (msg) => msg
    },
  }
})

const wrapper = wrapperFactory();

describe('Footer Component', () => {
  it('mount component', () => {
    expect(RoleBadge).toBeTruthy();
  })

  it('should have a Administrator title', () => {
    expect(wrapper.find('div.q-badge').text()).toBe('Administrator')
  })
})
