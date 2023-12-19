import { Link } from 'react-router-dom'
import './StartPage'
import { inspect } from 'util'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, TextField } from '@mui/material'
import Modal from '@mui/material/Modal'
import React from 'react'
import styles from './StartPage.module.scss'
import Container from '@mui/material/Container'
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
    <div className={styles.start}>
      <div className='SignUp_section'>
        <Link className={styles.link} to={`${pathToPage}`}>
          <Button className={styles.link1}>
            <span>Войти</span>
          </Button>
        </Link>
        <Link className={styles.link} to='/sign-up'>
          <Button className={styles.link}>
            <span>Зарегистрироваться</span>
          </Button>
        </Link>
        <Button onClick={handleOpen} className={styles.link}>
          Продолжить без регистрации
        </Button>
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
              Вам будет доступен только просмотр общих файлов. Вы действительно
              хотите продолжить?
            </Typography>
            <Button
              sx={{ color: '#030129 ', marginTop: '10px' }}
              onClick={handleClose}
              variant='text'
            >
              Отмена
            </Button>
            <Link to='/trial'>
              <Button
                sx={{ backgroundColor: '#030129 ', marginTop: '10px' }}
                type='submit'
                variant='contained'
              >
                Продолжить
              </Button>
            </Link>
          </Box>
        </Modal>
      </div>
      <Box className={styles.title}>Monkey Cloud</Box>
      <div className={styles.stars}>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
      </div>
    </div>
  )
}

export { StartPage }
