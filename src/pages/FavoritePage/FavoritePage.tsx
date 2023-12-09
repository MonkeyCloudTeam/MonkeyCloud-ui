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
  const [triggerGetFiles, result, lastPromiseInfo] = useLazyGetFilesQuery()
  const { path } = useParams()
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [favorite, setFavorite] = useState([])
  const [triggerFavorite, resultFavorite] = useLazyFilesFavoriteQuery()
  const favoriteData = resultFavorite.data
  const [currentPath, setCurrentPath] = useState(
    localStorage.getItem('username') || '',
  )
  const userToken = localStorage.getItem('token')

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
        <Header />
      </Grid>
      <Grid xs={2}>
        <SideBar />
      </Grid>
      <Grid xs={10} padding='8px'>
        {/*<CurrentPath currentPath={currentPath} />*/}
        <FavoriteFilesList
          triggerFavorite={triggerFavorite}
          setCurrentPath={setCurrentPath}
          triggerGetFiles={triggerGetFiles}
          data={resultFavorite?.data}
        />
      </Grid>
    </Grid>
  )
}
export { FavoritePage }
