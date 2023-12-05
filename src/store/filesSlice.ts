import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import type { Files } from './types'
import { axiosInstance } from '../api'
import type { AxiosError, AxiosRequestConfig } from 'axios'

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<{
    url: string
    method: AxiosRequestConfig['method']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['params']
    headers?: AxiosRequestConfig['headers']
  }> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

// Define a service using a base URL and expected endpoints
export const filesApi = createApi({
  reducerPath: 'FILES',
  tagTypes: ['FILES'],
  baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: (builder) => ({
    getFiles: builder.query<Files, string>({
      query: (path = '') => ({
        url: '/getFiles',
        method: 'get',
        params: {
          username: localStorage.getItem('username'),
          folder: path,
        },
      }),
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
          console.log('queryFulfilled', getState())
        } catch {}
      },
    }),
  }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetFilesQuery, useLazyGetFilesQuery } = filesApi
