import { useState } from 'react'

export const useMenus = () => {
  const [menus, setMenus] = useState([])
  return {
    menus,
    setMenus,
  }
}
