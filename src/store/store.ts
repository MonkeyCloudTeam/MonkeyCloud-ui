import { configureStore } from '@reduxjs/toolkit'
import {
  filesApi,
  // filesFavoriteApi,
  // filesPublicApi,
  // filesSearchByDateApi,
  // foldersPublicApi,
} from './filesSlice'
import commonReducer, { appSlice } from './commonReducer'
// import { filesSearchApi } from './filesSlice'

export const store = configureStore({
  reducer: {
    [filesApi.reducerPath]: filesApi.reducer,
    appState: appSlice.reducer,
    // [filesSearchApi.reducerPath]: filesSearchApi.reducer,
    // [filesSearchByDateApi.reducerPath]: filesSearchByDateApi.reducer,
    // [foldersPublicApi.reducerPath]: foldersPublicApi.reducer,
    // [filesPublicApi.reducerPath]: filesPublicApi.reducer,
    // [filesFavoriteApi.reducerPath]: filesFavoriteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(filesApi.middleware),
  // .concat(filesSearchApi.middleware)
  // .concat(filesSearchByDateApi.middleware)
  // .concat(foldersPublicApi.middleware)
  // .concat(filesPublicApi.middleware),
  // .concat(filesFavoriteApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
