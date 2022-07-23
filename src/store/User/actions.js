import { axiosInstance } from 'boot/axios'

export function update(context, data) {
  return axiosInstance.put('/users', data)
}
