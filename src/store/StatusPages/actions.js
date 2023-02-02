import { axiosInstance } from 'boot/axios'

export function fetchAll(_, queryString) {
  return axiosInstance.get(`/status-pages${queryString || ''}`)
}
