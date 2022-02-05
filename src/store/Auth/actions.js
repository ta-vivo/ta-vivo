import { axiosInstanceForAuth } from 'boot/axios'

export function login(context, { username, password }) {
  return axiosInstanceForAuth.post('/auth/login', { username, password })
}
