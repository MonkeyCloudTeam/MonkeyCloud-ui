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
  useLazySearchFilesByDateQuery,
  useLazySearchFilesByNameQuery,
  useRenameFileMutation,
} from '../../store/filesSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

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

const MainPage = () => {
  const [triggerGetFiles, result, lastPromiseInfo] = useLazyGetFilesQuery()
  const [triggerSearch, resultSearch] = useLazySearchFilesByNameQuery()
  const [triggerSearchByDate, resultSearchByDate] =
    useLazySearchFilesByDateQuery()
  const { path } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(result?.data)
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
    const data = searchMode
      ? resultSearch?.data || resultSearchByDate?.data
      : result?.data
    setData(data)
    //DownloadFile()
    //openModal()
  }, [searchMode, resultSearch, resultSearchByDate, result])

  useEffect(() => {
    console.log('PATH', currentPath)
    console.log('NAME', username)
    //@ts-ignore
    triggerGetFiles({ username, path: currentPath })
  }, [username, currentPath])

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
        <Header
          triggerSearch={triggerSearch}
          triggerSearchByDate={triggerSearchByDate}
        />
      </Grid>
      <Grid xs={2}>
        <ToolTip />
        <SideBar />
      </Grid>
      <Grid xs={10} padding='8px'>
        <CurrentPath
          currentPath={currentPath}
          triggerGetFiles={triggerGetFiles}
        />
        <FilesList
          triggerGetFiles={triggerGetFiles}
          triggerSearch={triggerSearch}
          triggerSearchByDate={triggerSearchByDate}
          data={data}
        />
      </Grid>
    </Grid>
  )
}
export { MainPage }
