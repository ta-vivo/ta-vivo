import { axiosInstance } from 'boot/axios';

export function fetchPricing(context) {
  return axiosInstance.get('/pricing')
}

export function saveSubscription(context, { subscriptionId }) {
  return axiosInstance.post('payments/paypal-subscription', { subscriptionId })
}

export function paypalSubscriptionCancel(context) {
  return axiosInstance.post('payments/paypal-subscription-cancel')
}

export function paypalSubscriptionTransactions(context) {
  return axiosInstance.get('payments/paypal-transactions')
}
