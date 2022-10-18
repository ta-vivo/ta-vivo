import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createI18n } from 'vue-i18n'
import { createStore } from 'vuex'
import { flushPromises } from '@vue/test-utils'
import messages from 'src/i18n'
import $q from '../mocks/Quasar'

import ChangePassword from "../../src/components/User/ChangePassword.vue";

const i18n = createI18n({
  locale: 'en-US',
  messages
})
const actions = {
  changePassword: vi.fn(() => Promise.resolve()),
}
const mockStore = createStore({
  modules: {
    auth: {
      namespaced: true,
      actions,
    },
  },
})

const wrapperFactory = () => mount(ChangePassword, {
  global: {
    plugins: [Quasar, i18n, mockStore],
    mocks: {
      $t: (msg) => msg,
      $q: $q
    }
  }
})

const wrapper = wrapperFactory();

describe('Change password component', () => {
  it('mount component', () => {
    expect(ChangePassword).toBeTruthy();
  })

  it('should be changed the password', async () => {

    const form = wrapper.find('form');

    await wrapper.find('input.old-password').setValue('123456');
    await wrapper.find('input.new-password').setValue('@1234567a');
    await wrapper.find('input.confirm-new-password').setValue('@1234567a');

    await form.trigger('submit');
    await flushPromises();

    expect(wrapper.emitted().success).toBeTruthy();
    expect(wrapper.emitted().success[0]).toEqual([]);

  })

})
