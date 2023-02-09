import { axiosInstance } from 'boot/axios'

export function fetchAll(_, queryString) {
  return axiosInstance.get(`/status-pages${queryString || ''}`)
}

export function fetchByuuid(_, uuid) {
  return axiosInstance.get(`/status-pages/${uuid}`)
}

export function create(_, payload) {
  return axiosInstance.post('/status-pages', payload)
}

export function update(_, {uuid, payload}) {
  return axiosInstance.put(`/status-pages/${uuid}`, payload)
}

export function remove(_, uuid) {
  return axiosInstance.delete(`/status-pages/${uuid}`)
}
