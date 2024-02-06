import { Dispatch, SetStateAction } from 'react'
import { PiPlusCircle } from 'react-icons/pi'

export default function AddTaskButton({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <PiPlusCircle
      onClick={() => setShowModal(true)}
      size={30}
      className='animate-scale-up-down'
    />
  )
}
