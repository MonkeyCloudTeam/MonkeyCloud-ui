import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { Grid } from '@mui/material'
import { SideBar } from '../../components/SideBar/SideBar'
import { PublicFileList } from '../../components/PublicFileList/PublicFileList'

import { useLazyPublicFilesQuery } from '../../store/filesSlice'
import { HeaderPublic } from '../../components/HeaderPublic/HeaderPublic'
import { PublicCurrentPath } from '../../components/PublicCurrentPath/PublicCurrentPath'

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
  const currentPath = ''
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
        {/*<PublicCurrentPath currentPath={currentPath} />*/}
        <PublicFileList
          currentPath={currentPath}
          trigerPublicFiles={trigerPublicFiles}
          //@ts-ignore
          data={resultPublicFiles?.data?.fileList}
        />
      </Grid>
    </Grid>
  )
}
export { PublicFilesPage }
