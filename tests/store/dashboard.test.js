import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import '../mocks/axios'

import Dashbaord from 'stores/Dashboard/index.js'

const store = createStore({
  modules: {
    Dashbaord: Dashbaord
  }
});

describe('Dashbaord store', () => {

  it('should fetch all dashbaord stats',  () => {
    store.dispatch('Dashbaord/fetchStats')
      .then(response => {
        expect(response.route).toBe('/dashboard')
        expect(response.data).toEqual([])
      })
  })

})
