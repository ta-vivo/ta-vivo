import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

import Email from "../../src/components/Integrations/Form/Email.vue";

const wrapperFactory = () => mount(Email, {
  global: {
    plugins: [Quasar],
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

  it('should render button to dispatch integration', async () => {
    const integrationButton = wrapper.find('button');
    expect(integrationButton.exists()).toBe(true);

    // find form and submit
    const form = wrapper.find('form');
    await form.trigger('submit');

    const error = wrapper.find('div[role="alert"]');
    expect(error.exists()).toBe(true);

    const input = wrapper.find('input');
    await input.setValue('jhon@doe.com');
  })

})
