import { useLazyGetFilesQuery } from '../../store/filesSlice'

const CurrentPath = ({
  currentPath,
  triggerGetFiles,
  setCurrentPath,
}: {
  currentPath: string
  triggerGetFiles: any
  setCurrentPath: any
}) => {
  const splittedPath = currentPath.split('/')
  const handleClick = (path: string) => () => {
    const pathStr =
      splittedPath
        .slice(1, splittedPath.length - 1)
        .map((element) => `/${element}`)
        .join('')
        .slice(1) + '/'
    console.log('path', pathStr)
    triggerGetFiles(pathStr)
    //setCurrentPath(pathStr)
  }
  return (
    <div>
      {splittedPath.map((path) => {
        return <button onClick={handleClick(path)}>{path} / </button>
      })}
    </div>
  )
  //return <div>{currentPath}</div>
}

export { CurrentPath }
