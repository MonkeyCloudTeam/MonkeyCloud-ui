import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'GeneralApp',
  initialState: {
    searchString: '',
    currentPath: '',
    searchMode: false,
  },
  reducers: {
    setSearchString: (state, action) => {
      state.searchString = action.payload
    },
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload
    },
    setSearchMode: (state, action) => {
      state.searchMode = action.payload
      if (action.payload === false) {
        state.searchString = ''
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSearchString, setCurrentPath, setSearchMode } =
  appSlice.actions

export default appSlice.reducer
