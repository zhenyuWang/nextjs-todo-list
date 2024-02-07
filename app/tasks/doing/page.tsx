import Tasks from '@/app/components/Tasks/Tasks'
import { fetchTasks } from '@/app/lib/actions'

export default async function DoingTaskPage() {
  const tasks = await fetchTasks({ status: 1 })
  const _tasks = tasks.map((task) => {
    const _item = task._doc
    _item._id = _item._id.toString()
    _item.userId = _item.userId.toString()
    _item.createdAt = _item.createdAt.toString().slice(4, 24)
    return _item
  })

  return <Tasks title='Doing Tasks' tasks={_tasks} />
}
