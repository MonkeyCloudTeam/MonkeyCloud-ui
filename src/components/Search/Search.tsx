import * as React from 'react'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useMenus } from '../../hooks/useMenus'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useLazyGetFilesQuery } from '../../store/filesSlice'
import { IFile } from '../../store/types'
import { axiosInstance, axiosInstanceForUpload } from '../../api'
import styles from '../Header/Header.module.scss'
import { alpha, Button, InputBase, styled } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { setSearchMode, setSearchString } from '../../store/commonReducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { BY_DATE_SEARCH_MODE, BY_NAME_SEARCH_MODE } from '../../constants'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ListItemIcon from '@mui/material/ListItemIcon'
import EditNoteIcon from '@mui/icons-material/EditNote'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))
const SearchField = ({
  triggerGetFiles,
  triggerSearch,
  triggerSearchByDate,
}: {
  triggerGetFiles: any
  triggerSearch: any
  triggerSearchByDate: any
}) => {
  const dispatch = useDispatch()
  const searchString = useSelector(
    (state: RootState) => state.appState.searchString,
  )
  const username = localStorage.getItem('username')
  const getSearchItem = (e: any) => {
    dispatch(setSearchString(e.target.value))
  }
  const handleFileSearchClick = () => {
    dispatch(setSearchMode(BY_NAME_SEARCH_MODE))
    triggerSearch(searchString)
    handleCloseSearch()
  }

  const handleFileSearchByDateClick = () => {
    triggerSearchByDate(searchString)
    dispatch(setSearchMode(BY_DATE_SEARCH_MODE))
    handleCloseSearch()
  }
  const [anchorElSearch, setAnchorElSearch] =
    React.useState<null | HTMLElement>(null)
  const openSearch = Boolean(anchorElSearch)
  const handleClickSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElSearch(event.currentTarget)
  }
  const handleCloseSearch = () => {
    setAnchorElSearch(null)
  }
  // const responseForSearchByName = () => async () => {
  //   try {
  //     const response = await axiosInstance.get('/privateSearchByFilename', {
  //       params: {
  //         username: username,
  //         filename: searchString,
  //       },
  //     })
  //     console.log(response)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  //
  // const responseForSearchByDate = () => async () => {
  //   try {
  //     const response = await axiosInstance.get('/privateSearchByDate', {
  //       params: {
  //         username: username,
  //         date: '09.12.2023',
  //       },
  //     })
  //     console.log(response)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        value={searchString}
        onChange={getSearchItem}
        placeholder='Поиск…'
        inputProps={{ 'aria-label': 'search' }}
      />
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          onClick={handleClickSearch}
          color='inherit'
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Button
        id='basic-button'
        aria-controls={openSearch ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={openSearch ? 'true' : undefined}
        onClick={handleClickSearch}
      >
        <ExpandMoreIcon sx={{ color: 'white' }} />
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorElSearch}
        open={openSearch}
        onClose={handleCloseSearch}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleFileSearchClick}>
          <ListItemIcon sx={{ color: 'black' }}>
            <EditNoteIcon fontSize='small' />
          </ListItemIcon>
          По имени
        </MenuItem>
        <MenuItem onClick={handleFileSearchByDateClick}>
          <ListItemIcon sx={{ color: 'black' }}>
            <CalendarMonthIcon fontSize='small' />
          </ListItemIcon>
          По дате
        </MenuItem>
      </Menu>
      {/*<button onClick={handleFileSearchClick}>Name</button>*/}
      {/*<button onClick={handleFileSearchByDateClick}>Date</button>*/}
    </Search>
  )
}

export { SearchField }
