import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { axiosInstance, axiosInstanceForDownload } from '../../api'
import { AdminHeader } from '../../components/AdminComponents/AdminHeader/AdminHeader'
import { AdminFileList } from '../../components/AdminComponents/AdminFileList/AdminFileList'
import { Grid } from '@mui/material'
import { CurrentPath } from '../../components/CurrentPath/CurrentPath'
import { SideBar } from '../../components/SideBar/SideBar'
import { FilesList } from '../../components/FilesList/FilesList'
import { ToolTip } from '../../components/Tooltip/ToolTip'
import Modal from '@mui/material/Modal'
import {
  useLazyAdminFilesQuery,
  useLazyGetFilesQuery,
  useLazySearchFilesByDateQuery,
  useLazySearchFilesByNameQuery,
  useRenameFileMutation,
} from '../../store/filesSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Header } from '../../components/Header/Header'
import { AdminBucketsList } from '../../components/AdminComponents/AdminFileList/AdminBucketsList'
import { AdminSideBar } from '../../components/AdminComponents/AdminSideBar/AdminSideBar'

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

const AdminPage = () => {
  const [triggerGetFiles, result, lastPromiseInfo] = useLazyGetFilesQuery()
  const [triggerSearchByDate, resultSearchByDate] =
    useLazySearchFilesByDateQuery()
  const [triggerAdminFiles, resultAdminFiles] = useLazyAdminFilesQuery()
  const { path } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState()
  const [modalIsOpen, setIsOpen] = useState(false)
  // const [currentPath, setCurrentPath] = useState(
  //   localStorage.getItem('username') || '',
  // )
  const userToken = localStorage.getItem('token')

  const searchMode = useSelector(
    (state: RootState) => state.appState.searchMode,
  )
  const currentPath = useSelector(
    (state: RootState) => state.appState.currentPath,
  )
  const searchString = useSelector(
    (state: RootState) => state.appState.searchString,
  )
  // let dataForFileList = result?.data
  // if (resultSearch?.data) {
  //   dataForFileList = resultSearch.data
  // }
  // // const data = searchString ? resultSearch?.data : result?.data
  // useEffect(() => {
  //   const data = searchMode ? resultSearch?.data : result?.data
  //   setData(data)
  //   //DownloadFile()
  //   //openModal()
  // }, [searchMode, resultSearch, resultSearchByDate, result])

  useEffect(() => {
    triggerAdminFiles('')
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
        <AdminHeader triggerSearchByDate={triggerSearchByDate} />
      </Grid>
      <Grid xs={2}>
        <AdminSideBar />
      </Grid>
      <Grid xs={10} padding='8px'>
        {/*<CurrentPath*/}
        {/*  currentPath={currentPath}*/}
        {/*  triggerGetFiles={triggerGetFiles}*/}
        {/*/>*/}
        {/*<AdminFileList*/}
        {/*  triggerGetFiles={triggerGetFiles}*/}
        {/*  triggerAdminFiles={triggerAdminFiles}*/}
        {/*  data={data}*/}
        {/*/>*/}
        <AdminBucketsList
          triggerGetFiles={triggerGetFiles}
          triggerAdminFiles={triggerAdminFiles}
          data={resultAdminFiles?.data}
        />
      </Grid>
    </Grid>
  )
}
export { AdminPage }
