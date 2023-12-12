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

const ToolTip = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const inputRefFolder = React.useRef<HTMLInputElement>(null)
  const inputRefFile = React.useRef<HTMLInputElement>(null)
  const username = localStorage.getItem('username')
  const { setMenus } = useMenus()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [triggerGetFiles, result] = useLazyGetFilesQuery()
  const { data } = result
  const [triggerUploadFile] = useUploadFileMutation()
  useEffect(() => {
    //@ts-ignore
    triggerGetFiles({ username, path: '' })
    //setCurrentPath(result?.data?.list[0]?.breadCrums as string)
  }, [])

  const handleUploadInputFileClick = () => {
    if (inputRefFile.current) {
      inputRefFile.current.click()
    }
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    file: IFile,
  ) => {
    if (e.target.files) {
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
        await triggerUploadFile({
          data: formData,
          fullPath: pathForGet,
        }).then((data) => {
          console.log(data)
          if (data) {
            //@ts-ignore
            localStorage.setItem('memory', data.data.size)
          }
        })
        //@ts-ignore
        triggerGetFiles({ username, path: pathForGet })
      } catch (error) {
        console.error(error)
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
    if (e.target.files) {
      const pathForRequest = localStorage.getItem('breadCrums')
      let pathForGet = ''
      if (pathForRequest === username || pathForRequest == 'undefined') {
        pathForGet = ''
      } else {
        pathForGet =
          pathForRequest?.substring(pathForRequest?.indexOf('/') + 1) + '/'
        console.log(pathForGet)
      }
      const formData = new FormData()
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append(`multipartFile`, structuredClone(e.target.files[i]))
        formData.append('fileName', structuredClone(e.target.files[i]).name)
      }
      console.log(file)
      try {
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
        localStorage.setItem('memory', response.data.size)
        // await getFiles().then((files) => setFiles(files))
        //const data = await response.json()
        console.log(response)
      } catch (error) {
        console.error(error)
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
    <Box sx={{ height: 100, flexGrow: 1 }}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel='SpeedDial tooltip example'
        sx={{ position: 'absolute', bottom: 16, right: 20 }}
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
    </Box>
  )
}

export { ToolTip }
