import { axiosInstance } from 'boot/axios'

export function fetchAll(context) {
  return axiosInstance.get('/integrations')
}
