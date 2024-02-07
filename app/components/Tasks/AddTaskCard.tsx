import { Dispatch, SetStateAction } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

export default function AddTaskButton({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <div
      className='h-[240px] w-full lg:w-[275px] p-3 flex items-center justify-center bg-slate-600 border border-slate-800 rounded-md cursor-pointer'
      onClick={() => setShowModal(true)}
    >
      <AiOutlinePlus size={22} />
      <span className='ml-1'>Add New Task</span>
    </div>
  )
}
