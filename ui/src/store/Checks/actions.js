import { axiosInstance } from 'boot/axios'

export function fetchAll(context) {
  return axiosInstance.get('/checks?limit=100')
}

export function create(context, payload) {
  return axiosInstance.post('/checks', payload)
}
