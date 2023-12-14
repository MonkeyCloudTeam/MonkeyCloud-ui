import React, { useEffect, useState } from 'react'
import { axiosInstance, axiosInstanceForUpload, getFiles } from '../../api'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import avatar from '../../assets/images/avatar.jpg'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import {
  alpha,
  Button,
  InputAdornment,
  InputBase,
  styled,
  TextField,
} from '@mui/material'
import styles from './HeaderPrivate.module.scss'
import SearchIcon from '@mui/icons-material/Search'
import { useMenus } from '../../hooks/useMenus'
import { useLazyGetFilesQuery } from '../../store/filesSlice'
import { IFile } from '../../store/types'
import { SearchField } from '../Search/Search'
import Modal from '@mui/material/Modal'
import { setCurrentPath } from '../../store/commonReducer'
import { useDispatch } from 'react-redux'
//TODO Вставить картинку 133

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const HeaderPrivate = ({}: {}) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )
  const handleClose = () => {
    setOpen(false)
    handleCloseUserMenu()
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const username = localStorage.getItem('username')
  const { setMenus } = useMenus()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [triggerGetFiles, result] = useLazyGetFilesQuery()
  const { data } = result
  const [openModal, setOpen] = React.useState(false)
  const dispatch = useDispatch()
  useEffect(() => {}, [])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogOff = async () => {
    try {
      const response = await axiosInstance.post('/sign-out')
      console.log(response)
      localStorage.clear()
    } catch (error) {
      console.error(error)
      //@ts-ignore
      if (error?.response.status === 409) {
        dispatch(setCurrentPath(''))
        localStorage.clear()
        navigate('/sign-in')
      }
    }
    handleCloseUserMenu()
    navigate('/sign-in')
  }

  const handleTelegrammId = async () => {
    const telegrammId = document.getElementById(
      'telegrammId',
    ) as HTMLInputElement
    try {
      const response = await axiosInstance.post('/addTelegramId', {
        body: {
          telegramId: telegrammId.value,
          username: username,
        },
      })
      console.log(response)
      localStorage.clear()
    } catch (error) {
      console.error(error)
    }
    handleCloseUserMenu()
    handleClose()
  }

  return (
    <AppBar position='static' className={styles.Header}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='#app-bar-with-responsive-menu'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Monkey Cloud
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='#app-bar-with-responsive-menu'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Monkey Cloud
          </Typography>{' '}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Настройки'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={avatar} sx={{ bgcolor: 'lightBlue' }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key='userName'>
                <Typography textAlign='center'>
                  {localStorage.getItem('username')}
                </Typography>
              </MenuItem>
              <MenuItem key='telegramId' onClick={handleOpen}>
                <Typography textAlign='center'>Telegram ID</Typography>
              </MenuItem>
              <MenuItem key='logoutButton' onClick={handleLogOff}>
                <Typography textAlign='center'>Выход</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
        <Modal
          open={openModal}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Введите Telegram ID
            </Typography>
            <TextField fullWidth id='telegrammId' />
            <Button onClick={handleClose} variant='text'>
              Отмена
            </Button>
            <Button
              onClick={handleTelegrammId}
              type='submit'
              variant='contained'
            >
              Ок
            </Button>
          </Box>
        </Modal>
      </Container>
    </AppBar>
  )
}

export { HeaderPrivate }
