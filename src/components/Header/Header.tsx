import React, { useState } from 'react'
import { axiosInstance } from '../../api'
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
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import { Button, TextField } from '@mui/material'
import styles from './Header.module.scss'

//TODO Вставить картинку 133

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = structuredClone(e.target.files[0])
      console.log(file)
      setFile(file)
    }
  }
  const handleUpload = async () => {
    if (file) {
      console.log('Uploading file...')
      console.log(file.name)
      const formData = new FormData()
      formData.append('multipartFile', file)
      formData.append('fileName', file.name)
      const requestBody = {
        // username: localStorage.getItem('username'),
        // fullPath: '',
        multipartFile: formData,
      }
      //const fullPAth = `/${file.name}
      try {
        const response = await axiosInstance.post('/uploadFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        //@ts-ignore
        //const data = await response.json()
        //console.log(data);
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
  }

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
        localStorage.clear()
        navigate('/sign-in')
      }
    }
    handleCloseUserMenu()
    navigate('/sign-in')
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
          <input type='file' id='input' onChange={handleFileChange} />
          <Button
            className={styles.UploadButton}
            variant='contained'
            onClick={handleUpload}
          >
            UPLOAD
          </Button>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  src='../../assets/images/avatar.jpg'
                  sx={{ bgcolor: 'lightBlue' }}
                />
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
              <MenuItem key='telegramId' onClick={handleCloseUserMenu}>
                <Typography textAlign='center'>Telegram ID</Typography>
              </MenuItem>
              <MenuItem key='logoutButton' onClick={handleLogOff}>
                <Typography textAlign='center'>Выход</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export { Header }
