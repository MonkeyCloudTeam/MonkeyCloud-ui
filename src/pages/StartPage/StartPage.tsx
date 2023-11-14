import styles from './StartPage.module.css'
import { Link } from 'react-router-dom'

const StartPage = () => {
  return (
    <div className={styles.SignUp_section}>
      <h2>Hello</h2>
      <Link className={styles.SignUpButton} to='/sign-in'>
          <span>Войти</span>
      </Link>
      <Link className={styles.SignUpButton} to='/sign-up'>
        <span>Зарегистрироваться</span>
      </Link>

    </div>
  )
}

export {
    StartPage,
}