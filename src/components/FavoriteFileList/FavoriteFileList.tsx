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
import styles from '../FilesList/FilesList.module.scss'
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

const FavoriteFilesList = ({
  setCurrentPath,
  triggerGetFiles,
  data,
  triggerFavorite,
}: {
  setCurrentPath: (currentPath: string) => void
  triggerGetFiles: any
  triggerFavorite: any
  data: any
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
    triggerFavorite('')
    const bc = data?.list[0]?.breadCrums as string
    localStorage.setItem('breadCrums', bc)
    //setCurrentPath(result?.data?.list[0]?.breadCrums as string)
  }, [])

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

  const FavoriteFileRequest = (index: number) => async () => {
    const Path = data?.list[index].breadCrums
    let pathToTriger = ''
    if (username === data?.list[index].breadCrums) {
      pathToTriger = ''
    } else {
      pathToTriger = Path?.substring(Path?.indexOf('/') + 1) + '/'
    }
    if (data?.list[index].isDir) {
      if (data?.list[index].isFavorite) {
        try {
          const response = await axiosInstance.post(
            '/removeFolderFromFavorite',
            {
              username: username,
              fullPath: data.list[index].path,
            },
          )
          console.log(response)
        } catch (error) {
          console.error(error)
        }
      } else {
        try {
          const response = await axiosInstance.post('/addFolderToFavorite', {
            username: username,
            fullPath: data.list[index].path,
          })
          console.log(response)
        } catch (error) {
          console.error(error)
        }
      }
    } else {
      if (data?.list[index].isFavorite) {
        try {
          const response = await axiosInstance.post('/removeFromFavorite', {
            username: username,
            fullPath: data?.list[index].path,
          })
          console.log(response)
        } catch (error) {
          console.error(error)
        }
      } else {
        try {
          const response = await axiosInstance.post('/addToFavorite', {
            username: username,
            fullPath: data?.list[index].path,
          })
          console.log(response)
        } catch (error) {
          console.error(error)
        }
      }
    }
    await triggerGetFiles(pathToTriger)
  }

  const handleTableRowClick = (file: IFile) => async () => {
    let headerPath = file.path
    if (file.isDir) {
      //@ts-ignore
      await triggerGetFiles(headerPath).then((data1) => {
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
    await triggerFavorite('')
    handleMenuClose(index)
  }

  const responseForRenameFile = (index: number) => async () => {
    const renameFile = document.getElementById('rename') as HTMLInputElement
    //@ts-ignore
    const fileName = data.list[index].name
    const extension = fileName.substring(fileName.lastIndexOf('.'))
    //@ts-ignore
    const path = data.list[index].breadCrums
    let cutPath = ''
    //@ts-ignore
    if (data.list[index].breadCrums === localStorage.getItem('username')) {
      cutPath = ''
    } else {
      cutPath = path.substring(path.indexOf('/') + 1) + '/'
    }
    const Path = data?.list[index].breadCrums
    let pathToTriger = ''
    if (username === data?.list[index].breadCrums) {
      pathToTriger = ''
    } else {
      pathToTriger = Path?.substring(Path?.indexOf('/') + 1) + '/'
    }
    //@ts-ignore
    if (data.list[index].isDir === true) {
      try {
        const response = await axiosInstance.put('/renameFolder', {
          username: username,
          fullPath: cutPath,
          //@ts-ignore
          oldName: data.list[index].name,
          //TODO Нельзя давать пользователю ставить расширешние (.) в название папки P.S Запретить пользователю использовать точку.
          newName: renameFile.value,
        })
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const response = await axiosInstance.put('/renameFile', {
          username: username,
          fullPath: cutPath,
          //@ts-ignore
          oldName: data.list[index].name,
          //TODO Нельзя давать пользователю менять расширение файла
          //@ts-ignore
          newName: renameFile.value + extension,
        })
        //@ts-ignore
        data.list[index].name = renameFile.value + extension
      } catch (error) {
        console.error(error)
      }
    }
    await triggerFavorite('')
    handleClose()
  }

  // const downloadFile = () => {
  //   window.open(
  //     'http://localhost:8080/downloadFile?username=user1&fullPath=32.psd',
  //     '_blank',
  //     'noopener,noreferrer',
  //   )
  // }
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
          {data?.list.map((file: IFile, index: number) => {
            console.log(file)
            if (!file.isFavorite) {
              return <></>
            }
            return (
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
                  {/*<TableCell align='left'>{file.data}</TableCell>*/}
                  {file.isDir !== true ? (
                    <TableCell align='left'>{file.size}</TableCell>
                  ) : (
                    <TableCell align='left'>‒</TableCell>
                  )}
                </Container>
                {file.isFavorite ? (
                  <Container>
                    <Checkbox
                      onClick={FavoriteFileRequest(index)}
                      className={styles.TableRowInnerFavorite}
                      id='favorite'
                      {...label}
                      icon={<StarIcon />}
                      checkedIcon={<StarIcon />}
                    />
                  </Container>
                ) : (
                  <Container>
                    <Checkbox
                      onClick={FavoriteFileRequest(index)}
                      className={styles.TableRowInnerFavorite}
                      id='favorite'
                      {...label}
                      icon={<StarBorderIcon />}
                      checkedIcon={<StarBorderIcon />}
                    />
                  </Container>
                )}
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
                      <MenuItem onClick={handleMenuClose(index)}>
                        Поделиться
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={DownloadFile(index)}>Скачать</MenuItem>
                    )}
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
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { FavoriteFilesList }
