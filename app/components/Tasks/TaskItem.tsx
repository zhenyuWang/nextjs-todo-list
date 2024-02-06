import type { Task } from '@/app/tasks/page'
import { MdEditNote, MdDeleteOutline } from 'react-icons/md'

export default function TaskItem({ task }: { task: Task }) {
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Incomplete'
      case 1:
        return 'Doing'
      case 2:
        return 'Completed'
      case 3:
        return 'Deleted'
    }
  }
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-yellow-500'
      case 1:
        return 'bg-sky-500'
      case 2:
        return 'bg-green-500'
      case 3:
        return 'bg-gray-500'
    }
  }

  return (
    <div
      key={task.id}
      className='h-[235px] w-full lg:w-[275px] p-3 flex flex-col bg-slate-600 border border-slate-800 rounded-md'
    >
      <h3
        className={`text-xl ${
          task.isImportant ? 'text-red-500 font-bold' : ''
        }`}
      >
        {task.title}
      </h3>
      <p className='min-h-[85px] pt-3 flex-1 line-clamp-3'>
        {task.description}
      </p>
      <div className='pt-3 text-sm text-gray-300'>
        <div>createdAt: {task.createdAt}</div>
        {task.deadline ? (
          <div className='pt-2'>deadline: {task.deadline}</div>
        ) : null}
      </div>
      <div className='pt-3 flex justify-between'>
        <span
          className={`py-1 w-24 text-center rounded-xl text-sm ${getStatusColor(
            task.status,
          )}`}
        >
          {getStatusText(task.status)}
        </span>
        <div className='flex'>
          <MdEditNote
            size={24}
            className='mr-1 hover:scale-110 transition-all'
          />
          <MdDeleteOutline
            size={24}
            className='hover:scale-110 transition-all'
          />
        </div>
      </div>
    </div>
  )
}
