import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { axiosInstance, axiosInstanceForDownload } from '../../api'
import { Header } from '../../components/Header/Header'

import { Grid } from '@mui/material'
import { CurrentPath } from '../../components/CurrentPath/CurrentPath'
import { SideBar } from '../../components/SideBar/SideBar'
import { FilesList } from '../../components/FilesList/FilesList'
import { PublicFileList } from '../../components/PublicFileList/PublicFileList'
import { ToolTip } from '../../components/Tooltip/ToolTip'
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

const PublicFilesPage = () => {
  const { path } = useParams()
  const [trigerPublicFiles, resultPublicFiles] = useLazyPublicFilesQuery()
  const navigate = useNavigate()
  const [itemsList, setItemsList] = useState([])
  const [currentPath, setCurrentPath] = useState(
    localStorage.getItem('username') || '',
  )
  const userToken = localStorage.getItem('token')
  //@ts-ignore
  const filesData = resultPublicFiles?.data?.fileList
  useEffect(() => {
    if (path) {
      trigerPublicFiles(path)
      //@ts-ignore
      setItemsList(resultPublicFiles?.data?.fileList)
    }
  }, [path])
  if (!userToken) {
    return <Navigate to='/sign-in' />
  }

  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <HeaderPublic />
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
        <PublicFileList
          trigerPublicFiles={trigerPublicFiles}
          setCurrentPath={setCurrentPath}
          //@ts-ignore
          data={resultPublicFiles?.data?.fileList}
        />
      </Grid>
    </Grid>
  )
}
export { PublicFilesPage }
