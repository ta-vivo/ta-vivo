import { axiosInstance } from 'boot/axios'

export function fetchAll(context, queryString) {
  return axiosInstance.get(`/integrations${queryString || ''}`)
}

export function requestEmailCode(context, { email }) {
  return axiosInstance.post('/integrations/request-email-code', { email })
}

export function requestWhatsappCode(context, { phone }) {
  return axiosInstance.post('/integrations/request-whatsapp-code', { phone })
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

export function createSlackIntegration(context, { authorizationCode }) {
  return axiosInstance.post('/integrations/slack', { authorizationCode })
}

export function createDiscordIntegration(context, { authorizationCode }) {
  return axiosInstance.post('/integrations/discord', { authorizationCode })
}

export function test(context, { id }) {
  return axiosInstance.post(`/integrations/test`, { id })
}
