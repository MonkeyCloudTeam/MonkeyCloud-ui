export interface IFile {
  breadCrums: string
  date: string
  isDir: boolean
  isFavorite: boolean
  name: string
  path: string
  size: string
  username: string
}

export type Files = {
  list: Array<IFile>
}
