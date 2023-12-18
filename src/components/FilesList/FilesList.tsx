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
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons'
import { BY_NAME_SEARCH_MODE, BY_DATE_SEARCH_MODE } from '../../constants'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { axiosInstance, axiosInstanceForDownload } from '../../api'
import styles from './FilesList.module.scss'
import ImageIcon from '@mui/icons-material/Image'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded'
import { useMenus } from '../../hooks/useMenus'
import { FcFile } from 'react-icons/fc'
import { BsFiletypeDocx } from 'react-icons/bs'
import { FaFilePdf } from 'react-icons/fa'
import { BsFiletypeXlsx } from 'react-icons/bs'
import { Icon } from '@fluentui/react'
import {
  getFileTypeIconProps,
  FileIconType,
} from '@fluentui/react-file-type-icons'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import {
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useLazySearchFilesByDateQuery,
  useLazySearchFilesByNameQuery,
  useRenameFileMutation,
  useRenameFolderMutation,
} from '../../store/filesSlice'
import { IFile } from '../../store/types'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { Link, useParams } from 'react-router-dom'
import { GoStar, GoStarFill } from 'react-icons/go'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { useDispatch, useSelector } from 'react-redux'
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded'
import { RootState } from '../../store/store'
import { setCurrentPath } from '../../store/commonReducer'
import { BsFiletypeExe } from 'react-icons/bs'
import { BsFiletypePptx } from 'react-icons/bs'

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
  triggerGetFiles,
  triggerSearch,
  triggerSearchByDate,
  data,
}: {
  // setCurrentPath: (currentPath: string) => void
  triggerGetFiles: any
  triggerSearchByDate: any
  triggerSearch: any
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
  const [triggerRenameMutation, resultMutationRename] = useRenameFileMutation()
  const [triggerRenameFolderMutation, resultMutationRenameFolder] =
    useRenameFolderMutation()
  const [openModal, setOpen] = React.useState(false)
  const [openShareModal, setOpenShareModal] = React.useState(false)
  const [openPublicAccessModal, setOpenPublicAccessModal] =
    React.useState(false)
  const dispatch = useDispatch()
  const [resultSearch] = useLazySearchFilesByNameQuery()
  const [resultSearchByDate] = useLazySearchFilesByDateQuery()
  const searchString = useSelector(
    (state: RootState) => state.appState.searchString,
  )

  const username = localStorage.getItem('username')
  useEffect(() => {
    if (data && data?.list) {
      const nextMenus = data.list.map((m: any) => false)
      // @ts-ignore
      setMenus(nextMenus)
    }
  }, [data])

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

  const searchMode = useSelector(
    (state: RootState) => state.appState.searchMode,
  )

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
    if (searchString) {
      if (searchMode === BY_NAME_SEARCH_MODE) {
        triggerSearch(searchString)
      } else {
        triggerSearchByDate(searchString)
      }
    } else {
      //@ts-ignore
      triggerGetFiles({ username, path: pathToTriger })
    }
  }

  const handleTableRowClick = (file: IFile) => async () => {
    let headerPath = file.path
    console.log(headerPath)
    if (file.isDir) {
      dispatch(setCurrentPath(headerPath))
      //@ts-ignore
      // await triggerGetFiles(headerPath).then((data1) => {
      //   const bc = data1?.data?.list[0]?.breadCrums as string
      //   let path_full = bc.substring(bc.indexOf('/') + 1) + '/'
      //   // localStorage.setItem('breadCrums', bc)
      //   // console.log('breadCrums', bc)
      //   setCurrentPath(bc)
      // })
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
        localStorage.setItem('memory', response.data.size)
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
        localStorage.setItem('memory', response.data.size)
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
    if (searchString) {
      if (searchMode === BY_NAME_SEARCH_MODE) {
        triggerSearch(searchString)
      } else {
        triggerSearchByDate(searchString)
      }
    } else {
      //@ts-ignore
      triggerGetFiles({ username, path: pathToTriger })
    }
    handleMenuClose(index)
  }

  const responseForPublicAccess = (index: number) => async () => {
    try {
      const response = await axiosInstance.put(
        '/openFolder',
        {},
        {
          params: {
            folderId: data.list[index].folderId as String,
          },
        },
      )
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    setOpenPublicAccessModal(false)
    handleMenuClose(index)
  }

  const responseForRenameFile = (index: number) => async () => {
    const renameFile = document.getElementById('rename') as HTMLInputElement
    console.log(renameFile)
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
        await triggerRenameFolderMutation({
          username: username as string,
          fullPath: cutPath as string,
          //@ts-ignore
          oldName: data.list[index].name as string,
          //@ts-ignore
          newName: renameFile.value as string,
        })
        //@ts-ignore
        triggerGetFiles({ username, path: pathToTriger })
        handleClose()
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        await triggerRenameMutation({
          username: username as string,
          fullPath: cutPath as string,
          //@ts-ignore
          oldName: data.list[index].name as string,
          //@ts-ignore
          newName: (renameFile.value + extension) as string,
        })
        if (searchString) {
          if (searchMode === BY_NAME_SEARCH_MODE) {
            triggerSearch(searchString)
          } else {
            triggerSearchByDate(searchString)
          }
        } else {
          //@ts-ignore
          triggerGetFiles({ username, path: pathToTriger })
        }
        handleClose()
      } catch (error) {
        console.log(error)
      }
    }
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

  const getFilesIcon = (index: any) => {
    const last = data?.list[index].name
    let exection = last.substring(last.lastIndexOf('.'))
    if (
      exection === '.jpg' ||
      exection === '.png' ||
      exection === '.jpeg' ||
      exection === '.gif'
    ) {
      exection = 'picture'
    }
    if (exection === '.pdf') {
      exection = 'pdf'
    }
    if (exection === '.docx' || exection === '.doc') {
      exection = 'document'
    }
    if (exection === '.xls' || exection === '.xlsx' || exection === '.xlsm') {
      exection = 'exel'
    }
    if (exection === '.ppt' || exection === '.pptx') {
      exection = 'presentation'
    }
    if (
      exection === '.mp4' ||
      exection === '.mov' ||
      exection === '.avi' ||
      exection === '.webm' ||
      exection === '.mkv' ||
      exection === '.wmv'
    ) {
      exection = 'video'
    }
    if (
      exection === '.mp3' ||
      exection === '.ogg' ||
      exection === '.wav' ||
      exection === '.aif' ||
      exection === '.m4a' ||
      exection === '.m4b'
    ) {
      exection = 'music'
    }
    if (
      exection === '.py' ||
      exection === '.java' ||
      exection === '.cpp' ||
      exection === '.js' ||
      exection === '.jsx'
    ) {
      exection = 'program'
    }
    switch (exection) {
      case 'music':
        return <AudioFileRoundedIcon className={styles.Music} />
      case 'presentation':
        return <BsFiletypePptx className={styles.Presentation} />
      case '.exe':
        return <BsFiletypeExe className={styles.Exe} />
      case 'exel':
        return <BsFiletypeXlsx className={styles.Exel} />
      case 'picture':
        return <ImageIcon className={styles.Image} />
      case 'document':
        return <BsFiletypeDocx className={styles.Document} />
      case 'program':
        return <TerminalRoundedIcon className={styles.Program} />
      case '.txt':
        return <DescriptionRoundedIcon className={styles.Image} />
      case 'pdf':
        return <FaFilePdf className={styles.Pdf} />
      default:
        return (
          <InsertDriveFileIcon
            className={styles.tableCell}
            sx={{ color: 'rgba(102, 158, 242, 1)' }}
          />
        )
    }
  }
  if (!data?.list.length) {
    return <div></div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IFile, index: number) => (
            <TableRow
              className={styles.tableRow}
              key={`${file.name}-${index}`}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                verticalAlign: 'baseline',
              }}
            >
              <Container
                onClick={handleTableRowClick(file)}
                className={styles.TableRowInnerContainer}
              >
                {file.isDir ? (
                  <FolderIcon
                    sx={{ color: 'rgba(255, 202, 40, 1)' }}
                    className={styles.tableCell}
                  />
                ) : (
                  getFilesIcon(index)
                )}
                <TableCell
                  className={styles.tableCellName}
                  component='th'
                  scope='row'
                >
                  {file.name}
                </TableCell>
                <TableCell className={styles.tableCellElement} align='left'>
                  {file.username}
                </TableCell>
                <TableCell className={styles.tableCellElement} align='left'>
                  {file.date}
                </TableCell>
                {file.isDir !== true ? (
                  <TableCell className={styles.tableCellElement} align='left'>
                    {file.size}
                  </TableCell>
                ) : (
                  <TableCell className={styles.tableCellElement} align='left'>
                    ‒
                  </TableCell>
                )}
              </Container>
              {file.isFavorite ? (
                <Container className={styles.favorite}>
                  {file.isDir !== true ? (
                    <Checkbox
                      onClick={FavoriteFileRequest(index)}
                      className=''
                      id='favorite'
                      {...label}
                      icon={
                        <StarIcon sx={{ color: 'rgba(200, 193, 25, 1)' }} />
                      }
                      checkedIcon={
                        <StarIcon sx={{ color: 'rgba(200, 193, 25, 1)' }} />
                      }
                    />
                  ) : (
                    <></>
                  )}
                </Container>
              ) : (
                <Container className={styles.favorite}>
                  {file.isDir !== true ? (
                    <Checkbox
                      onClick={FavoriteFileRequest(index)}
                      className=''
                      id='favorite'
                      {...label}
                      icon={<StarBorderIcon />}
                      checkedIcon={<StarBorderIcon />}
                    />
                  ) : (
                    <></>
                  )}
                </Container>
              )}
              <TableCell align='right' className={styles.tableMenuCell}>
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
                      <div>{`http://localhost:3000/private/${file.username}/${file.folderId}`}</div>
                      <Button
                        onClick={handleCloseShareModal}
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
                        onClick={responseForPublicAccess(index)}
                        type='submit'
                        variant='contained'
                      >
                        Открыть
                      </Button>
                      <Button
                        onClick={handleClosePublicModal}
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
export { FilesList }
//handleMenuCloseForRename(index)
