import React, { useEffect, useState } from 'react'
import {
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { axiosInstance, axiosInstanceForDownload } from '../../api'
import styles from './PrivateFileLiist.module.scss'
import { IFile } from '../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPath } from '../../store/commonReducer'
import { Link, useParams } from 'react-router-dom'
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined'
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
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'

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
  const params = useParams()
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
    //trigerPublicFiles(headerPath)
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
    return <div></div>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='customized table'>
        <TableBody>
          {data?.list.map((file: IFile, index: number) => (
            <TableRow>
              <TableRow
                className={styles.tableRow}
                key={file.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  verticalAlign: 'baseline',
                }}
              >
                {file.isDir ? (
                  <Link
                    className={styles.link}
                    to={`/private/${params.owner}/${params.folderId}/${file.folderId}`}
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
                      ></TableCell>
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
                  {file.isDir ? (
                    <></>
                  ) : (
                    <IconButton id='basic-button' onClick={DownloadFile(index)}>
                      <CloudDownloadIcon
                        sx={{ color: ' #030129 ', marginRight: '20px' }}
                      />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export { PrivateFileList }
//handleMenuCloseForRename(index)
