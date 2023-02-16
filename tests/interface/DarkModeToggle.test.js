import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createStore } from 'vuex'
import $q from '../mocks/Quasar'
import '../mocks/router'

import DarkModeToggle from "../../src/components/Interface/DarkModeToggle.vue";

const wrapperFactory = () => mount(DarkModeToggle, {
  global: {
    plugins: [Quasar],
    mocks: {
      $t: (msg) => msg,
      $q: {...$q}
    },
  }
})

const wrapper = wrapperFactory();

describe('Dark mode Toggle', () => {
  it('mount component', () => {
    expect(DarkModeToggle).toBeTruthy();
  })

  it('should have a darkmode toggle', () => {
    expect(wrapper.find('div.q-toggle').exists()).toBe(true);
  })

  it('should have a darkmode toggle functionality', () => {
    expect(wrapper.vm.darkMode).toBe(false);
    wrapper.find('div.q-toggle').trigger('click');
    expect(wrapper.vm.darkMode).toBe(true);
  })
})
