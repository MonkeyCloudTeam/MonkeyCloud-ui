import { Link } from 'react-router-dom'
import './StartPage'
import { inspect } from 'util'
import styles from './StartPage.module.scss'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, TextField } from '@mui/material'
import Modal from '@mui/material/Modal'
import React from 'react'

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

let pathToPage = ''
if (localStorage.getItem('role') === 'user') {
  pathToPage = '/sign-in'
} else if (localStorage.getItem('role') === 'admin') {
  pathToPage = 'admin'
} else {
  pathToPage = '/sign-in'
}

const StartPage = () => {
  const [openModal, setOpen] = React.useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false)
  const path = localStorage.getItem('username')
  return (
    <div className='SignUp_section'>
      <h2>Hello</h2>
      <div>
        <Link className={styles.link} to={`${pathToPage}`}>
          <span>Войти</span>
        </Link>
      </div>
      <div>
        <Link className={styles.link} to='/sign-up'>
          <span>Зарегистрироваться</span>
        </Link>
      </div>
      <div onClick={handleOpen} className={styles.link}>
        Продолжить без регистрации
      </div>
      <Modal
        open={openModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Вам будет доступен только просмотр общих файлов. Вы действительно
            хотите продолжить?
          </Typography>
          <Button onClick={handleClose} variant='text'>
            Отмена
          </Button>
          <Link to='/trial'>
            <Button type='submit' variant='contained'>
              Продолжить
            </Button>
          </Link>
        </Box>
      </Modal>
    </div>
  )
}

export { StartPage }
