import { axiosInstance } from 'boot/axios'

export function fetchAll(_, queryString) {
  return axiosInstance.get(`/status-pages${queryString || ''}`)
}

export function create(_, payload) {
  return axiosInstance.post('/status-pages', payload)
}
