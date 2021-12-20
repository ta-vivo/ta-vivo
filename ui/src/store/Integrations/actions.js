import { axiosInstance } from 'boot/axios'

export function fetchAll(context) {
  return axiosInstance.get('/integrations')
}

export function create (context, payload) {
  return axiosInstance.post('/integrations', payload)
}
