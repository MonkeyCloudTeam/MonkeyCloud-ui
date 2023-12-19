import { Link } from 'react-router-dom'
import styles from './SideBar.module.scss'
import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { useLazyGetFilesQuery } from '../../store/filesSlice'
import { setCurrentPath, setSearchMode } from '../../store/commonReducer'
import { useDispatch } from 'react-redux'
import ScreenShareIcon from '@mui/icons-material/ScreenShare'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import StarIcon from '@mui/icons-material/Star'
const drawerWidth = 320
const SideBar = () => {
  const [triggerGetFiles, result, lastPromiseInfo] = useLazyGetFilesQuery()
  const dispatch = useDispatch()
  const username = localStorage.getItem('username')
  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {[
            {
              name: 'Мои файлы',
              url: '/main',
              icon: (
                <Inventory2Icon sx={{ marginLeft: '70px', color: '#030129' }} />
              ),
              onClick: () => {
                dispatch(setSearchMode(false))
                dispatch(setCurrentPath(''))
                //@ts-ignore
                triggerGetFiles({ username, path: '' })
              },
            },
            {
              name: 'Общий доступ',
              url: '/public',
              icon: (
                <ScreenShareIcon
                  sx={{ marginLeft: '70px', color: '#030129' }}
                />
              ),
              onClick: () => {},
            },
            {
              name: 'Избранное',
              url: '/favorites',
              icon: <StarIcon sx={{ marginLeft: '70px', color: '#030129' }} />,
              onClick: () => {},
            },
          ].map(({ name, url, onClick, icon }, index) => (
            <ListItem key={name} disablePadding>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemButton>
                <Link className={styles.link} onClick={onClick} to={url}>
                  <ListItemText primary={name} />
                </Link>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{ marginTop: '500px', marginLeft: '50px' }}>
          <ListItem sx={{ marginLeft: 'center' }}>Занято:</ListItem>
          <ListItem>{localStorage.getItem('memory')} MB / 1 GB </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

export { SideBar }
// <aside className={styles.SideBar}>
//   <Link to='/main' className={styles.SideBar__link}>
//     Мои файлы
//   </Link>
//   <Link to='/main' className={styles.SideBar__link}>
//     Общий доступ
//   </Link>
//   <Link to='/favorites' className={styles.SideBar__link}>
//     Избранное
//   </Link>
// </aside>
