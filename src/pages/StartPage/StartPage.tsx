import { Link } from 'react-router-dom'
import './StartPage'

const StartPage = () => {
  const path = localStorage.getItem('username')
  return (
    <div className='SignUp_section'>
      <h2>Hello</h2>
      <Link className='SignUpButton' to='/sign-in/'>
        <span>Войти</span>
      </Link>
      <Link className='SignUpButton' to='/sign-up'>
        <span>Зарегистрироваться</span>
      </Link>
    </div>
  )
}

export { StartPage }
