import axios, { AxiosError } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 300000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

export const refreshAuthLogic = (failedRequest: AxiosError) => {
  return axiosInstance
    .post('/refresh')
    .then(({ data: { accessToken, refreshToken } }) => {
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      if (failedRequest && failedRequest.response) {
        failedRequest.response.config.headers['Authorization'] =
          'Bearer ' + accessToken
      }
      return Promise.resolve()
    })
}

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
  statusCodes: [408],
})

axiosInstance.interceptors.request.use(function (config) {
  if (localStorage.getItem('token')) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  }
  if (config?.url?.toLowerCase().includes('refresh')) {
    config.headers.Authorization = `${localStorage.getItem('refreshToken')}`
  }
  return config
})
