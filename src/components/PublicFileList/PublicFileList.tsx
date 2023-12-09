import React, { useEffect, useState } from 'react'
import {
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Checkbox,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { axiosInstance, axiosInstanceForDownload } from '../../api'
import styles from './PublicFileList.module.scss'
import { useMenus } from '../../hooks/useMenus'
import { useGetFilesQuery, useLazyGetFilesQuery } from '../../store/filesSlice'
import { IFile } from '../../store/types'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { Link, useParams } from 'react-router-dom'
import { GoStar, GoStarFill } from 'react-icons/go'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'

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

const PublicFileList = ({
  setCurrentPath,
  data,
  triggerPublicFolders,
  trigerPublicFiles,
}: {
  setCurrentPath: (currentPath: string) => void
  data: any
  triggerPublicFolders: any
  trigerPublicFiles: any
}) => {
  const bc = data?.list[0]?.breadCrums as string
  localStorage.setItem('breadCrums', bc)
  const { path } = useParams()
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  //const { data, error, isLoading } = useGetFilesQuery(path || '')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [menus, setMenus] = useState([])
  const open = Boolean(anchorEl)
  const [openModal, setOpen] = React.useState(false)
  const [openShareModal, setOpenShareModal] = React.useState(false)
  const [openPublicAccessModal, setOpenPublicAccessModal] =
    React.useState(false)
  const username = localStorage.getItem('username')
  const label1 = { inputProps: { 'aria-label': 'Checkbox none' } }
  useEffect(() => {
    if (data && data?.list) {
      const nextMenus = data.list.map((m: any) => false)
      // @ts-ignore
      setMenus(nextMenus)
    }
  }, [data])
  useEffect(() => {
    triggerPublicFolders('')
    const bc = data?.list[0]?.breadCrums as string
    localStorage.setItem('breadCrums', bc)
    //setCurrentPath(result?.data?.list[0]?.breadCrums as string)
  }, [])

  const handleOpen = () => {
    setOpen(true)
  }
  const handleOpenShareModal = () => {
    setOpenShareModal(true)
  }
  const handleOpenPublicModal = () => {
    setOpenPublicAccessModal(true)
  }

  const handleClose = () => setOpen(false)
  const handleCloseShareModal = () => setOpenShareModal(false)
  const handleClosePublicModal = () => setOpenPublicAccessModal(false)

  const handleClick =
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextMenus = menus
      // @ts-ignore
      nextMenus[index] = true
      setMenus(nextMenus)
      setAnchorEl(event.currentTarget)
    }

  const handleTableRowClick = (file: IFile) => async () => {
    let FolderId = file.folderId
    if (file.isDir) {
      //@ts-ignore
      await trigerPublicFiles(FolderId).then((data1) => {
        const bc = data1?.data?.list[0]?.breadCrums as string
        let path_full = bc.substring(bc.indexOf('/') + 1) + '/'
        localStorage.setItem('breadCrums', bc)
        console.log('breadCrums', bc)
        setCurrentPath(bc)
      })
    }
    // const response = await axiosInstance.get('/getFiles', {
    //   params: {
    //     username: localStorage.getItem('username'),
    //     folder: '123/',
    //   },
    // })
    //setCurrentPath(file.breadCrums)
    // // console.log(response)
    // const menus = response.data.list.map((m: any) => false)
    // setMenus(menus)
  }
  //@ts-ignore
  // const GetFilesFromFolder = (index: number) => async () => {
  //   if (files[index].)
  // }

  const handleMenuClose = (index: number) => () => {
    const nextMenus = menus
    // @ts-ignore
    nextMenus[index] = false
    setMenus(nextMenus)
    setAnchorEl(null)
  }

  const handleMenuCloseForDelete = (index: number) => async () => {
    const Path = data?.list[index].breadCrums
    let pathToTriger = ''
    if (username === data?.list[index].breadCrums) {
      pathToTriger = ''
    } else {
      pathToTriger = Path?.substring(Path?.indexOf('/') + 1) + '/'
    }
    if (data?.list[index].isDir === true) {
      try {
        const response = await axiosInstance.delete('/deleteFolder', {
          params: {
            username: username,
            fullPath: data.list[index].path,
          },
        })
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const response = await axiosInstance.delete('/deleteFile', {
          params: {
            username: username,
            fullPath: data?.list[index].path,
          },
        })
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
    //await triggerGetFiles(pathToTriger)
    handleMenuClose(index)
  }

  const responseForPublicAccess = (index: number) => async () => {
    try {
      const response = await axiosInstance.put('/openFolder', {
        folderId: data.list[index].folderId,
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    setOpenPublicAccessModal(false)
  }

  const DownloadFile = (index: number) => async () => {
    function saveAs(uri: any, filename: any) {
      const link = document.createElement('a')
      if (typeof link.download === 'string') {
        link.href = uri
        link.download = filename

        //Firefox requires the link to be in the body
        document.body.appendChild(link)

        //simulate click
        link.click()

        //remove the link when done
        document.body.removeChild(link)
      } else {
        window.open(uri)
      }
    }
    try {
      const response = await axiosInstanceForDownload.get('/downloadFile', {
        params: {
          username: username,
          fullPath: data?.list[index].path,
        },
      })
      const blob_file = response.data
      const file_url = URL.createObjectURL(blob_file)
      saveAs(file_url, data?.list[index].name)
      console.log(response.headers)
    } catch (error) {
      console.error(error)
    }
    handleMenuClose(index)
  }

  if (!data?.list.length) {
    return <div>Папка пуста. Загрузите файлы.</div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IFile, index: number) => (
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
                <TableCell align='left'>{file.date}</TableCell>
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
                  {file.isDir ? (
                    <Box>
                      <MenuItem onClick={handleOpenPublicModal}>
                        Открыть доступ
                      </MenuItem>
                      <MenuItem onClick={handleOpenShareModal}>
                        Поделиться
                      </MenuItem>
                    </Box>
                  ) : (
                    <MenuItem onClick={DownloadFile(index)}>Скачать</MenuItem>
                  )}
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
                        type='submit'
                        variant='contained'
                      >
                        Ок
                      </Button>
                    </Box>
                  </Modal>
                  <Modal
                    open={openShareModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'
                  >
                    <Box sx={style}>
                      <Typography
                        id='modal-modal-title'
                        variant='h6'
                        component='h2'
                      >
                        Доступ - {file.name}
                      </Typography>
                      <TextField fullWidth id='rename' />
                      <Button
                        //onClick={handleCloseShareModal}
                        //@ts-ignore
                        //onClick={responseForRenameFile(index)}
                        type='submit'
                        variant='contained'
                      >
                        Ок
                      </Button>
                    </Box>
                  </Modal>
                  <Modal
                    open={openPublicAccessModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'
                  >
                    <Box sx={style}>
                      <Typography
                        id='modal-modal-title'
                        variant='h6'
                        component='h2'
                      >
                        Вы действительно хотите открыть доступ?
                      </Typography>
                      {/*<TextField fullWidth id='rename' />*/}
                      <Button
                        //onClick={handleClosePublicModal}
                        //@ts-ignore
                        //onClick={responseForPublicAccess(index)}
                        type='submit'
                        variant='contained'
                      >
                        Открыть
                      </Button>
                      <Button
                        //onClick={handleClosePublicModal}
                        //@ts-ignore
                        //onClick={responseForRenameFile(index)}
                        type='submit'
                        variant='contained'
                      >
                        Отмена
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
export { PublicFileList }
//handleMenuCloseForRename(index)
