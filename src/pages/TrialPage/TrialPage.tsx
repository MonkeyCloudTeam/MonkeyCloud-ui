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
import { PublicCurrentPath } from '../../components/PublicCurrentPath/PublicCurrentPath'
import { TrialFileList } from '../../components/TrialFileList/TrialFileList'
import { TrialSideBar } from '../../components/TrialSideBar/TrialSideBar'
import { HeaderTrial } from '../../components/HeaderTrial/HeaderTrial'

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

const TrialPage = () => {
  const [triggerPublicFolders, resultPublicFolders] =
    useLazyPublicFoldersQuery()
  const [trigerPublicFiles, resultPublicFiles] = useLazyPublicFilesQuery()
  const { path } = useParams()
  const navigate = useNavigate()
  const [itemsList, setItemsList] = useState(resultPublicFolders?.data)
  const [modalIsOpen, setIsOpen] = useState(false)
  const [searchString, setSearchString] = useState('')
  const userToken = localStorage.getItem('token')
  const data = resultPublicFolders?.data
  //@ts-ignore
  const filesData = resultPublicFiles?.data?.fileList
  useEffect(() => {
    triggerPublicFolders('')
    console.log(data)
    //DownloadFile()
    //openModal()
  }, [])
  // console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSS', trigerPublicFiles)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <HeaderTrial />
      </Grid>
      <Grid xs={2}>
        <TrialSideBar />
      </Grid>
      <Grid xs={10} padding='8px'>
        <PublicCurrentPath
          //@ts-ignore
          currentPath={resultPublicFiles?.data?.breadCrumbs}
        />
        <TrialFileList
          currentPath={resultPublicFiles?.data?.breadCrumbs}
          triggerPublicFolders={triggerPublicFolders}
          trigerPublicFiles={trigerPublicFiles}
          //@ts-ignore
          data={resultPublicFolders?.data}
        />
      </Grid>
    </Grid>
  )
}
export { TrialPage }
