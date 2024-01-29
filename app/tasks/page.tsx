import { PiPlusCircle } from 'react-icons/pi'
import { MdEditNote, MdDeleteOutline } from 'react-icons/md'

export default function TasksPage() {
  const list = [
    {
      id: 0,
      title: 'this is title',
      content: 'this is test content',
      createdAt: '03/01/2024',
      editedAt: '04/01/2024',
      isImportant: true,
      status: 0,
    },
    {
      id: 1,
      title: 'this is title',
      content: 'this is test content',
      createdAt: '03/01/2024',
      editedAt: '04/01/2024',
      isImportant: false,
      status: 1,
    },
    {
      id: 2,
      title: 'this is title',
      content:
        'this is test contentthis is test contentthis is test contentthis is test contentthis is test contentthis is test contentthis is test content',
      createdAt: '03/01/2024',
      editedAt: '04/01/2024',
      isImportant: false,
      status: 2,
    },
    {
      id: 3,
      title: 'this is title',
      content: 'this is test content',
      createdAt: '03/01/2024',
      editedAt: '04/01/2024',
      isImportant: false,
      status: 3,
    },
    {
      id: 4,
      title: 'this is title',
      content: 'this is test content',
      createdAt: '03/01/2024',
      editedAt: '04/01/2024',
      isImportant: false,
      status: 3,
    },
  ]

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
        return 'bg-red-500'
      case 1:
        return 'bg-yellow-500'
      case 2:
        return 'bg-green-500'
      case 3:
        return 'bg-gray-500'
    }
  }
  return (
    <div className='h-full py-5 relative'>
      <div className='p-5 absolute top-0 left-0 right-0 flex items-center justify-between bg-slate-700'>
        <h2 className='pb-2 text-2xl border-b-3 border-sky-400'>All Tasks</h2>
        <PiPlusCircle size={30} className='animate-scale-up-down' />
      </div>
      <div className='h-full pt-20 px-5 pb-5 flex flex-wrap content-start gap-5 overflow-y-auto'>
        {list.map((item) => (
          <div
            key={item.id}
            className='h-[220px] w-full lg:w-[275px] p-3 bg-slate-600 border border-slate-800 rounded-md'
          >
            <h3 className='text-xl'>{item.title}</h3>
            <p className='h-[85px] pt-3 line-clamp-3'>{item.content}</p>
            <div className='pt-5 flex justify-between text-sm text-gray-300'>
              <span>{item.createdAt}</span>
              <span>{item.editedAt}</span>
            </div>
            <div className='pt-3 flex justify-between'>
              <span
                className={`py-1 w-24 text-center rounded-xl text-sm ${getStatusColor(
                  item.status,
                )}`}
              >
                {getStatusText(item.status)}
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
        ))}
      </div>
    </div>
  )
}
