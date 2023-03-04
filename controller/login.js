const LoginDao = require('../model/dao/singup')

class LoginController{
    constructor(db,table){
        this.dao = new LoginDao(db,table)
    }
    async findUser(username,password,done){
        try{
            const userDetails =await this.dao.findUser(username,password);
            
            if(userDetails == null){
                done(null,false)
            }else{
             
                done(null,userDetails)
            }
        }catch(e){
            done(e)
        }
    }
}
module.exports = LoginController