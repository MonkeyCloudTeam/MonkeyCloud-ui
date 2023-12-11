import { useLazyGetFilesQuery } from '../../store/filesSlice'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { useDispatch } from 'react-redux'
const PublicPath = ({
  currentPath,
  setCurrentPath,
}: {
  currentPath: string
  setCurrentPath: any
}) => {
  const dispatch = useDispatch()
  const splittedPath = currentPath.split('/')
  const handleClick = (currentPath: string) => () => {
    let index: number = 0
    for (let i = 0; i < splittedPath.length - 1; i++) {
      if (splittedPath[i] === currentPath) {
        index = i
        break
      }
    }
    if (currentPath === splittedPath[0]) {
      // triggerGetFiles('')
      dispatch(setCurrentPath(splittedPath[0]))
    } else if (currentPath == splittedPath.at(-1)) {
      const pathStr =
        splittedPath
          .slice(1)
          .map((element) => `/${element}`)
          .join('')
          .slice(1) + '/'
      // triggerGetFiles(pathStr)
      //setCurrentPath()
    } else {
      const pathStr =
        splittedPath
          .slice(1, index + 1)
          .map((element) => `/${element}`)
          .join('')
          .slice(1) + '/'
      // triggerGetFiles(pathStr)
      setCurrentPath(splittedPath[0] + '/' + pathStr.slice(0, -1))
    }
    //`
  }
  return (
    <div>
      {splittedPath.map((currentPath) => {
        return <a onClick={handleClick(currentPath)}>{currentPath} / </a>
      })}
    </div>
  )
  //return <div>{currentPath}</div>
}

export { PublicPath }
