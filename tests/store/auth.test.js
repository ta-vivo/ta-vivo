import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import '../mocks/axios'

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

  it('should be login success', () => {
    store.dispatch('Auth/login', { email: 'jhon@doe.com', password: '123456' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })

  })

  it('should be login with google', () => {
    store.dispatch('Auth/google', { access_token: '123456', timezone: 'UTC' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

  it('should be login with discord', () => {
    store.dispatch('Auth/discord', { access_token: '123456', timezone: 'UTC' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

  it('should be login with slack', () => {
    store.dispatch('Auth/slack', { access_token: '123456', timezone: 'UTC' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

  it('should be login with github', () => {
    store.dispatch('Auth/github', { access_token: '123456', timezone: 'UTC' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

  it('should be register', () => {
    store.dispatch('Auth/register', { email: 'jhon@doe.com', password: '123456', confirmPassword: '123456', fullname: 'Jhon Doe' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })

  })

  it('should be register email confirmation', () => {
    store.dispatch('Auth/registerEmailConfirmation', { uniqueCode: '123456' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

  it('should be request register email confirmation', () => {
    store.dispatch('Auth/requestRegisterEmailConfirmation')
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

  it('should be request reset password', () => {
    store.dispatch('Auth/forgotPassword', { email: 'jhon@doe.com' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

  it('should be change password', () => {
    store.dispatch('Auth/recoverPassword', { email: 'jhon@doe.com', oldPassword: '123456', password: '123456', confirmPassword: '123456' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

  it('should be recover password', () => {
    store.dispatch('Auth/recoverPassword', { email: 'jhon@doe.com', uniqueCode: '123456', password: '123456', confirmPassword: '123456' })
      .then(() => {
        expect(store.state.Auth.user).toEqual(user);
      })
  })

})
