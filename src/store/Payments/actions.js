import { axiosInstance } from 'boot/axios';

export function fetchPricing (context) {
  return axiosInstance.get('/pricing')
}
