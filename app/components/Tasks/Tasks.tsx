'use client'

import { useState } from 'react'
import type { Task } from '@/app/tasks/page'
import GitHubLink from '@/app/components/GitHubLink'
import ThemeSwitch from '@/app/components/ThemeSwitch'
import AddTaskButton from './AddTaskButton'
import Search from '../Search'
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
      <div className='p-5 absolute top-0 left-0 right-0 flex items-center justify-between'>
        <div className='flex items-center'>
          <h2 className='mr-4 pb-2 text-2xl border-b-3 border-sky-400'>
            {title}
            <span className='text-xl text-sky-500'> ({tasks.length})</span>
          </h2>
          <Search />
        </div>
        <div className='flex items-center'>
          <GitHubLink />
          <ThemeSwitch />
          <AddTaskButton setShowModal={setShowModal} />
        </div>
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
