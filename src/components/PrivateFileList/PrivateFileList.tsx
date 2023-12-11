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
import styles from './PrivateFileLiist.module.scss'
import { useMenus } from '../../hooks/useMenus'
import {
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useRenameFileMutation,
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
import { RootState } from '../../store/store'
import { setCurrentPath } from '../../store/commonReducer'

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

const PrivateFileList = ({
  data,
  trigerPublicFiles,
}: {
  data: any
  trigerPublicFiles: any
}) => {
  const bc = data?.list[0]?.breadCrums as string
  localStorage.setItem('breadCrums', bc)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [menus, setMenus] = useState([])
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()

  const username = localStorage.getItem('username')
  useEffect(() => {
    if (data && data?.list) {
      const nextMenus = data.list.map((m: any) => false)
      // @ts-ignore
      setMenus(nextMenus)
    }
  }, [data])

  const handleClick =
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextMenus = menus
      // @ts-ignore
      nextMenus[index] = true
      setMenus(nextMenus)
      setAnchorEl(event.currentTarget)
    }

  const handleTableRowClick = (file: IFile) => async () => {
    let headerPath = file.folderId
    trigerPublicFiles(headerPath)
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

  if (!data?.list.length) {
    return <div></div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IFile, index: number) => (
            <TableRow
              //Поставить on click и проверить is dir //set files // вызывать функцию
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
                  onClick={DownloadFile(index)}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { PrivateFileList }
//handleMenuCloseForRename(index)
