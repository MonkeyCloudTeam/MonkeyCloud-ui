import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { axiosInstance, axiosInstanceForDownload } from '../../api'
import { Header } from '../../components/Header/Header'

import { Grid } from '@mui/material'
import { CurrentPath } from '../../components/CurrentPath/CurrentPath'
import { SideBar } from '../../components/SideBar/SideBar'
import { FavoriteFilesList } from '../../components/FavoriteFileList/FavoriteFileList'
import Modal from '@mui/material/Modal'
import {
  useLazyFilesFavoriteQuery,
  useLazyGetFilesQuery,
} from '../../store/filesSlice'
import { HeaderFavorite } from '../../components/HeaderFavorite/HeaderFavorite'

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

const FavoritePage = () => {
  const [triggerFavorite, resultFavorite] = useLazyFilesFavoriteQuery()
  const userToken = localStorage.getItem('token')
  if (!userToken) {
    return <Navigate to='/sign-in' />
  }

  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <HeaderFavorite />
      </Grid>
      <Grid xs={2}>
        <SideBar />
      </Grid>
      <Grid xs={10} padding='8px'>
        <FavoriteFilesList
          triggerFavorite={triggerFavorite}
          data={resultFavorite?.data}
        />
      </Grid>
    </Grid>
  )
}
export { FavoritePage }
