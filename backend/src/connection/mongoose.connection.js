import mongoose from 'mongoose'
import debug from 'debug'
import {DB_NAME} from '../constants.js'

const dbgr = debug("development:mongoose")

const connectDB=async()=>{
    try {
        const connectionIntance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        dbgr(`MongoDB connected at ${connectionIntance.connection.host}`)
    } catch (error) {
        dbgr(`MongoDB connection Failed : ${error.message}`)
    }
}

export {connectDB}