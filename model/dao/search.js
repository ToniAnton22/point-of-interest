class SearchDao{
    constructor(db,table){
        this.db = db
        this.table = table
    }
    findById(id){
        return new Promise( async(resolve,reject) =>{
            
            try{
                const results = this.db.query(`SELECT * FROM ${this.table} WHERE ID = ?`,[id])
                
                if(results[0].length ==1){
                  
                    resolve(results)
                }
                resolve(null)
            }catch(e){
                console.log(e)
                reject(e)
            }

        })
    }
    findByType(type){
        return new Promise(async(resolve,reject)=>{
            try{  
               
                const results =await this.db.query(`SELECT * FROM ${this.table} WHERE type = ? `,[type])
            
                if(results[0].length == 0){
                    resolve(null)
                }
                resolve(results)
            }catch(e){
                console.log(e)
                reject(e)
            }
        })
    }
    findPhotos(accomodation){
        return new Promise(async(resolve,reject) =>{
            try{
               
                const results = await this.db.query(`SELECT images FROM ${this.table} WHERE ID = ?`,[accomodation])
                console.log(results[0])
                if(results[0].length == 0){
                    resolve(null)
                }
                resolve(results[0])
            }catch(e){reject(e)}
        }) 
    }
}

module.exports = SearchDao