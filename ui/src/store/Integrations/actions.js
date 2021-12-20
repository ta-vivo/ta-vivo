import { axiosInstance } from 'boot/axios'

export function fetchAll(context) {
  return axiosInstance.get('/integrations')
}

export function create (context, payload) {
  return axiosInstance.post('/integrations', payload)
}

export function remove (context, payload) {
  return axiosInstance.delete(`/integrations/${payload.id}`)
}
