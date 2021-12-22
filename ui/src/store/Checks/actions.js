import { axiosInstance } from 'boot/axios'

export function fetchAll(context) {
  return axiosInstance.get('/checks?limit=100')
}

export function fetch(context, payload) {
  return axiosInstance.get(`/checks/${payload.id}`)
}

export function fetchLogsById(context, payload) {
  return axiosInstance.get(`/checks/${payload.id}/logs`)
}

export function create(context, payload) {
  return axiosInstance.post('/checks', payload)
}

export function update(context, payload) {
  return axiosInstance.put(`/checks/${payload.id}`, payload)
}

export function remove (context, payload) {
  return axiosInstance.delete(`/checks/${payload.id}`)
}
