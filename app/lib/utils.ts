import mongoose from 'mongoose'
import fs from 'fs'

const connection = { isConnected: false }

export const connectToDB = async () => {
  try {
    if (connection.isConnected) return
    const db = await mongoose.connect(process.env.DB_CONNECT_URL!)
    connection.isConnected = !!db.connections[0].readyState
  } catch (error: any) {
    console.log('connectToDB error: ', error)
    throw new Error(error.message)
  }
}

export const base64ToLocalImg = (base64Str: string, path: string) => {
  try {
    const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '')
    const buf = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(path, buf)
    return { result: path }
  } catch (err: any) {
    console.log('base64ToLocalImg err: ', err)
    return { errMsg: err.errMsg }
  }
}
