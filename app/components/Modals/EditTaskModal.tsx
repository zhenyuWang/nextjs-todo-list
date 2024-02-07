'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
} from '@nextui-org/react'
import { toast } from 'react-toastify'
import { updateTask } from '@/app/lib/actions'
import { Task } from '@/app/tasks/page'
import { useTheme } from '@/app/context/theme-context'

export default function EditTaskModal({
  taskInfo,
  showModal,
  setShowModal,
  updateTaskInfo,
}: {
  taskInfo: Task
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  updateTaskInfo: (taskInfo: any) => void
}) {
  const { theme } = useTheme()

  const [title, setTitle] = useState(taskInfo.title)
  const [description, setDescription] = useState(taskInfo.description)
  const [deadline, setDeadline] = useState(taskInfo.deadline)
  const [status, setStatus] = useState(taskInfo.status)
  const [isImportant, setIsImportant] = useState(taskInfo.isImportant)

  const [submitting, setSubmitting] = useState(false)

  const taskStatusList = [
    { label: 'Incomplete', value: 0 },
    { label: 'Doing', value: 1 },
    { label: 'Completed', value: 2 },
    { label: 'Deleted', value: 3 },
  ]

  const onOpenChange = (isOpen: boolean) => {
    setShowModal(isOpen)
  }

  const submit = async () => {
    setSubmitting(true)
    if (!title || !description) {
      return toast.error(`${title ? 'Description' : 'Title'} is required!`, {
        position: 'top-center',
        autoClose: 2000,
        theme,
      })
    }
    const res = await updateTask({
      id: taskInfo._id,
      userId: taskInfo.userId,
      title,
      description,
      deadline,
      status,
      isImportant,
    })
    setSubmitting(false)
    if (res?.errMsg) {
      return toast.error(res.errMsg, {
        position: 'top-center',
        autoClose: 2000,
        theme,
      })
    }
    updateTaskInfo({ title, description, deadline, status, isImportant })
    setShowModal(false)
  }

  return (
    <>
      <Modal isOpen={showModal} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Create Task
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label='Title'
                  placeholder='Enter your title'
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  isRequired
                  label='Description'
                  placeholder='Enter your description'
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  type='date'
                  label='Deadline'
                  placeholder='Enter your deadline'
                  defaultValue={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <Select
                  label='Status'
                  placeholder='Select status'
                  defaultSelectedKeys={[status.toString()]}
                  onChange={(e) => setStatus(Number(e.target.value))}
                >
                  {taskStatusList.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
                <Checkbox
                  defaultSelected={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                >
                  Is important
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button color='primary' onPress={submit} isLoading={submitting}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
