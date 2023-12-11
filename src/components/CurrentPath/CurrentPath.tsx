import { useLazyGetFilesQuery } from '../../store/filesSlice'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { setCurrentPath } from '../../store/commonReducer'
import { useDispatch } from 'react-redux'
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
  console.log('SPLRTTKD', splittedPath)
  const handleClick = (PathTransform: string) => () => {
    let index: number = 0
    for (let i = 0; i < splittedPath.length - 1; i++) {
      if (splittedPath[i] === PathTransform) {
        index = i
        break
      }
    }
    if (PathTransform === splittedPath[0]) {
      dispatch(setCurrentPath(''))
    } else if (PathTransform == splittedPath.at(-1)) {
      const pathStr =
        splittedPath
          .slice(1)
          .map((element) => `/${element}`)
          .join('')
          .slice(1) + '/'
      //setCurrentPath()
    } else {
      const pathStr =
        splittedPath
          .slice(1, index + 1)
          .map((element) => `/${element}`)
          .join('')
          .slice(1) + '/'
      dispatch(setCurrentPath(pathStr))
    }
    //`
  }
  return (
    <div>
      {splittedPath.map((currentPath) => {
        return <a onClick={handleClick(currentPath)}>{currentPath}/ </a>
      })}
    </div>
  )
  //return <div>{currentPath}</div>
}

export { CurrentPath }
