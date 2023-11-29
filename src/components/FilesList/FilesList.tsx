import React, { useEffect, useState } from 'react'
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Container,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { axiosInstance } from '../../api'
import { useLocation } from 'react-router-dom'
import { inspect } from 'util'
import styles from './FilesList.module.scss'
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

const FilesList = ({
  setCurrentPath,
}: {
  setCurrentPath: (currentPath: string) => void
}) => {
  const location: any = useLocation()
  const [files, setFiles] = useState([])
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [menus, setMenus] = useState([])
  const open = Boolean(anchorEl)
  const [openModal, setOpen] = React.useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false)
  const handleClick =
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextMenus = menus
      // @ts-ignore
      nextMenus[index] = true
      setMenus(nextMenus)
      setAnchorEl(event.currentTarget)
    }

  const config = {
    params: {
      username: localStorage.getItem('username'),
      folder: '',
    },
  }

  const getUploadFiles = async () => {
    const response = await axiosInstance.get('/getFiles', config)
    // console.log(response)
    setFiles(response.data.list)
    const menus = response.data.list.map((m: any) => false)
    setMenus(menus)
  }

  const handleTableRowClick = (file: any) => async () => {
    const response = await axiosInstance.get('/getFiles', {
      params: {
        username: localStorage.getItem('username'),
        folder: '123/',
      },
    })
    setCurrentPath(response.data.list[0].breadCrums)
    // console.log(response)
    setFiles(response.data.list)
    const menus = response.data.list.map((m: any) => false)
    setMenus(menus)
  }
  //@ts-ignore
  // const GetFilesFromFolder = (index: number) => async () => {
  //   if (files[index].)
  // }

  useEffect(() => {
    getUploadFiles()
  }, [])

  const handleMenuClose = (index: number) => () => {
    const nextMenus = menus
    // @ts-ignore
    nextMenus[index] = false
    setMenus(nextMenus)
    setAnchorEl(null)
  }

  const handleMenuCloseForDelete = (index: number) => async () => {
    try {
      const response = await axiosInstance.delete('/deleteFile', {
        params: {
          username: localStorage.getItem('username'),
          //@ts-ignore
          fullPath: files[index].path,
        },
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
    setFiles(files)
    getUploadFiles()
    handleMenuClose(index)
  }

  const responseForRenameFile = (index: number) => async () => {
    const renameFile = document.getElementById('rename') as HTMLInputElement
    //@ts-ignore
    const file = files[index].name
    const extension = file.substring(file.lastIndexOf('.'))
    //@ts-ignore
    const path = files[index].breadCrums
    let cutPath = ''
    //@ts-ignore
    if (files[index].breadCrums === localStorage.getItem('username')) {
      cutPath = ''
    } else {
      cutPath = path.substring(path.indexOf('/') + 1) + '/'
    }
    //@ts-ignore
    console.log(cutPath)
    const requestBody = {
      username: localStorage.getItem('username'),
      fullPath: cutPath,
      //@ts-ignore
      oldName: files[index].name,
      //TODO Нельзя давать пользователю менять расширение файла
      //@ts-ignore
      newName: renameFile.value + extension,
    }
    console.log(files[index])
    try {
      const response = await axiosInstance.put('/renameFile', requestBody)
      const nextFiles = structuredClone(files)
      //@ts-ignore
      nextFiles[index].name = renameFile.value + extension
      setFiles(nextFiles)
    } catch (error) {
      console.error(error)
    }
    getUploadFiles()
    handleClose()
  }
  if (!files.length) {
    return <div>Папка пуста. Загрузите файлы.</div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {files.map((file: any, index) => (
            <TableRow
              //Поставить on click и проверить is dir //set files // вызывать функцию
              key={file.name}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                verticalAlign: 'baseline',
              }}
            >
              <Container
                onClick={handleTableRowClick(file)}
                className={styles.TableRowInnerContainer}
              >
                {file.isDir ? <FolderIcon /> : <PictureAsPdfIcon />}
                <TableCell component='th' scope='row'>
                  {file.name}
                </TableCell>
                <TableCell align='left'>{file.username}</TableCell>
                <TableCell align='left'>{file.data}</TableCell>
                {file.isDir !== true ? (
                  <TableCell align='left'>{file.size}</TableCell>
                ) : (
                  <TableCell align='left'>‒</TableCell>
                )}
              </Container>
              <TableCell align='right'>
                <IconButton
                  id='basic-button'
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick(index)}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  onClick={(event) => console.log(event)}
                  id='basic-menu'
                  anchorEl={anchorEl}
                  open={menus[index]}
                  onClose={handleMenuClose(index)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleMenuClose(index)}>Скачать</MenuItem>
                  <MenuItem onClick={handleOpen}>Переименовать</MenuItem>
                  <MenuItem onClick={handleMenuCloseForDelete(index)}>
                    Удалить
                  </MenuItem>
                  <Modal
                    open={openModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'
                  >
                    <Box sx={style}>
                      <Typography
                        id='modal-modal-title'
                        variant='h6'
                        component='h2'
                      >
                        Переименовать
                      </Typography>
                      <TextField fullWidth id='rename' />
                      <Button onClick={handleClose} variant='text'>
                        Отмена
                      </Button>
                      <Button
                        //@ts-ignore
                        onClick={responseForRenameFile(index)}
                        type='submit'
                        variant='contained'
                      >
                        Ок
                      </Button>
                    </Box>
                  </Modal>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { FilesList }
//handleMenuCloseForRename(index)
