import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import '../mocks/axios'

import Checks from 'stores/Checks/index.js'

const store = createStore({
  modules: {
    Checks: Checks
  }
});

describe('Checks store', () => {

  it('should get periods', () => {
    expect(store.getters['Checks/getPeriods']).toEqual([
      {
        value: "10s",
        roles: ['enterprise', 'enterprise+', 'administrator']
      },
      {
        value: "30s",
        roles: ['enterprise', 'enterprise+', 'administrator']
      },
      {
        value: "1m",
        roles: ['pro', 'enterprise', 'enterprise+', 'administrator']
      },
      {
        value: "5m",
        roles: ['basic', 'pro', 'enterprise', 'enterprise+', 'administrator']
      },
      {
        value: "10m",
        roles: ['basic', 'pro', 'enterprise', 'enterprise+', 'administrator']
      },
      {
        value: "30m",
        roles: ['basic', 'pro', 'enterprise', 'enterprise+', 'administrator']
      },
      {
        value: "1h",
        roles: ['basic', 'pro', 'enterprise', 'enterprise+', 'administrator']
      },
      {
        value: "2h",
        roles: ['basic', 'pro', 'enterprise', 'enterprise+', 'administrator']
      },
      {
        value: "12h",
        roles: ['basic', 'pro', 'enterprise', 'enterprise+', 'administrator']
      }
    ])
  })

  it('should fetch all checks',  () => {
    store.dispatch('Checks/fetchAll')
      .then(response => {
        expect(response.route).toBe('/checks')
        expect(response.data).toEqual([])
      })
  })

  it('should fetch check by id',  () => {
    store.dispatch('Checks/fetch', { id: 1 })
      .then(response => {
        expect(response.data).toEqual([])
        expect(response.route).toEqual('/checks/1')
      })
  })

  it('should create',  () => {
    store.dispatch('Checks/create', { name: 'test' })
      .then(response => {
        expect(response.route).toEqual('/checks')
        expect(response.data).toEqual({ name: 'test' })
      })
  })

  it('should update',  () => {
    store.dispatch('Checks/update', { id: 1, name: 'test' })
      .then(response => {
        expect(response.route).toEqual('/checks/1')
        expect(response.data).toEqual({ id: 1, name: 'test' })
      })
  })

  it('should disable',  () => {
    store.dispatch('Checks/disable', 1)
      .then(response => {
        expect(response.route).toEqual('/checks/1/disable')
      })
  })

  it('should enable',  () => {
    store.dispatch('Checks/enable', 1)
      .then(response => {
        expect(response.route).toEqual('/checks/1/enable')
      })
  })

  it('should remove',  () => {
    store.dispatch('Checks/remove', { id: 1 })
      .then(response => {
        expect(response.route).toEqual('/checks/1')
      })
  })

})
