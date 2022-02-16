import { axiosInstanceForAuth } from 'boot/axios'

export function login(context, { email, password }) {
  return axiosInstanceForAuth.post('/auth/login', { email, password })
}
