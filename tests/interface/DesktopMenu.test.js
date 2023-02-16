import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createStore } from 'vuex'
import $q from '../mocks/Quasar'
import '../mocks/router'

import DesktopMenu from "../../src/components/Interface/DesktopMenu.vue";

const getters = {
  getUser: vi.fn(() => ({ name: 'John Doe', email: 'jhon@doe.com', role: 'administrator' })),
}

const setters = {
  SET_USER: vi.fn(),
}

const mockStore = createStore({
  modules: {
    auth: {
      namespaced: true,
      getters,
      setters
    },
  },
})

const wrapperFactory = () => mount(DesktopMenu, {
  global: {
    plugins: [Quasar, mockStore],
    mocks: {
      $t: (msg) => msg,
      $q: {...$q}
    },
  }
})

const wrapper = wrapperFactory();

describe('Desktop Menu component', () => {
  it('mount component', () => {
    expect(DesktopMenu).toBeTruthy();
  })

  it('should have a email', () => {
    expect(wrapper.find('button.email').text()).toBe('jhon@doe.comarrow_drop_down');
  })

  it('should check and integration menu elements', () => {
    expect(wrapper.find('button.checks').text()).toBe('common.checks');
    expect(wrapper.find('button.integrations').text()).toBe('common.integrations');
  })

  it('should have a badge with administrator text', async () => {
    expect(wrapper.find('div.q-badge').text()).toBe('Administrator');
  })
})
