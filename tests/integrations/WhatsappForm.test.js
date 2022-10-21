import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createStore } from 'vuex'
import { flushPromises } from '@vue/test-utils'


import Whatsapp from "../../src/components/Integrations/Form/Whatsapp.vue";

const actions = {
  requestWhatsappCode: vi.fn(() => Promise.resolve()),
}
const mockStore = createStore({
  modules: {
    integrations: {
      namespaced: true,
      actions,
    },
  },
})

const wrapperFactory = () => mount(Whatsapp, {
  global: {
    plugins: [Quasar, mockStore],
    mocks: {
      $t: (msg) => msg
    }
  }
})

const wrapper = wrapperFactory();

describe('Whatsapp integration Form', () => {
  it('mount component', () => {
    expect(Whatsapp).toBeTruthy();
  })

  it('should test the request code flow', async () => {

    // Request the code
    const integrationButton = wrapper.find('button');
    expect(integrationButton.exists()).toBe(true);

    expect(wrapper.find('div[role="alert"]').exists()).toBe(false);

    const requestCodeForm = wrapper.find('form.request-code');
    await requestCodeForm.trigger('submit');

    expect(wrapper.find('div[role="alert"]').exists()).toBe(true);

    const nameInput = wrapper.find('input.phone');
    await nameInput.setValue('8095559999');

    await requestCodeForm.trigger('submit');
    await flushPromises()

    expect(wrapper.find('div[role="alert"]').exists()).toBe(false);

    // Confirm the code
    const confirmCodeForm = wrapper.find('form.confirm-code');
    expect(confirmCodeForm.exists()).toBe(true);

    const whatsappNameInput = wrapper.find('input.whatsapp-name');
    await whatsappNameInput.setValue('Test Whatsapp');

    const codeInput = wrapper.find('input.whatsapp-unique-code');
    await codeInput.setValue('123456');

    const confirmCodeButton = wrapper.find('button.confirm-code');
    expect(confirmCodeButton.exists()).toBe(true);

    await confirmCodeForm.trigger('submit');

    expect(wrapper.find('div[role="alert"]').exists()).toBe(false);
  })

})
