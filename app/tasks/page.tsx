import Tasks from '@/app/components/Tasks/Tasks'
import { fetchTasks } from '@/app/lib/actions'

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

export default async function TasksPage() {
  const { total, tasks } = await fetchTasks()
  const _tasks = tasks.map((task) => {
    const _item = task._doc
    _item._id = _item._id.toString()
    _item.userId = _item.userId.toString()
    _item.createdAt = _item.createdAt.toString().slice(4, 24)
    return _item
  })

  return <Tasks title='All Tasks' total={total} tasks={_tasks} />
}
