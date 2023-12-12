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
import FolderIcon from '@mui/icons-material/Folder'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { axiosInstance, axiosInstanceForDownload } from '../../api'
import styles from './PublicFileList.module.scss'
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined'
import { setCurrentPath } from '../../store/commonReducer'
import { IFile } from '../../store/types'

import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

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
  currentPath,
  trigerPublicFiles,
  data,
  triggerPublicFolders,
}: {
  data: any
  triggerPublicFolders?: any
  trigerPublicFiles?: any
  currentPath: any
}) => {
  // const bc = data?.list[0]?.breadCrums as string
  // localStorage.setItem('breadCrums', bc)
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
  const dispatch = useDispatch()
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
    dispatch(setCurrentPath('...'))
    //const bc = data.breadCrumbs
    //localStorage.setItem('breadCrums', bc)
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
    // if (file.isDir) {
    //
    // }
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
    // }
    //@ts-ignore
    // const GetFilesFromFolder = (index: number) => async () => {
    //   if (files[index].)
    // }
  }

  const handleMenuClose = (index: number) => () => {
    const nextMenus = menus
    // @ts-ignore
    nextMenus[index] = false
    setMenus(nextMenus)
    setAnchorEl(null)
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

  // if (!data?.list.length) {
  //   return <div>Папка пуста. Загрузите файлы.</div>
  // }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IFile, index: number) => (
            <TableRow>
              <Link className={styles.link} to={`/public/${file.folderId}`}>
                <TableRow
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
                      <TableCell align='left'></TableCell>
                    )}
                  </Container>
                  <TableCell align='right'>
                    {file.isDir ? (
                      <></>
                    ) : (
                      <IconButton
                        id='basic-button'
                        onClick={DownloadFile(index)}
                      >
                        <DownloadForOfflineOutlinedIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              </Link>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { PublicFileList }
//handleMenuCloseForRename(index)
