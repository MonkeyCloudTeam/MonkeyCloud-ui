import axios, { AxiosError } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { useMenus } from '../hooks/useMenus'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

export const axiosInstanceForUpload = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 300000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

export const axiosInstanceForDownload = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 300000,
  responseType: 'blob',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': '*',
  },
})

export const getFiles = async () => {
  const response = await axiosInstance.get('/getFiles', {
    params: {
      username: localStorage.getItem('username'),
      folder: '',
    },
  })

  // console.log(response)
  // setFiles(nextFiles)

  // const menus = response.data.list.map((m: any) => false)

  // setMenus(menus)

  return response.data.list
}

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

createAuthRefreshInterceptor(axiosInstanceForUpload, refreshAuthLogic, {
  statusCodes: [408],
})

axiosInstanceForUpload.interceptors.request.use(function (config) {
  if (localStorage.getItem('token')) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  }
  if (config?.url?.toLowerCase().includes('refresh')) {
    config.headers.Authorization = `${localStorage.getItem('refreshToken')}`
  }
  return config
})

createAuthRefreshInterceptor(axiosInstanceForDownload, refreshAuthLogic, {
  statusCodes: [408],
})

axiosInstanceForDownload.interceptors.request.use(function (config) {
  if (localStorage.getItem('token')) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  }
  if (config?.url?.toLowerCase().includes('refresh')) {
    config.headers.Authorization = `${localStorage.getItem('refreshToken')}`
  }
  return config
})
