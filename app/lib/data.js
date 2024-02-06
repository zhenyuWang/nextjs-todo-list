import { User, Task } from './models'
import { connectToDB } from './utils'

export const fetchTasks = async (q = '', pageNum = 1, pageSize = 10000) => {
  const regex = new RegExp(q, 'i')

  try {
    connectToDB()
    const total = await Task.find({ title: { $regex: regex } }).count()
    const tasks = await Task.find({ title: { $regex: regex } })
      .limit(pageSize)
      .skip(pageSize * (pageNum - 1))
    return { total, tasks }
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch tasks!')
  }
}

export const fetchTask = async (id) => {
  try {
    connectToDB()
    return await Task.findById(id)
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch task!')
  }
}
