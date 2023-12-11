import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import { SiSurveymonkey } from 'react-icons/si'
import { BiSolidLockAlt } from 'react-icons/bi'
import { AiOutlineUser } from 'react-icons/ai'
import { LiaTelegramPlane } from 'react-icons/lia'
import React, { useRef, useState } from 'react'
import { axiosInstance } from '../../api'
import { ErrorMessage } from '@hookform/error-message'
import './SignUpPage.scss'

Modal.setAppElement('#root')

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
  name: string
  middleName: string
  lastName: string
  login: string
  password: string
  passwordSubmit: string
}

const SignUpPage = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>()
  const password = useRef({})
  password.current = watch('password', '')
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = useState(false)
  const userToken = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const validatePassSubmit = () => {
    return (
      getValues('password') === getValues('passwordSubmit') ||
      'Пароли не совпадают'
    )
  }
  // if (userToken && role === 'user') {
  //   return <Navigate to='/main' />
  // } else {
  //   return <Navigate to='/admin' />
  // }

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const onSubmit: SubmitHandler<Inputs> = async ({
    name,
    middleName,
    lastName,
    login,
    password,
  }) => {
    const requestBody = {
      username: login,
      second_name: middleName,
      password: password,
      name: name,
      last_name: lastName,
      telegramId: '',
    }
    try {
      const response = await axiosInstance.post('/sign-up', requestBody)
      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('username', response.data.username)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      console.log(response)
      navigate('/main')
    } catch (error) {
      console.error(error)
      //@ts-ignore
      if (error.response.status === 400) {
        openModal()
      }
    }
    console.log(requestBody)
  }

  return (
    <div className='signUp'>
      <div className='signUp_section'>
        <div className='boxForm'>
          <form onSubmit={handleSubmit(onSubmit)} id='registration-form'>
            <h2>Регистрация</h2>
            <div className='inputBox'>
              <span className='icon'>
                <AiOutlineUser />
              </span>
              <input {...register('name')} type='text' required id='name' />
              <label>Имя</label>
            </div>
            <div className='inputBox'>
              <span className='icon'>
                <AiOutlineUser />
              </span>
              <input
                {...register('middleName')}
                type='text'
                required
                id='middleName'
              />
              <label>Отчество</label>
            </div>
            <div className='inputBox'>
              <span className='icon'>
                <AiOutlineUser />
              </span>
              <input
                {...register('lastName')}
                type='text'
                required
                id='lastName'
              />
              <label>Фамилия</label>
            </div>
            <div className='inputBox'>
              <span className='icon'>
                <SiSurveymonkey />
              </span>
              <input {...register('login')} type='text' required id='login' />
              <label>Логин</label>
            </div>
            <div className='inputBox'>
              <span className='icon'>
                <BiSolidLockAlt />
              </span>
              <input
                {...register('password', { maxLength: 20 })}
                type='password'
                required
                id='password'
              />
              <label>Пароль</label>
            </div>
            <div className='inputBox'>
              <span className='icon'>
                <BiSolidLockAlt />
              </span>
              <input
                type='password'
                required
                id='passwordSumbit'
                {...register('passwordSubmit', {
                  required: true,
                  validate: validatePassSubmit,
                })}
              />
              <label>Подтвердите пароль</label>
            </div>
            <div className='inputBox'>
              <span className='icon'>
                <LiaTelegramPlane />
              </span>
              <input className='telegramInput' type='text' id='telegrammId' />
              <label className='labelTelegram'>Telegram id</label>
            </div>
            <ErrorMessage
              errors={errors}
              name='passwordSubmit'
              render={({ message }) => (
                <div className='Errors'>{'⚠ Пароли не совпадают'}</div>
              )}
            />
            <button type='submit' className='signUpButton'>
              Вход
            </button>
            <div className='alreadyHave'>
              <p>
                У вас уже есть аккаунт?
                <a> </a>
                <a>
                  <Link to='/sign-in'>Войти</Link>
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
          <div className='textModal'>
            Пользователь с таким логином уже существует.
          </div>
          <button onClick={closeModal} className='signUpButton'>
            Закрыть
          </button>
        </Modal>
      </div>
    </div>
  )
}

export { SignUpPage }
