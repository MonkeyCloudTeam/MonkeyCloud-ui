export interface IFile {
  breadCrums: string
  date: string
  isDir: boolean
  isFavorite: boolean
  name: string
  path: string
  size: string
  username: string
  folderId: string
}

export type Files = {
  list: Array<IFile>
}

export type PublicFiles = {
  list: Array<IFile>
  breadCrumbs: IBreadCrumbs
}

export interface IBreadCrumbs {
  breadCrumbs: string
}

export type RenameFileRequestArgs = {
  username: string
  fullPath: string
  oldName: string
  newName: string
}
