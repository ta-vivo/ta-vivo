import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'

import Auth from 'stores/Auth/index.js'

const user = {
  id: 1,
  email: 'jhon@doe.com',
  fullname: 'Jhon Doe',
  active: true, enabled: true,
  role: 'pro',
  settings: {},
  timezone: 'UTC'
}

const store = createStore({
  modules: {
    Auth
  }
});

describe('Auth store', () => {
  it('should set user', () => {

    store.commit('Auth/SET_USER', user);
    expect(store.state.Auth.user).toEqual(user);
  })

  it('should get user', () => {
    expect(store.getters['Auth/getUser']).toEqual(user);
  })

})
