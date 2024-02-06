'use client'

import { useState } from 'react'
import type { Task } from '@/app/tasks/page'
import AddTaskButton from './AddTaskButton'
import TaskItem from './TaskItem'
import AddTaskCard from './AddTaskCard'
import CreateTaskModal from '@/app/components/Modals/CreateTaskModal'

export default function Tasks({
  title,
  tasks,
}: {
  title: string
  tasks: Task[]
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className='h-full py-5 relative'>
      <div className='p-5 absolute top-0 left-0 right-0 flex items-center justify-between bg-slate-700'>
        <h2 className='pb-2 text-2xl border-b-3 border-sky-400'>{title}</h2>
        <AddTaskButton setShowModal={setShowModal} />
      </div>
      <div className='h-full pt-20 px-5 pb-5 flex flex-wrap content-start gap-5 overflow-y-auto'>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
        <AddTaskCard setShowModal={setShowModal} />
      </div>
      <CreateTaskModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  )
}
