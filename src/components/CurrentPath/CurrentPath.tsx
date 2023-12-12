import { useLazyGetFilesQuery } from '../../store/filesSlice'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { setCurrentPath } from '../../store/commonReducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
const CurrentPath = ({
  currentPath,
  triggerGetFiles,
}: {
  currentPath: string
  triggerGetFiles: any
}) => {
  const dispatch = useDispatch()
  const username = localStorage.getItem('username')
  const PathTransform = username + '/' + currentPath
  const splittedPath = PathTransform.split('/')
  const pathFinal = splittedPath
  let index = pathFinal.indexOf('')
  if (index !== -1) {
    pathFinal.splice(index, 1)
  }
  const handleClick = (PathTransform: string) => () => {
    let index: number = 0
    for (let i = 0; i < pathFinal.length - 1; i++) {
      if (pathFinal[i] === PathTransform) {
        index = i
        break
      }
    }
    if (PathTransform === pathFinal[0]) {
      dispatch(setCurrentPath(''))
    } else if (PathTransform == pathFinal.at(-1)) {
      const pathStr =
        pathFinal
          .slice(1)
          .map((element) => `/${element}`)
          .join('')
          .slice(1) + '/'
      //setCurrentPath()
    } else {
      const pathStr =
        pathFinal
          .slice(1, index + 1)
          .map((element) => `/${element}`)
          .join('')
          .slice(1) + '/'
      dispatch(setCurrentPath(pathStr))
    }
  }
  return (
    <div>
      {splittedPath.map((currentPath) => {
        return <a onClick={handleClick(currentPath)}>{currentPath}/</a>
      })}
    </div>
  )
}

export { CurrentPath }
