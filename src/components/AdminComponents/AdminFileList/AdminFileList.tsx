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
import { axiosInstance, axiosInstanceForDownload } from '../../../api'
import styles from './AdminFileList.module.scss'
import { useMenus } from '../../../hooks/useMenus'
import {
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useLazyPublicFilesQuery,
  useRenameFileMutation,
  useRenameFolderMutation,
} from '../../../store/filesSlice'
import { IFile } from '../../../store/types'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { Link, useParams } from 'react-router-dom'
import { GoStar, GoStarFill } from 'react-icons/go'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { setCurrentPath } from '../../../store/commonReducer'
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded'
import {
  BsFiletypeDocx,
  BsFiletypeExe,
  BsFiletypePptx,
  BsFiletypeXlsx,
} from 'react-icons/bs'
import ImageIcon from '@mui/icons-material/Image'
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import { FaFilePdf } from 'react-icons/fa'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

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

const AdminFileList = ({
  triggerAdminFiles,
  triggerGetFiles,

  data,
}: {
  // setCurrentPath: (currentPath: string) => void
  triggerGetFiles: any
  data: any
  triggerAdminFiles: any
}) => {
  // const bc = data?.list[0]?.breadCrums as string
  //localStorage.setItem('breadCrums', bc)
  const params = useParams()
  console.log('PARAMS', params)
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  //const { data, error, isLoading } = useGetFilesQuery(path || '')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [menus, setMenus] = useState([])
  const open = Boolean(anchorEl)
  const [triggerRenameMutation, resultMutationRename] = useRenameFileMutation()
  const [openModal, setOpen] = React.useState(false)
  const [openShareModal, setOpenShareModal] = React.useState(false)
  const [openPublicAccessModal, setOpenPublicAccessModal] =
    React.useState(false)
  const dispatch = useDispatch()

  const searchString = useSelector(
    (state: RootState) => state.appState.searchString,
  )

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
    // triggerGetFiles('')
    const bc = data?.list[0]?.breadCrums as string
    localStorage.setItem('breadCrums', bc)
    //setCurrentPath(result?.data?.list[0]?.breadCrums as string)
  }, [])
  const [triggerRenameFolderMutation, resultMutationRenameFolder] =
    useRenameFolderMutation()
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
    console.log(file)
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
    if (data.list[index].username === data?.list[index].breadCrums) {
      pathToTriger = ''
    } else {
      pathToTriger = Path?.substring(Path?.indexOf('/') + 1) + '/'
    }
    if (data?.list[index].isDir === true) {
      try {
        const response = await axiosInstance.delete('/deleteFolder', {
          params: {
            username: data.list[index].username,
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
            username: data.list[index].username,
            fullPath: data?.list[index].path,
          },
        })
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
    if (params.bucket && params.filename) {
      triggerGetFiles({
        username: params.bucket,
        path: `${params.filename}/${params['*']}`,
      })
    } else {
      //@ts-ignore
      triggerGetFiles({ username: params.bucket, path: '' })
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
  }

  const responseForRenameFile = (index: number) => async () => {
    const renameFile = document.getElementById('rename') as HTMLInputElement
    const fileName = data.list[index].name
    const extension = fileName.substring(fileName.lastIndexOf('.'))
    const path = data.list[index].breadCrums
    let cutPath = ''
    if (data.list[index].breadCrums === data.list[index].username) {
      cutPath = ''
    } else {
      cutPath = path.substring(path.indexOf('/') + 1) + '/'
    }
    const Path = data?.list[index].breadCrums
    if (data.list[index].isDir === true) {
      try {
        await triggerRenameFolderMutation({
          username: data.list[index].username as string,
          fullPath: cutPath as string,
          //@ts-ignore
          oldName: data.list[index].name as string,
          //@ts-ignore
          newName: renameFile.value as string,
        })
        //@ts-ignore
        if (params.bucket && params.filename) {
          //@ts-ignore
          triggerGetFiles({
            username: params.bucket,
            path: `${params.filename}/${params['*']}`,
          })
        } else {
          //@ts-ignore
          triggerGetFiles({ username: params.bucket, path: '' })
        }
        handleClose()
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        await triggerRenameMutation({
          username: data.list[index].username as string,
          fullPath: cutPath as string,
          //@ts-ignore
          oldName: data.list[index].name as string,
          //@ts-ignore
          newName: (renameFile.value + extension) as string,
        })
        //@ts-ignore
        if (params.bucket && params.filename) {
          //@ts-ignore
          triggerGetFiles({
            username: params.bucket,
            path: `${params.filename}/${params['*']}`,
          })
        } else {
          //@ts-ignore
          triggerGetFiles({ username: params.bucket, path: '' })
        }
        handleClose()
      } catch (error) {
        console.log(error)
      }
    }
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
          username: data?.list[index].username,
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
    return <div>Пользователь ещё не загрузил файлы.</div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IFile, index: number) => (
            <TableRow>
              <TableRow
                className={styles.tableRow}
                key={`${file.name}-${index}`}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  verticalAlign: 'baseline',
                }}
              >
                {file.isDir ? (
                  <Link
                    className={styles.link}
                    to={`/admin/${params.bucket}/${file.path}`}
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
                      <TableCell
                        className={styles.tableCellElement}
                        align='left'
                      >
                        {file.username}
                      </TableCell>
                      <TableCell
                        className={styles.tableCellElement}
                        align='left'
                      >
                        {file.date}
                      </TableCell>
                      <TableCell
                        className={styles.tableCellElement}
                        align='left'
                      >
                        ‒
                      </TableCell>
                    </Container>
                  </Link>
                ) : (
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
                    <TableCell className={styles.tableCellElement} align='left'>
                      {file.size}
                    </TableCell>
                  </Container>
                )}
                <TableCell className={styles.tableCellElement} align='right'>
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
                    <MenuItem onClick={DownloadFile(index)}>Скачать</MenuItem>
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
                          sx={{ marginBottom: '10px' }}
                          id='modal-modal-title'
                          variant='h6'
                          component='h2'
                        >
                          Переименовать
                        </Typography>
                        <TextField fullWidth id='rename' />
                        <Button
                          sx={{ color: '#030129 ', marginTop: '10px' }}
                          onClick={handleClose}
                          variant='text'
                        >
                          Отмена
                        </Button>
                        <Button
                          sx={{
                            backgroundColor: '#030129 ',
                            marginTop: '10px',
                          }}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { AdminFileList }
//handleMenuCloseForRename(index)
