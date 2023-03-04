const bcrypt = require('bcrypt')
class UserLogin{
    constructor(db,table){
        this.db = db
        this.table = table
    }
    findUser(username,password){
        return new Promise(async(resolve,reject) =>{
            try{
                const result = await this.db.query(`SELECT * FROM ${this.table} WHERE username=? AND password =?`,[username,password])
                if(result[0].length == 1){
                    
                    resolve(result[0][0])
                }
                resolve(null)
            }catch(e){reject(e)}
        })
    }
    encryptPass(username){
        return new Promise(async(resolve,reject) =>{
            try{
                const dbres = await this.db.query(`SELECT password FROM ${this.table} WHERE username =?`,[username])
            
                if(dbres[0].length == 1 ){
                   const encryption = await bcrypt.hash(dbres[0][0].password, 10)
                   console.log(encryption)
                   const match =bcrypt.compare(dbres[0][0].passowrd,encryption)
                   if(match){
                       console.log("hahhaha")
                   }
                }else{}
            }catch(e){reject(e)}
        })
        
    }

}
module.exports = UserLogin

