import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { axiosInstance } from '../../api'
import { Header } from '../../components/Header/Header'

import { Grid } from '@mui/material'
import { CurrentPath } from '../../components/CurrentPath/CurrentPath'
import { SideBar } from '../../components/SideBar/SideBar'
import { FilesList } from '../../components/FilesList/FilesList'
import Modal from '@mui/material/Modal'

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
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(
    localStorage.getItem('username') || '',
  )
  const userToken = localStorage.getItem('token')
  const dataForDeleteFolder = {
    params: {
      username: localStorage.getItem('username'),
      fullPath: '228',
    },
  }
  const handleMenuCloseForDeleteFolder = async () => {
    try {
      const response = await axiosInstance.delete(
        '/deleteFolder',
        dataForDeleteFolder,
      )
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  const dataForRename = {
    username: localStorage.getItem('username'),
    fullPath: '228/',
    oldName: '23',
    //TODO Нельзя давать пользователю ставить расширешние (.) в название папки P.S Запретить пользователю использовать точку.
    newName: '444',
  }
  const handleMenuCloseForRename = async () => {
    try {
      const response = await axiosInstance.put('/renameFolder', dataForRename)
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    //handleMenuCloseForRename()
    //openModal()
    //getUploadFiles()
    //handleMenuCloseForDeleteFolder()
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

  console.log(localStorage.getItem('token'))
  console.log(localStorage.getItem('username'))

  const handleLogOff = async () => {
    try {
      const response = await axiosInstance.post('/sign-out')
      console.log(response)
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
        <CurrentPath currentPath={currentPath} />
        <FilesList setCurrentPath={setCurrentPath} />
      </Grid>
    </Grid>
  )
}
export { MainPage }
