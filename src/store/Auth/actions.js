import { axiosInstanceForAuth, axiosInstance } from 'boot/axios'

export function me(context) {
  return axiosInstance.get('/auth/me')
}

export function login(context, { email, password }) {
  return axiosInstanceForAuth.post('/auth/login', { email, password })
}

export function google (context, { access_token, timezone }) {
  return axiosInstanceForAuth.post('/auth/google', { access_token, timezone: timezone })
}

export function discord (context, { access_token }) {
  return axiosInstanceForAuth.post('/auth/discord', { access_token })
}

export function slack (context, { access_token }) {
  return axiosInstanceForAuth.post('/auth/slack', { access_token })
}

export function github (context, { access_token }) {
  return axiosInstanceForAuth.post('/auth/github', { access_token })
}

export function register(context, { email, password, confirmPassword, fullname }) {
  return axiosInstanceForAuth.post('/auth/register', { email, password, confirmPassword, fullname })
}

export function registerEmailConfirmation(context, { uniqueCode }) {
  return axiosInstance.post('/auth/register-email-confirmation', { uniqueCode })
}

export function requestRegisterEmailConfirmation(context) {
  return axiosInstance.get('/auth/request-register-email-confirmation')
}

export function changePassword(context, { oldPassword, password, confirmPassword }) {
  return axiosInstance.post('/auth/change-password', { oldPassword, password, confirmPassword })
}

export function forgotPassword(context, { email }) {
  return axiosInstance.post('/auth/forgot-password', { email })
}

export function recoverPassword(context, { email, uniqueCode, password, confirmPassword }) {
  return axiosInstance.post('/auth/recover-password', { email, uniqueCode, password, confirmPassword })
}
