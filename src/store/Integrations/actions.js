import { axiosInstance } from 'boot/axios'

export function fetchAll(context) {
  return axiosInstance.get('/integrations')
}

export function requestEmailCode(context, { email }) {
  return axiosInstance.post('/integrations/request-email-code', { email })
}

export function create(context, payload) {
  return axiosInstance.post('/integrations', payload)
}

export function update(context, { id, payload }) {
  return axiosInstance.put(`/integrations/${id}`, payload)
}

export function remove(context, payload) {
  return axiosInstance.delete(`/integrations/${payload.id}`)
}
