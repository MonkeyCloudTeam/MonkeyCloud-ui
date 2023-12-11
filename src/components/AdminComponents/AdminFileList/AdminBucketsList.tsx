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
} from '../../../store/filesSlice'
import { IAdminFile, IFile } from '../../../store/types'
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

const AdminBucketsList = ({
  triggerAdminFiles,
  triggerGetFiles,
  data,
}: {
  // setCurrentPath: (currentPath: string) => void
  triggerAdminFiles: any
  data: any
  triggerGetFiles: any
}) => {
  // const bc = data?.list[0]?.breadCrums as string
  //localStorage.setItem('breadCrums', bc)
  const { path } = useParams()
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

  const handleTableRowClick = (file: IAdminFile) => async () => {
    let headerPath = file.bucket
    console.log(headerPath)
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
  //@ts-ignore
  // const GetFilesFromFolder = (index: number) => async () => {
  //   if (files[index].)
  // }

  if (!data?.list.length) {
    return <div>Папка пуста. Загрузите файлы.</div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IAdminFile, index: number) => (
            <Link to={`/admin/${file.bucket}`}>
              <TableRow
                //Поставить on click и проверить is dir //set files // вызывать функцию
                key={`${file.bucket}-${index}`}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  verticalAlign: 'baseline',
                }}
              >
                <Container
                  onClick={handleTableRowClick(file)}
                  className={styles.TableRowInnerContainer}
                >
                  <FolderIcon />
                  <TableCell component='th' scope='row'>
                    {file.bucket}
                  </TableCell>
                </Container>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { AdminBucketsList }
//handleMenuCloseForRename(index)
