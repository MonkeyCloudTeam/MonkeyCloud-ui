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
                  className={styles.tableRow}
                  key={file.name}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    verticalAlign: 'baseline',
                  }}
                >
                  <Container className={styles.TableRowInnerContainer}>
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
                      <TableCell
                        className={styles.tableCellElement}
                        align='left'
                      >
                        {file.size}
                      </TableCell>
                    ) : (
                      <TableCell
                        className={styles.tableCellElement}
                        align='left'
                      ></TableCell>
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
