import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import type {
  Files,
  RenameFileRequestArgs,
  UploadFileRequestArgs,
} from './types'
import { axiosInstance } from '../api'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { Buckets, PublicFiles } from './types'
import {
  BaseQueryArg,
  BaseQueryMeta,
  BaseQueryResult,
} from '@reduxjs/toolkit/dist/query/baseQueryTypes'

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
    getFiles: builder.query<Files, { username: string; path: string }>({
      query: ({ username = '', path = '' }) => {
        console.log('sssssssssss', username)
        return {
          url: '/getFiles',
          method: 'get',
          params: {
            username: username,
            folder: path,
          },
        }
      },
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
          console.log('queryFulfilled', getState())
        } catch {}
      },
    }),
    searchFilesByName: builder.query<Files, string>({
      query: (path = '') => ({
        url: '/privateSearchByFilename',
        method: 'get',
        params: {
          username: localStorage.getItem('username'),
          filename: path,
        },
      }),
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
          console.log('queryFulfilled', getState())
        } catch {}
      },
    }),
    filesFavorite: builder.query<Files, string>({
      query: (path = '') => ({
        url: '/favorite',
        method: 'get',
        params: {
          username: localStorage.getItem('username'),
        },
      }),
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
          console.log('queryFulfilled', getState())
        } catch {}
      },
    }),
    searchFilesByDate: builder.query<Files, string>({
      query: (path = '') => ({
        url: '/privateSearchByDate',
        method: 'get',
        params: {
          username: localStorage.getItem('username'),
          date: path,
        },
      }),
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
          console.log('queryFulfilled', getState())
        } catch {}
      },
    }),
    publicFolders: builder.query<Files, string>({
      query: () => ({
        url: '/publicAccess',
        method: 'get',
      }),
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
          console.log('queryFulfilled', getState())
        } catch {}
      },
    }),
    publicFiles: builder.query<PublicFiles, string>({
      query: (folderId = '') => ({
        url: '/getFilesInPublicFolder',
        method: 'get',
        params: {
          folderId: folderId,
        },
      }),
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
        } catch {}
      },
    }),
    adminFiles: builder.query<Buckets, string>({
      query: () => ({
        url: '/getFilesByAdmin',
        method: 'get',
      }),
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
        } catch {}
      },
    }),
    getPrivateFolder: builder.query<
      Files,
      { owner: string; customer: string; folderId: string }
    >({
      query: ({ owner = '', customer = '', folderId }) => {
        return {
          url: '/getPrivateFolder',
          method: 'get',
          params: {
            owner: owner,
            customer: customer,
            folderId: folderId,
          },
        }
      },
      async onCacheEntryAdded(args, { getState }) {
        try {
          //await getState
          console.log('queryFulfilled', getState())
        } catch {}
      },
    }),
    renameFile: builder.mutation<any, RenameFileRequestArgs>({
      query: (arg) => {
        console.log(arg)
        return {
          url: '/renameFile',
          method: 'put',
          data: arg,
        }
      },
      invalidatesTags: ['FILES'],
    }),
    uploadFile: builder.mutation<any, UploadFileRequestArgs>({
      query: ({ data, fullPath }) => {
        return {
          url: '/uploadFile',
          method: 'post',
          data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            username: localStorage.getItem('username'),
            fullPath,
          },
        }
      },
      invalidatesTags: ['FILES'],
    }),
  }),
})

// export const filesSearchApi = createApi({
//   reducerPath: 'FILESSEARCH',
//   tagTypes: ['FILESSEARCH'],
//   baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8080' }),
//   endpoints: (builder) => ({
//
//   }),
// })

// export const filesSearchByDateApi = createApi({
//   reducerPath: 'FILESSEARCHBYDATE',
//   tagTypes: ['FILESSEARCHBYDATE'],
//   baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8080' }),
//   endpoints: (builder) => ({
//     searchFilesByDate: builder.query<Files, string>({
//       query: (path = '') => ({
//         url: '/privateSearchByDate',
//         method: 'get',
//         params: {
//           username: localStorage.getItem('username'),
//           date: path,
//         },
//       }),
//       async onCacheEntryAdded(args, { getState }) {
//         try {
//           //await getState
//           console.log('queryFulfilled', getState())
//         } catch {}
//       },
//     }),
//   }),
// })

// export const foldersPublicApi = createApi({
//   reducerPath: 'PUBLICFOLDERS',
//   tagTypes: ['PUBLICFOLDERS'],
//   baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8080' }),
//   endpoints: (builder) => ({
//     PublicFolders: builder.query<Files, string>({
//       query: () => ({
//         url: '/publicAccess',
//         method: 'get',
//       }),
//       async onCacheEntryAdded(args, { getState }) {
//         try {
//           //await getState
//           console.log('queryFulfilled', getState())
//         } catch {}
//       },
//     }),
//   }),
// })

// export const filesPublicApi = createApi({
//   reducerPath: 'PUBLICFILES',
//   tagTypes: ['PUBLICFILES'],
//   baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8080' }),
//   endpoints: (builder) => ({
//     PublicFiles: builder.query<PublicFiles, string>({
//       query: (folderId = '') => ({
//         url: '/getFilesInPublicFolder',
//         method: 'get',
//         params: {
//           folderId: folderId,
//         },
//       }),
//       async onCacheEntryAdded(args, { getState }) {
//         try {
//           //await getState
//           console.log('queryFulfilled', getState())
//         } catch {}
//       },
//     }),
//   }),
// })

// export const filesFavoriteApi = createApi({
//   reducerPath: 'FILESFAVORITE',
//   tagTypes: ['FILESFAVORITE'],
//   baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8080' }),
//   endpoints: (builder) => ({
//     FilesFavorite: builder.query<Files, string>({
//       query: (path = '') => ({
//         url: '/favorite',
//         method: 'get',
//         params: {
//           username: localStorage.getItem('username'),
//         },
//       }),
//       async onCacheEntryAdded(args, { getState }) {
//         try {
//           //await getState
//           console.log('queryFulfilled', getState())
//         } catch {}
//       },
//     }),
//   }),
// })

export const {
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useRenameFileMutation,
  useUploadFileMutation,
  useLazySearchFilesByNameQuery,
  useLazyFilesFavoriteQuery,
  useLazySearchFilesByDateQuery,
  useLazyPublicFoldersQuery,
  useLazyPublicFilesQuery,
  useLazyAdminFilesQuery,
  useLazyGetPrivateFolderQuery,
} = filesApi
//export const { useSearchFilesByNameQuery, useLazySearchFilesByNameQuery } =
//filesSearchApi
// export const { useSearchFilesByDateQuery, useLazySearchFilesByDateQuery } =
//   filesSearchByDateApi
// export const { usePublicFoldersQuery, useLazyPublicFoldersQuery } =
//   foldersPublicApi
// export const { usePublicFilesQuery, useLazyPublicFilesQuery } = filesPublicApi
// export const { useLazyFilesFavoriteQuery } = filesFavoriteApi
