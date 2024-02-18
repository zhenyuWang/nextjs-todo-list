'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useTheme } from '@/app/context/theme-context'
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
import { createTask } from '@/app/lib/actions'

export default function CreateTaskModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
}) {
  const { theme } = useTheme()

  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] = useState(0)
  const [isImportant, setIsImportant] = useState(false)

  const taskStatusList = [
    { label: 'Pending', value: 0 },
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
    const res = await createTask({
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
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  isRequired
                  label='Description'
                  placeholder='Enter your description'
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  type='date'
                  label='Deadline'
                  placeholder='Enter your deadline'
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <Select
                  label='Status'
                  placeholder='Select status'
                  onChange={(e) => setStatus(Number(e.target.value))}
                >
                  {taskStatusList.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
                <Checkbox onChange={(e) => setIsImportant(e.target.checked)}>
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
