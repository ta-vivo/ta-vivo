import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createStore } from 'vuex'
import $q from '../mocks/Quasar'

import Footer from "../../src/components/Interface/Footer.vue";

const getters = {
  getUser: vi.fn(() => ({ id: 1, name: 'John Doe', email: 'jhon@doe.com', role: 'administrator' })),
}

const mockStore = createStore({
  modules: {
    auth: {
      namespaced: true,
      getters
    },
  },
})

const wrapperFactory = () => mount(Footer, {
  global: {
    plugins: [Quasar, mockStore],
    mocks: {
      $t: (msg) => msg
    },
  }
})

const wrapper = wrapperFactory();

describe('Footer Component', () => {
  it('mount component', () => {
    expect(Footer).toBeTruthy();
  })

  it('should have logo', () => {
    expect(wrapper.find('.logo img').exists()).toBe(true);
  })

  it('should have a link to terms and conditions', () => {
    expect(wrapper.find('span.terms').text()).toBe('common.termsAndConditions');
  })

  it('should have a link to privacy policy', () => {
    expect(wrapper.find('span.privacy').text()).toBe('common.privacyPolicy');
  })

  it('should have a link to pricing', () => {
    expect(wrapper.find('span.pricing').text()).toBe('common.pricing');
  })

  it('should have a link to about', () => {
    expect(wrapper.find('span.about').text()).toBe('common.about');
  })
})
