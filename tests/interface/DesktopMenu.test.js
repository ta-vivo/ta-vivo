import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createStore } from 'vuex'

import DesktopMenu from "../../src/components/Interface/DesktopMenu.vue";

const getters = {
  getUser: vi.fn(() => ({ name: 'John Doe' })),
}
const mockStore = createStore({
  modules: {
    auth: {
      namespaced: true,
      getters,
    },
  },
})

const wrapperFactory = () => mount(DesktopMenu, {
  global: {
    plugins: [Quasar, mockStore],
    mocks: {
      $t: (msg) => msg
    }
  }
})

const wrapper = wrapperFactory();

describe('Discord integration form', () => {
  it('mount component', () => {
    expect(DesktopMenu).toBeTruthy();
  })

})
