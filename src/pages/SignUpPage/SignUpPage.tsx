import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUpPage.module.css';
import Modal from 'react-modal';
import {SiSurveymonkey} from "react-icons/si";
import {BiSolidLockAlt} from "react-icons/bi";
import {AiOutlineUser} from "react-icons/ai";
import {LiaTelegramPlane} from "react-icons/lia"
import {useState} from "react";
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,
  headers:{
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
});

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

type Inputs = {
  name: string
  middleName: string
  lastName: string
  login: string
  password: string
}

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
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
    }
    try {
      const response = await axiosInstance.post('/sign-up', requestBody)
      localStorage.setItem('token',response.data.token);
      localStorage.setItem('token',response.data.username);
      console.log(response)
      navigate('/main');
    } catch (error) {
      console.error(error)
      //@ts-ignore
      if (error?.status === 401)
      {
        openModal()
      }
    }
    console.log(requestBody)
  }

  return (
    <div className={styles.signUp_section}>
      <div className={styles.boxForm}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id='registration-form'
        >
          <h2>Регистрация</h2>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <AiOutlineUser />
            </span>
            <input
                {...register('name')}
                type='text' required
                id='name'
            />
            <label>Имя</label>
          </div>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <AiOutlineUser />
            </span>
            <input
                {...register('middleName')}
                type='text' required
                id='middleName'
            />
            <label>Отчество</label>
          </div>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <AiOutlineUser/>
            </span>
            <input
                {...register('lastName')}
                type='text' required
                id='lastName'
            />
            <label>Фамилия</label>
          </div>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <SiSurveymonkey />
            </span>
            <input
                {...register('login')}
                type='text' required
                id='login'
            />
            <label>Логин</label>
          </div>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <BiSolidLockAlt />
            </span>
            <input
                {...register('password')}
                type='password' required
                id='password'
            />
            <label>Пароль</label>
          </div>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <BiSolidLockAlt />
            </span>
            <input
                type='password' required
                id='passwordSumbit'
            />
            <label>Подтвердите пароль</label>
          </div>
          <div className={styles.inputBox}>
            <span className={styles.icon}>
              <LiaTelegramPlane />
            </span>
            <input
                className={styles.telegramInput}
                type='text'
                id='telegrammId'
            />
            <label
                className={styles.labelTelegram}
            >Telegram id
            </label>
          </div>
          <button  type='submit' className={styles.signUpButton}
          >
            Вход
          </button>
          <div className={styles.alreadyHave}>
            <p>
              У вас уже есть аккаунт?
              <a> </a>
              <a>
                <Link to='/sign-in'>
                  Войти
                </Link>
              </a>
            </p>
          </div>
        </form>
      </div>
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
      >
        <div
            className={styles.textModal}>
          Пользователь с таким логином уже существует.</div>
        <button onClick={closeModal}
                className={styles.signUpButton}
        >Закрыть</button>

      </Modal>
    </div>
  )
}

export {
  SignUpPage,
}