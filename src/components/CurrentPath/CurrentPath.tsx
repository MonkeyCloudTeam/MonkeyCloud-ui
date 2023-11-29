const CurrentPath = ({ currentPath }: { currentPath: string }) => {
  console.log(currentPath.split('/'))
  return <div>{currentPath}</div>
}

export { CurrentPath }
