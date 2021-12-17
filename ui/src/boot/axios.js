import { boot } from 'quasar/wrappers'
import axios from 'axios'

// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  baseURL: process.env.API
})

const axiosInstanceForAuth = axios.create({
  baseURL: process.env.API
})

const token = () => 'Bearer ' + window.localStorage.getItem('token')

const authInterceptor = (config) => {
  config.headers.Authorization = token()
  return config
}

axiosInstance.interceptors.request.use(authInterceptor)

// Add a response interceptor
axiosInstance.interceptors.response.use(response => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  if (error.response.status === 401) {
    window.localStorage.removeItem('token')
    location.reload()
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance, axiosInstanceForAuth }
