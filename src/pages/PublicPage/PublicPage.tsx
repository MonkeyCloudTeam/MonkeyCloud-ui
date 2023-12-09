import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { axiosInstance, axiosInstanceForDownload } from '../../api'
import { Header } from '../../components/Header/Header'

import { Grid } from '@mui/material'
import { CurrentPath } from '../../components/CurrentPath/CurrentPath'
import { SideBar } from '../../components/SideBar/SideBar'
import { FilesList } from '../../components/FilesList/FilesList'
import { PublicFileList } from '../../components/PublicFileList/PublicFileList'
import { Tooltip } from '../../components/Tooltip/tooltip'
import Modal from '@mui/material/Modal'
import {
  useLazyGetFilesQuery,
  useLazyPublicFilesQuery,
  useLazyPublicFoldersQuery,
  useLazySearchFilesByDateQuery,
  useLazySearchFilesByNameQuery,
} from '../../store/filesSlice'
import { HeaderPublic } from '../../components/HeaderPublic/HeaderPublic'

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

const PublicPage = () => {
  const [triggerPublicFolders, resultPublicFolders] =
    useLazyPublicFoldersQuery()
  const [trigerPublicFiles, resultPublicFiles] = useLazyPublicFilesQuery()
  const { path } = useParams()
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [currentPath, setCurrentPath] = useState(
    localStorage.getItem('username') || '',
  )
  const userToken = localStorage.getItem('token')
  const data = resultPublicFolders.data
  const filesData = resultPublicFiles.data
  // const getContent = () => {
  //   if (resultPublicFiles.isUninitialized){
  //    return  <PublicFileList
  //      triggerPublicFolders={triggerPublicFolders}
  //      setCurrentPath={setCurrentPath}
  //      data={data}
  //      trigerPublicFiles={trigerPublicFiles}
  //    />
  //   }
  //   if (resultPublicFolders.)
  // }
  useEffect(() => {
    triggerPublicFolders('')
    //DownloadFile()
    //openModal()
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

  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <HeaderPublic setSearchString={setSearchString} />
      </Grid>
      <Grid xs={2}>
        <SideBar />
      </Grid>
      <Grid xs={10} padding='8px'>
        {/*<CurrentPath*/}
        {/*  currentPath={currentPath}*/}
        {/*  triggerGetFiles={triggerGetFiles}*/}
        {/*  setCurrentPath={setCurrentPath}*/}
        {/*/>*/}
        {/*{getContent()}*/}
      </Grid>
    </Grid>
  )
}
export { PublicPage }
