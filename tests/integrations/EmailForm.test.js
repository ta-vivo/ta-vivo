import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createStore } from 'vuex'


import Email from "../../src/components/Integrations/Form/Email.vue";

const actions = {
  requestEmailCode: vi.fn(() => Promise.resolve()),
}
const mockStore = createStore({
  modules: {
    integrations: {
      namespaced: true,
      actions,
    },
  },
})

const wrapperFactory = () => mount(Email, {
  global: {
    plugins: [Quasar, mockStore],
    mocks: {
      $t: (msg) => msg
    }
  }
})

const wrapper = wrapperFactory();

describe('Email integration Form', () => {
  it('mount component', () => {
    expect(Email).toBeTruthy();
  })

  it('should test the request code flow', async () => {
    const integrationButton = wrapper.find('button');
    expect(integrationButton.exists()).toBe(true);

    const form = wrapper.find('form');
    await form.trigger('submit');

    const error = wrapper.find('div[role="alert"]');
    expect(error.exists()).toBe(true);

    const input = wrapper.find('input');
    await input.setValue('jhon@doe.com');
    await form.trigger('submit');

    // TODO: Check if the requestEmailCode action was called
  })

})
