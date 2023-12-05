import { Link } from 'react-router-dom'
import React from 'react'

import styles from './SideBar.module.scss'

const SideBar = () => {
  return (
    <aside className={styles.SideBar}>
      <Link to='/main' className={styles.SideBar__link}>
        Мои файлы
      </Link>
      <Link to='/main' className={styles.SideBar__link}>
        Общий доступ
      </Link>
      <Link to='/favorites' className={styles.SideBar__link}>
        Избранное
      </Link>
    </aside>
  )
}

export { SideBar }
