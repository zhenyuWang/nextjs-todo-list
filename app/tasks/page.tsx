import Tasks from '@/app/components/Tasks/Tasks'
import { fetchTasks } from '@/app/lib/actions'

export const dynamic = 'force-dynamic'

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

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Record<string, any>
}) {
  const { tasks } = await fetchTasks(searchParams)
  const _tasks = tasks
    ? tasks.map((task) => {
        const _item = task._doc
        _item._id = _item._id.toString()
        _item.userId = _item.userId.toString()
        _item.createdAt = _item.createdAt.toString().slice(4, 24)
        return _item
      })
    : []

  return <Tasks title='All Tasks' tasks={_tasks} />
}
