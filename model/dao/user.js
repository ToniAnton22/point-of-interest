
class UserDao{
    constructor(db,table){
        this.db = db;
        this.table = table;
    }
    book(acc){
        return new Promise(async(resolve,reject) =>{
            try{
             
                const results = await this.db.query(`SELECT * FROM ${this.table} WHERE id=?`,[acc.accID])
                
                if(results != null ){
                    if(results[0].length == 1){
                       
                        resolve(results[0])
                    }else{
                        resolve(null)
                    }
                }
                resolve(null)
            }catch(e){
                reject(e)
            }
        })
    }
    registerBooking(body,username){
        return new Promise(async(resolve,reject) =>{
            try{
                const spacesLeft = await this.db.query(`SELECT * FROM acc_dates WHERE thedate = ? AND accID = ?`,[body.thedate,body.accID])
                if(spacesLeft[0][0]== undefined || spacesLeft[0][0].thedate != body.thedate ){
                    resolve(-1)
                }else{
                    const spacesLeft = await this.db.query(`SELECT * FROM acc_dates WHERE thedate = ? AND accID = ?`,[body.thedate,body.accID])
                    let res = spacesLeft[0][0].availability - body.npeople
               
                    if(spacesLeft[0][0].availability- body.npeople < 0){
                        resolve(0)
                    }else{
                        const result= await this.db.query(`INSERT INTO ${this.table} (accID,thedate,username,npeople) VALUES (?,?,?,?)`,[body.accID,body.thedate,username,body.npeople])
                        
                        if(result[0].affectedRows == 1){
                            await this.db.query(`UPDATE acc_dates SET availability = availability - ${body.npeople} WHERE thedate =? AND accID = ?`,[body.thedate,body.accID])
                            resolve(result[0])
                        }
                        resolve(null)       
                    }
                resolve(null)            
                }
                
            }catch(e){reject(e)}
        })
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
    removeLastBooking(){
        return new Promise(async(resolve,reject) =>{
            try {
                const select = await this.db.query(`SELECT * FROM ${this.table} ORDER BY ID DESC limit 1`)
                if(select){
                    console.log(select[0][0])
                    await this.db.query(`UPDATE acc_dates SET availability = availability + ${select[0][0].npeople} WHERE thedate =? AND accID = ?`,[select[0][0].thedate,select[0][0].accID])
                }
                const remove = await this.db.query(`DELETE FROM ${this.table} ORDER BY ID DESC limit 1`)
                
                if(remove[0].affectedRows ==1){
                    resolve(1)
                }
                else{
                    resolve(null)
                }
            } catch (e) {
                console.log(e)
                reject(e)
            }
        })
    }
    uploadPicture(fileName,accomID){
        return new Promise(async(resolve,reject) =>{
            try{
                
                const result = await this.db.query(`UPDATE ${this.table} SET images = ? WHERE ID = ?`,[fileName,accomID])
                if(result[0].affectedRows == 1){
                    resolve(1)
                }else{
                    resolve(null)
                }
            }catch(e){
                reject(e)
            }
        })
    }
    viewPicture(id){
        return new Promise(async(resolve,reject) =>{
            try{
                const result = await this.db.query(`SELECT images FROM ${this.table} WHERE ID =? `[id])
                if(result[0].length == 1){
                    resolve(result[0])
                }else{
                    resolve(null)
                }
            }catch(e){
                reject(e)
            }
        })
    }
    addAccommodation(details){
        return new Promise(async(resolve,reject) =>{
            try{
                console.log(details)
                if(details.name && details.type && details.location && details.longitude && details.latitude && details.description){
                    if(details.name.length == 0  || details.type.length == 0  ||details.location.length == 0  || parseInt(details.longitude) == NaN  || 
                    parseInt(details.latitude) == NaN  || details.description.length == 0){
                        resolve(0)
                    }else{
                        const result = await this.db.query(`INSERT INTO ${this.table} (name,type,location,longitude,latitude,description) VALUES (?,?,?,?
                            ,?,?)`,[details.name,details.type,details.location,details.longitude,details.latitude,details.description])
                        if(result[0].affectedRows == 1){
                            resolve(1)
                        }else{
                            resolve(0)
                        }
                    
                    }
                }else{
                    resolve(0)
                }
             
                
            }catch(e){reject(e)}
        })
    }
}
module.exports = UserDao