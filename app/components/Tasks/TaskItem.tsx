import { deleteTask } from '@/app/lib/actions'
import type { Task } from '@/app/tasks/page'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { useState } from 'react'
import { MdEditNote, MdDeleteOutline } from 'react-icons/md'
import EditTaskModal from '../Modals/EditTaskModal'

export default function TaskItem({ task }: { task: Task }) {
  const [taskInfo, setTaskInfo] = useState(task)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingTask, setDeletingTask] = useState(false)

  const handleDelete = async () => {
    setDeletingTask(true)
    await deleteTask(task._id)
    setDeletingTask(false)
    setShowDeleteModal(false)
  }

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

  const updateTaskInfo = (task: any) => {
    setTaskInfo((prev) => ({ ...prev, ...task }))
  }

  return (
    <div
      key={task._id}
      className='h-[235px] w-full lg:w-[275px] p-3 flex flex-col bg-slate-600 border border-slate-800 rounded-md'
    >
      <h3
        className={`text-xl ${
          taskInfo.isImportant ? 'text-red-500 font-bold' : ''
        }`}
      >
        {taskInfo.title}
      </h3>
      <p className='min-h-[85px] pt-3 flex-1 line-clamp-3'>
        {taskInfo.description}
      </p>
      <div className='pt-3 text-sm text-gray-300'>
        <div>createdAt: {taskInfo.createdAt}</div>
        {taskInfo.deadline ? (
          <div className='pt-2'>deadline: {taskInfo.deadline}</div>
        ) : null}
      </div>
      <div className='pt-3 flex justify-between'>
        <span
          className={`py-1 w-24 text-center rounded-xl text-sm ${getStatusColor(
            taskInfo.status,
          )}`}
        >
          {getStatusText(taskInfo.status)}
        </span>
        <div className='flex'>
          <MdEditNote
            size={24}
            onClick={() => {
              setShowEditModal(true)
            }}
            className='mr-1 hover:scale-110 transition-all cursor-pointer'
          />
          <MdDeleteOutline
            size={24}
            onClick={() => {
              setShowDeleteModal(true)
            }}
            className='hover:scale-110 transition-all cursor-pointer'
          />
        </div>
      </div>
      <EditTaskModal
        taskInfo={taskInfo}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        updateTaskInfo={updateTaskInfo}
      />
      <Modal
        isOpen={showDeleteModal}
        onOpenChange={() => setShowDeleteModal(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Delete Task
              </ModalHeader>
              <ModalBody>Whether to delete the task?</ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button
                  color='primary'
                  onPress={handleDelete}
                  isLoading={deletingTask}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
