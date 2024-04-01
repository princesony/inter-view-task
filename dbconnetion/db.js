import mysql from "mysql2"

export const db = mysql.createConnection({
    host:"localhost",
    user: 'root',
    password:"9584123044",
    database:'interview'
})

db.connect(()=>{
    try {
        console.log('database connect successfully')
    } catch (error) {
        console.log(`error in database connection`)
    }
})


export default db