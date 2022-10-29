import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

import NoIntegrationsAction from "../../src/components/Integrations/NoIntegrationsAction.vue";

const wrapperFactory = () => mount(NoIntegrationsAction, {
  global: {
    plugins: [Quasar],
    mocks: {
      $t: (msg) => msg
    }
  }
})

const wrapper = wrapperFactory();

describe('No integrations action component', () => {
  it('mount component', () => {
    expect(NoIntegrationsAction).toBeTruthy();
  })

  it('should be have a text', () => {
    expect(wrapper.text()).toContain('messages.information.noIntegration1');
    expect(wrapper.text()).toContain('messages.information.noIntegration2');
    expect(wrapper.text()).toContain('action.clickHere');
  })

  it('should be have a link', () => {
    const link = wrapper.find('router-link');
    expect(link.exists()).toBe(true);
  })

})
