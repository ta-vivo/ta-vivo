import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createStore } from 'vuex'
import $q from '../mocks/Quasar'
import { createRouterMock, injectRouterMock } from 'vue-router-mock'

import MobileMenu from "../../src/components/Interface/MobileMenu.vue";

const router = createRouterMock({
  spy: {
    create: fn => vi.fn(fn),
    reset: spy => spy.mockReset(),
  },
})
beforeEach(() => {
  injectRouterMock(router)
})

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

const wrapperFactory = () => mount(MobileMenu, {
  global: {
    plugins: [Quasar, mockStore, router],
    mocks: {
      $t: (msg) => msg,
      $q: $q
    },
  }
})

const wrapperFactoryXs = () => mount(MobileMenu, {
  global: {
    plugins: [Quasar, mockStore, router],
    mocks: {
      $t: (msg) => msg,
      $q: { ...$q, screen: { gt: { xs: false } } }
    },
  }
})

const wrapper = wrapperFactory();
const wrapperLg = wrapperFactoryXs();

describe('Desktop Menu component', () => {

  it('mount component', () => {
    expect(MobileMenu).toBeTruthy();
  })

  it('should a tag with /checks href', () => {
    expect(wrapper.find('a[href="/checks"]').exists()).toBe(true);
  })

  it('should a tag with /integrations href', () => {
    expect(wrapper.find('a[href="/integrations"]').exists()).toBe(true);
  })

  it('should badge with Administrator text', () => {
    expect(wrapper.find('div.q-badge').text()).toBe('Administrator');
  })

  it('should no have badge when the screen is not xs', () => {
    expect(wrapperLg.find('div.q-badge').exists()).toBe(false);
  })
})
