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
import styles from '../Header/Header.module.scss'
import SearchIcon from '@mui/icons-material/Search'
import { useMenus } from '../../hooks/useMenus'
import { useLazyGetFilesQuery } from '../../store/filesSlice'
import { IFile } from '../../store/types'
import { SearchField } from '../Search/Search'
import Modal from '@mui/material/Modal'
import { setCurrentPath } from '../../store/commonReducer'
import { useDispatch } from 'react-redux'
import avatarItem from '../../assets/images/monkey2.png'
import Divider from '@mui/material/Divider'

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

const HeaderPublic = ({
  setSearchString,
  triggerSearch,
  triggerSearchByDate,
}: {
  setSearchString?: any
  triggerSearch?: any
  triggerSearchByDate?: any
}) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )
  const handleClose = () => {
    handleCloseUserMenu()
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const dispatch = useDispatch()
  const username = localStorage.getItem('username')
  const { setMenus } = useMenus()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [triggerGetFiles, result] = useLazyGetFilesQuery()
  const { data } = result
  const [openModal, setOpen] = React.useState(false)
  const [textField, setTextField] = useState(true)
  const [textError, setTextError] = useState(false)
  useEffect(() => {
    //@ts-ignore
    triggerGetFiles({ username, path: '' })
    //setCurrentPath(result?.data?.list[0]?.breadCrums as string)
  }, [])

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    file: IFile,
  ) => {
    if (e.target.files) {
      const pathForRequest = localStorage.getItem('breadCrums')
      const fileToUpload = structuredClone(e.target.files[0])
      const formData = new FormData()
      formData.append('multipartFile', fileToUpload)
      formData.append('fileName', fileToUpload.name)
      let pathForGet = ''
      if (pathForRequest === username) {
        pathForGet = ''
      } else {
        pathForGet =
          pathForRequest?.substring(pathForRequest?.indexOf('/') + 1) + '/'
        console.log(pathForGet)
      }
      try {
        const response = await axiosInstanceForUpload.post(
          '/uploadFile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: {
              username: localStorage.getItem('username'),
              fullPath: pathForGet,
            },
          },
        )
        // await getFiles().then((files) => setFiles(files))
        //const data = await response.json()
        console.log(response)
      } catch (error) {
        console.error(error)
      }
      //@ts-ignore
      triggerGetFiles({ username, path: pathForGet })
    }
  }

  const handleFolderChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    file: IFile,
  ) => {
    if (e.target.files) {
      const pathForRequest = localStorage.getItem('breadCrums')
      let pathForGet = ''
      if (pathForRequest === username) {
        pathForGet = ''
      } else {
        pathForGet =
          pathForRequest?.substring(pathForRequest?.indexOf('/') + 1) + '/'
        console.log(pathForGet)
      }
      const formData = new FormData()
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append(`multipartFile`, structuredClone(e.target.files[i]))
        formData.append('fileName', structuredClone(e.target.files[i]).name)
      }
      const Path = data?.list[0].breadCrums
      console.log(file)
      try {
        const response = await axiosInstanceForUpload.post(
          '/uploadFolder',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: {
              username: localStorage.getItem('username'),
              fullPath: pathForGet,
            },
          },
        )
        // await getFiles().then((files) => setFiles(files))
        //const data = await response.json()
        console.log(response)
      } catch (error) {
        console.error(error)
      }
      //@ts-ignore
      triggerGetFiles({ username, path: pathForGet })
    }
  }

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleOpenTelegramm = () => {
    setTextField(true)
    setOpen(true)
    setAnchorElNav(null)
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
    dispatch(setCurrentPath(''))
    handleCloseUserMenu()
    navigate('/sign-in')
  }

  const handleTelegrammId = async () => {
    const telegrammId = document.getElementById(
      'telegrammId',
    ) as HTMLInputElement
    if (telegrammId.value != '') {
      try {
        const response = await axiosInstance.post('/addTelegramId', {
          telegramId: telegrammId.value,
          username: username,
        })
        handleCloseUserMenu()
        handleClose()
        console.log(response)
      } catch (error) {
        //@ts-ignore
        if (error?.response.status === 400) {
          setTextField(false)
        }
      }
    } else {
      setTextField(false)
    }
  }

  return (
    <AppBar
      position='static'
      className={styles.Header}
      sx={{ justifyContent: 'flex-start', color: 'black' }}
    >
      <Container maxWidth='xl' sx={{ justifyContent: 'flex-start' }}>
        <Toolbar disableGutters>
          <Avatar
            sx={{ marginRight: '15px' }}
            className={styles.iconHeader}
            src={avatarItem}
            variant='square'
          />
          {/*<AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />*/}
          <Typography
            className={styles.Typography}
            variant='h6'
            noWrap
            component='a'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              width: '13%',
            }}
          >
            Monkey Cloud
          </Typography>
          <Box sx={{ flexGrow: 0, marginLeft: '1140px' }}>
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
                <Typography sx={{ textAlign: 'center', marginLeft: '20px' }}>
                  {localStorage.getItem('username')}
                </Typography>
              </MenuItem>
              <Divider
                sx={{ color: 'black', borderColor: 'rgba(0, 0, 0, 0.32)' }}
              />
              <MenuItem key='telegramId' onClick={handleOpenTelegramm}>
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
            <Typography
              sx={{ marginBottom: '10px' }}
              id='modal-modal-title'
              variant='h6'
              component='h2'
            >
              Введите Telegram ID
            </Typography>
            {textField && <TextField required fullWidth id='telegrammId' />}
            {!textField && (
              <TextField
                error
                helperText='Ошибка добавления Telegram Id.'
                required
                fullWidth
                id='telegrammId'
              />
            )}
            <Button
              sx={{ color: '#030129 ', marginTop: '10px' }}
              onClick={handleClose}
              variant='text'
            >
              Отмена
            </Button>
            <Button
              sx={{
                backgroundColor: '#030129 ',
                marginTop: '10px',
              }}
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

export { HeaderPublic }
