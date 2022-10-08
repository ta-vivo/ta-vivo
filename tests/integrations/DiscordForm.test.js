import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

import Discord from "../../src/components/Integrations/Form/Discord.vue";

const wrapperFactory = () => mount(Discord, {
  global: {
    plugins: [Quasar],
    mocks: {
      $t: (msg) => msg
    }
  }
})

const wrapper = wrapperFactory();

describe('DiscordForm', () => {
  it('mount component', () => {
    expect(Discord).toBeTruthy();
  })

  it('should render button to dispatch integration', () => {
    const integrationButton = wrapper.find('button');
    expect(integrationButton.exists()).toBe(true);
  })

  it('should contain example image', () => {
    const exampleImage = wrapper.find('img');
    expect(exampleImage.exists()).toBe(true);
  })

})
