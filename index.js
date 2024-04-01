import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors"
import db from './dbconnetion/db.js'/// database
import auth from './route/auth.js'



///
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors({
    origin:"*",  // allow to run on any origins
    methods: ["GET","POST","PUT","DELETE"],    //methods allowed
}))
app.use(cookieParser())
///// api router 
app.get( '/', (req, res) => {  res.send('Hello World!')})
app.use('/api/v1',auth)




 


 




//// server listen port 
app.listen(process.env.PORT,(err)=>{
    try {
        if (!err) console.log(`Server is running on http://localhost:${process.env.PORT}`)
    } catch (error) {
        console.log(`error in server port ${error}`)
    }
})
