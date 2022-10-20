import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import '../mocks/axios'

import Integrations from 'stores/Integrations/index.js'

const store = createStore({
  modules: {
    Integrations: Integrations
  }
});

describe('Integrations store', () => {

  it('should fetch all Integrations stats', () => {
    store.dispatch('Integrations/fetchAll')
      .then(response => {
        expect(response.route).toBe('/integrations')
        expect(response.data).toEqual([])
      })
  })

  it('should request email code', () => {
    store.dispatch('Integrations/requestEmailCode', { email: 'jhon@doe.com' })
      .then(response => {
        expect(response.route).toBe('/integrations/request-email-code')
        expect(response.data).toEqual({ email: 'jhon@doe.com' })
      })

  })

  it('should request whatsapp code', () => {
    store.dispatch('Integrations/requestWhatsappCode', { phone: '+123456789' })
      .then(response => {
        expect(response.route).toBe('/integrations/request-whatsapp-code')
        expect(response.data).toEqual({ phone: '+123456789' })
      })

  })

  it('should create an integration', () => {
    const payload = { name: 'test', type: 'email', email: 'jhon@doe.com', phone: '+123456789' }

    store.dispatch('Integrations/create', payload)
      .then(response => {
        expect(response.route).toBe('/integrations')
        expect(response.data).toEqual(payload)
      })
  })

  it('should update an integration', () => {
    const payload = { name: 'test', type: 'email', email: 'jhon@doe.com', phone: '+123456789' }

    store.dispatch('Integrations/update', { id: 1, payload })
      .then(response => {
        expect(response.route).toBe('/integrations/1')
        expect(response.data).toEqual(payload)
      })
  })

  it('should delete an integration', () => {
    store.dispatch('Integrations/remove', { id: 1 })
      .then(response => {
        expect(response.route).toBe('/integrations/1')
        expect(response.data).toEqual([])
      })
  })

  it('should create a slack integration', () => {
    store.dispatch('Integrations/createSlackIntegration', { authorizationCode: '123456789' })
      .then(response => {
        expect(response.route).toBe('/integrations/slack')
        expect(response.data).toEqual({ authorizationCode: '123456789' })
      })
  })

  it('should create a discord integration', () => {
    store.dispatch('Integrations/createDiscordIntegration', { authorizationCode: '123456789' })
      .then(response => {
        expect(response.route).toBe('/integrations/discord')
        expect(response.data).toEqual({ authorizationCode: '123456789' })
      })
  })

  it('should test an integration', () => {
    store.dispatch('Integrations/test', { id: 1 })
      .then(response => {
        expect(response.route).toBe('/integrations/test')
        expect(response.data).toEqual({ id: 1 })
      })
  })

})
