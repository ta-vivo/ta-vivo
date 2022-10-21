import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

import Slack from "../../src/components/Integrations/Form/Slack.vue";

const wrapperFactory = () => mount(Slack, {
  global: {
    plugins: [Quasar],
    mocks: {
      $t: (msg) => msg
    }
  }
})

const wrapper = wrapperFactory();

describe('Slack integration form', () => {
  it('mount component', () => {
    expect(Slack).toBeTruthy();
  })

  it('should render button to dispatch integration', () => {
    const integrationButton = wrapper.find('a.slack-button');
    expect(integrationButton.exists()).toBe(true);
  })

  it('should contain example image', () => {
    const exampleImage = wrapper.find('div.slack-demo');
    expect(exampleImage.exists()).toBe(true);
  })

})
