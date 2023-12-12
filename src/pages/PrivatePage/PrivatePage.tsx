import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { axiosInstance, axiosInstanceForDownload } from '../../api'
import { Header } from '../../components/Header/Header'

import { Button, Grid, TextField } from '@mui/material'
import { CurrentPath } from '../../components/CurrentPath/CurrentPath'
import { SideBar } from '../../components/SideBar/SideBar'
import { FilesList } from '../../components/FilesList/FilesList'
import { ToolTip } from '../../components/Tooltip/ToolTip'
import Modal from '@mui/material/Modal'
import {
  useLazyGetFilesQuery,
  useLazyGetPrivateFolderQuery,
  useLazyPublicFilesQuery,
  useLazySearchFilesByDateQuery,
  useLazySearchFilesByNameQuery,
  useRenameFileMutation,
} from '../../store/filesSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { PrivateFileList } from '../../components/PrivateFileList/PrivateFileList'
import { HeaderPrivate } from '../../components/HeaderPrivate/HeaderPrivate'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}
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

const PrivatePage = () => {
  const [triggerGetPublicFolder, resultPublicFolder] =
    useLazyGetPrivateFolderQuery()
  const [openModal, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const [trigerPublicFiles, resultPublicFiles] = useLazyPublicFilesQuery()
  const [triggerGetFiles, result, lastPromiseInfo] = useLazyGetFilesQuery()
  const data = resultPublicFolder.data
  const params = useParams()
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = useState(false)
  // const [currentPath, setCurrentPath] = useState(
  //   localStorage.getItem('username') || '',
  // )
  const userToken = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const searchMode = useSelector(
    (state: RootState) => state.appState.searchMode,
  )
  const handleOpen = () => {
    setOpen(true)
  }
  const currentPath = useSelector(
    (state: RootState) => state.appState.currentPath,
  )
  const searchString = useSelector(
    (state: RootState) => state.appState.searchString,
  )

  useEffect(() => {
    //@ts-ignore
    triggerGetPublicFolder({
      //@ts-ignore
      owner: params.owner,
      //@ts-ignore
      customer: username,
      //@ts-ignore
      folderId: params.folderId,
    }).then((data) => {
      if (data) {
        console.log(data.isError)
        //@ts-ignore
        if (data.status === 'rejected') {
          handleOpen()
          console.log('SOSI')
        }
      }
    })
  }, [])

  if (!userToken) {
    return <Navigate to='/sign-in' />
  }

  const ResponseForPublicAccess = async () => {
    try {
      const response = await axiosInstance.post('/getPrivateAccess', {
        //@ts-ignore
        owner: params.owner,
        //@ts-ignore
        customer: username,
        //@ts-ignore
        folderId: params.folderId,
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
    handleClose()
  }
  const handleLogOff = async () => {
    try {
      const response = await axiosInstance.post('/sign-out')
      console.log(response.data)
      localStorage.clear()
    } catch (error) {
      console.error(error)
      //@ts-ignore
      if (error?.response.status === 409) {
        localStorage.clear()
        navigate('/sign-in')
      }
    }
    navigate('/sign-in')
  }

  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <HeaderPrivate />
      </Grid>
      <Grid xs={2}>
        <SideBar />
      </Grid>
      <Grid xs={10} padding='8px'>
        {/*<CurrentPath*/}
        {/*  triggerGetFiles={triggerGetFiles}*/}
        {/*  currentPath={currentPath}*/}
        {/*/>*/}
        <PrivateFileList trigerPublicFiles={trigerPublicFiles} data={data} />
      </Grid>
      <Modal
        open={openModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            У вас нет доступа к папке. Запросить доступ?
          </Typography>
          <Button variant='contained' onClick={ResponseForPublicAccess}>
            Запросить
          </Button>
          <Link to='/main'>
            <Button onClick={handleClose} variant='text'>
              Вернуться на главную
            </Button>
          </Link>
        </Box>
      </Modal>
    </Grid>
  )
}
export { PrivatePage }
