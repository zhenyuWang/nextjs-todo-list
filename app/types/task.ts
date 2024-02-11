export type Task = {
  _id: string
  userId: string
  title: string
  description: string
  createdAt: string
  deadline?: string
  isImportant?: boolean
  status: number
}
