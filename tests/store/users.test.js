import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import '../mocks/axios'

import User from 'stores/User/index.js'

const store = createStore({
  modules: {
    User: User
  }
});

describe('User store', () => {

  it('should update user',  () => {
    const payload = { name: 'test', email: 'jhon@doe.com' }
    store.dispatch('User/update', payload)
      .then(response => {
        expect(response.route).toBe('/users')
        expect(response.data).toEqual(payload)
      })
  })

})
