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
import styles from './TrialFileList.module.scss'
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

const TrialFileList = ({
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

  if (!data?.list.length) {
    return <div>Нет файлов в общем доступе.</div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IFile, index: number) => (
            <TableRow>
              <Link className={styles.link} to={`/trial/${file.folderId}`}>
                <TableRow
                  key={file.name}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    verticalAlign: 'baseline',
                  }}
                >
                  <Container className={styles.TableRowInnerContainer}>
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
                </TableRow>
              </Link>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { TrialFileList }
