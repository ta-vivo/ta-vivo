import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'

import Auth from 'stores/Auth/index.js'

describe('Auth store', () => {
  it('should set user', () => {

    const store = createStore({
      modules: {
        Auth
      }
    });

    const user = {
      id: 1,
      email: 'jhon@doe.com',
      fullname: 'Jhon Doe',
      active: true, enabled: true,
      role: 'pro',
      settings: {},
      timezone: 'UTC'
    }

    store.commit('Auth/SET_USER', user);
    expect(store.state.Auth.user).toEqual(user);
  })
})
