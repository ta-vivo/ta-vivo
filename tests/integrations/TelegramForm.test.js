import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createStore } from 'vuex'


import Telegram from "../../src/components/Integrations/Form/Telegram.vue";
import { find } from 'core-js/core/array';


const wrapperFactory = () => mount(Telegram, {
  global: {
    plugins: [Quasar],
    mocks: {
      $t: (msg) => msg
    }
  }
})

const wrapper = wrapperFactory();

describe('Telegram integration Form', () => {
  it('mount component', () => {
    expect(Telegram).toBeTruthy();
  })

  it('should have a demo image', () => {
    const demoImage = wrapper.find('div.telegram-demo');
    expect(demoImage.exists()).toBe(true);
  })

  it('should have a "a" tag with href = https://t.me/TaVivoBot', () => {
    const integrationButton = wrapper.find('a.bot-link');
    expect(integrationButton.exists()).toBe(true);
    expect(integrationButton.attributes('href')).toBe('https://t.me/TaVivoBot');
  })

  it('should test the request code flow', async () => {

    const integrationButton = wrapper.find('button');
    expect(integrationButton.exists()).toBe(true);

    const form = wrapper.find('form');
    await form.trigger('submit');

    const error = wrapper.find('div[role="alert"]');
    expect(error.exists()).toBe(true);

    const nameInput = wrapper.find('.name');
    await nameInput.setValue('test');

    const tokenInput = wrapper.find('.token');
    await tokenInput.setValue('test');

    // TODO: test the event emitted
  })

})
