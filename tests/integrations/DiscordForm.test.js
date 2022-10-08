import { test, expect } from 'vitest'
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

test('mount component', () => {
  expect(Discord).toBeTruthy();
})

test('should render button to dispatch integration', () => {
  const integrationButton = wrapper.find('button');
  expect(integrationButton.exists()).toBe(true);
})

test('should contain example image', () => {
  const exampleImage = wrapper.find('img');
  expect(exampleImage.exists()).toBe(true);
})
