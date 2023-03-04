require('dotenv').config()
const mysql_promise = require('mysql2/promise')
let con = null

async function conDatabase(){
    
    if(con == null){
       
        con = await mysql_promise.createConnection({
            host: process.env.APP_HOST,
            database: process.env.APP_DATABASE,
            user: process.env.APP_USERNAME,
            password: process.env.APP_PASSWORD,
            port: process.env.DB_PORT
         })
  
    }
    return con
    
   
    
}
module.exports = {
    conDatabase
}