import { axiosInstanceForAuth, axiosInstance } from 'boot/axios'

export function login(context, { email, password }) {
  return axiosInstanceForAuth.post('/auth/login', { email, password })
}

export function register(context, { email, password, confirmPassword, fullname }) {
  return axiosInstanceForAuth.post('/auth/register', { email, password, confirmPassword, fullname })
}

export function registerEmailConfirmation(context, { uniqueCode }) {
  return axiosInstance.post('/auth/register-email-confirmation', { uniqueCode })
}
