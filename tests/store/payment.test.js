import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import '../mocks/axios'

import Payments from 'stores/Payments/index.js'

const store = createStore({
  modules: {
    Payments: Payments
  }
});

describe('Payments store', () => {

  it('should fetchPricing',  () => {
    store.dispatch('Payments/fetchPricing')
      .then(response => {
        expect(response.route).toBe('/pricing')
        expect(response.data).toEqual([])
      })
  })

  it('should saveSubscription',  () => {
    store.dispatch('Payments/saveSubscription', { subscriptionId: '123456789' })
      .then(response => {
        expect(response.route).toBe('payments/paypal-subscription')
        expect(response.data).toEqual({ subscriptionId: '123456789' })
      })

  })

  it('should paypalSubscriptionCancel',  () => {
    store.dispatch('Payments/paypalSubscriptionCancel')
      .then(response => {
        expect(response.route).toBe('payments/paypal-subscription-cancel')
        expect(response.data).toEqual(undefined)
      })

  })

  it('should paypalSubscriptionTransactions',  () => {
    store.dispatch('Payments/paypalSubscriptionTransactions')
      .then(response => {
        expect(response.route).toBe('payments/paypal-transactions')
        expect(response.data).toEqual([])
      })

  })

})
