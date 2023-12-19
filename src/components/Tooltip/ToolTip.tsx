import * as React from 'react'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useMenus } from '../../hooks/useMenus'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  useLazyGetFilesQuery,
  useRenameFileMutation,
  useUploadFileMutation,
} from '../../store/filesSlice'
import { IFile } from '../../store/types'
import { axiosInstanceForUpload } from '../../api'
import styles from '../Header/Header.module.scss'
import Typography from '@mui/material/Typography'
import { Button, TextField } from '@mui/material'
import Modal from '@mui/material/Modal'
import { Simulate } from 'react-dom/test-utils'
import error = Simulate.error

const ToolTip = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleOpenModal = () => setOpenModal(true)
  const handleClose = () => setOpen(false)
  const handleCloseModal = () => setOpenModal(false)
  const inputRefFolder = React.useRef<HTMLInputElement>(null)
  const inputRefFile = React.useRef<HTMLInputElement>(null)
  const username = localStorage.getItem('username')
  const { setMenus } = useMenus()
  const navigate = useNavigate()
  const [textInModal, setTextInModal] = useState(
    'Файл загружается,пожалуйста подождите...',
  )
  const [buttonIsVisible, setButtonIsVisible] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [triggerGetFiles, result] = useLazyGetFilesQuery()
  const { data } = result
  const [triggerUploadFile] = useUploadFileMutation()
  const [openModal, setOpenModal] = React.useState(false)
  useEffect(() => {
    //@ts-ignore
    triggerGetFiles({ username, path: '' })
    //setCurrentPath(result?.data?.list[0]?.breadCrums as string)
  }, [])

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const handleUploadInputFileClick = () => {
    if (inputRefFile.current) {
      inputRefFile.current.click()
    }
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    file: IFile,
  ) => {
    if (e.target.files?.length) {
      setButtonIsVisible(false)
      setTextInModal('Файл загружается,пожалуйста подождите...')
      const pathForRequest = localStorage.getItem('breadCrums')
      const fileToUpload = structuredClone(e.target.files[0])
      const formData = new FormData()
      formData.append('multipartFile', fileToUpload)
      formData.append('fileName', fileToUpload.name)
      let pathForGet = ''
      if (pathForRequest === username || pathForRequest == 'undefined') {
        pathForGet = ''
      } else {
        pathForGet =
          pathForRequest?.substring(pathForRequest?.indexOf('/') + 1) + '/'
        console.log(pathForGet)
      }
      try {
        handleOpenModal()
        await triggerUploadFile({
          data: formData,
          fullPath: pathForGet,
          //@ts-ignore
        }).then((data) => {
          console.log('DATA', data)
          //@ts-ignore
          if (data?.error) {
            setButtonIsVisible(true)
            setTextInModal('Не хватает места на диске.')
          } else if (data) {
            //@ts-ignore
            if (data.data.massage === 'Файл загружен корректно') {
              setButtonIsVisible(true)
              setTextInModal('Файл загружен успешно.')
            }
            //@ts-ignore
            localStorage.setItem('memory', data.data.size)
          }
        })
        //@ts-ignore
        triggerGetFiles({ username, path: pathForGet })
      } catch (error) {
        //@ts-ignore
        console.log(error)
      }
      setOpen(false)
    }
  }

  const handleUploadInputFolderClick = () => {
    if (inputRefFolder.current) {
      inputRefFolder.current.click()
    }
  }

  const handleFolderChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    file: IFile,
  ) => {
    if (e.target?.files?.length) {
      setButtonIsVisible(false)
      setTextInModal('Папка загружается,пожалуйста подождите...')
      const pathForRequest = localStorage.getItem('breadCrums')
      let pathForGet = ''
      if (pathForRequest === username || pathForRequest == 'undefined') {
        pathForGet = ''
      } else {
        pathForGet =
          pathForRequest?.substring(pathForRequest?.indexOf('/') + 1) + '/'
      }
      const formData = new FormData()
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append(`multipartFile`, structuredClone(e.target.files[i]))
        formData.append('fileName', structuredClone(e.target.files[i]).name)
      }
      try {
        handleOpenModal()
        const response = await axiosInstanceForUpload.post(
          '/uploadFolder',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: {
              username: localStorage.getItem('username'),
              fullPath: pathForGet,
            },
          },
        )
        if (response.request.status === 200) {
          setButtonIsVisible(true)
          setTextInModal('Папка загружена успешно.')
        }
        localStorage.setItem('memory', response.data.size)
        console.log('RDAD', response)
      } catch (response: any) {
        if (response.request.status === 400) {
          setButtonIsVisible(true)
          setTextInModal('Не хватает места на диске.')
        }
      }
      //@ts-ignore
      triggerGetFiles({ username, path: pathForGet })
    }
  }

  const actions = [
    {
      icon: <UploadFileIcon />,
      name: 'Upload file ',
      onClick: handleUploadInputFileClick,
    },
    {
      icon: <DriveFolderUploadIcon />,
      name: 'Upload folder',
      onClick: handleUploadInputFolderClick,
    },
  ]

  return (
    <Box>
      <SpeedDial
        ariaLabel='SpeedDial basic example'
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 20,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            //@ts-ignore
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
      <input
        name='file'
        type='file'
        ref={inputRefFile}
        style={{ display: 'none' }}
        //ref={inputRef}
        id='input__file'
        className={styles.input__file}
        //@ts-ignore
        onChange={handleFileChange}
      />
      <input
        name='folder'
        type='file'
        ref={inputRefFolder}
        id='input__folder'
        style={{ display: 'none' }}
        multiple
        webkitdirectory='true'
        className={styles.input__file}
        //@ts-ignore
        onChange={handleFolderChange}
      />
      <Modal
        open={openModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            {textInModal}
          </Typography>
          {buttonIsVisible && (
            <Button variant='contained' onClick={handleCloseModal}>
              Ок
            </Button>
          )}
        </Box>
      </Modal>
    </Box>
  )
}

export { ToolTip }
