import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { SiSurveymonkey } from 'react-icons/si'
import { BiSolidLockAlt } from 'react-icons/bi'
import Modal from 'react-modal'
import React, { useState } from 'react'
import { axiosInstance } from '../../api'

import './SignInPage.scss'

Modal.setAppElement('#root')

let text = ''

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

type Inputs = {
  login: string
  password: string
}

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = useState(false)

  const userToken = localStorage.getItem('token')
  const path = localStorage.getItem('username')

  if (userToken) {
    return <Navigate to='/main' />
  }

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }
  const onSubmit: SubmitHandler<Inputs> = async ({ login, password }) => {
    const requestBody = {
      username: login,
      password: password,
    }
    if (localStorage.getItem('token')) {
      return navigate('/main')
    }
    try {
      const response = await axiosInstance.post('/sign-in', requestBody)
      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('username', response.data.username)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('memory', response.data.size)
      localStorage.setItem('role', response.data.role)
      console.log(response)
      if (response.data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/main')
      }
    } catch (error) {
      console.error(error)
      //@ts-ignore
      if (error?.response.status === 401) {
        text = ' Неверное имя пользователя или пароль.'
        openModal()
      }
    }
    console.log(requestBody)
  }
  return (
    <section className='main'>
      <div className='signIn_section'>
        <div className='formBox'>
          <form onSubmit={handleSubmit(onSubmit)} id='signIn-form'>
            <h2 className='h2'>Вход</h2>
            <div className='inputBox'>
              <span className='icon'>
                <SiSurveymonkey />
              </span>
              <input
                {...register('login')}
                type='text'
                required
                id='login'
                pattern='^[a-zA-Z0-9_.-]*$'
              />
              <label>Логин</label>
            </div>
            <div className='inputBox'>
              <span className='icon'>
                <BiSolidLockAlt />
              </span>
              <input
                {...register('password')}
                type='password'
                required
                id='password'
              />
              <label>Пароль</label>
            </div>
            <button type='submit' className='signInButton'>
              Вход
            </button>
            <div className='createAccount'>
              <p className='h2'>
                Нет аккаунта?
                <a> </a>
                <a>
                  <Link to='/sign-up'>Зарегестрироваться</Link>
                </a>
              </p>
            </div>
          </form>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Example Modal'
        >
          <div className='textModal'>{text}</div>
          <button onClick={closeModal} className='signInButton'>
            Закрыть
          </button>
        </Modal>
      </div>
    </section>
  )
}
export { SignInPage }
