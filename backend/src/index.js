import { connectDB } from "./connection/mongoose.connection.js";
import {app} from "../src/app.js"
import dotenv from 'dotenv'
import debug from 'debug'

const dbgr = debug("development:server")

dotenv.config()

const PORT = 3000

connectDB()
.then(()=>{
    app.listen(PORT,()=>dbgr(`Server Started at http://localhost:${PORT}`))
})
.catch((error)=>{
    dbgr(`Server Failed To Start : ${error.message}`)
})