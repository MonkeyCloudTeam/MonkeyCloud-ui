import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { axiosInstance, axiosInstanceForDownload } from '../../api'
import { Header } from '../../components/Header/Header'

import { Grid } from '@mui/material'
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

const PrivatePage = () => {
  const [triggerGetPublicFolder, resultPublicFolder] =
    useLazyGetPrivateFolderQuery()
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
      console.log(data)
    })
  }, [])

  if (!userToken) {
    return <Navigate to='/sign-in' />
  }

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
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
        <CurrentPath
          triggerGetFiles={triggerGetFiles}
          currentPath={currentPath}
        />
        <PrivateFileList trigerPublicFiles={trigerPublicFiles} data={data} />
      </Grid>
    </Grid>
  )
}
export { PrivatePage }
