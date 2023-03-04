const UserDao = require('../model/dao/user')
require('dotenv').config()
const valid = require('card-validator')
const fs = require('fs')


class UserController{
    constructor(db,table){
        this.dao = new UserDao(db,table)
    }
    async book(req,res){
        
        const result = await this.dao.book(req.body)
        
        if(result.length ==0){
            res.json(404).json("No place with that name has been found")
        }else{
            
            res.status(200).json(result)
        }
    }
    async addAccommodation(req,res){
        const results = await this.dao.addAccommodation(req.body)
        if(results == 0){
            res.status(400).json("The details you've entered are incorrect,wrong format or some boxes were left blank.")
        }else{
            res.status(200).json("Uploaded")
        }
    }
    async registerBooking(req,res){
     
        const result = await this.dao.registerBooking(req.body,req.session.username)
        if(result == 0){
            res.status(400).json("Not enough rooms are available for your number of people")
        }else if(result == -1){
            res.status(400).json("The date you've entered is not on the current list of availabilities.")
        }else{
            if(result.affectedRows == 1){
                
                res.status(200).json(result) 
            }else{
                res.status(400).json("One or all fields were not the right format")
            }
        }
    }

    async uploadPicture(req,res){
        try{
            const fileName = req.files.userPhoto.name;
          
            const result = await this.dao.uploadPicture(fileName,req.body.accomID)
            console.log(result)
            if(result != 1){
                res.status(403).json("We are unable to upload the file.")
            }else{
                await req.files.userPhoto.mv(`${process.env.PERMANENT_UPLOAD_DIR}/${req.body.accomID}_${fileName}`)
                res.status(200).json("File Uploaded")
            }
        }catch(e){
            console.log(e)
            res.status(500).json({"Error":"An server side error occured"})
        }
      
    }
    async viewPicture(req,res){
        try{
            const result = await this.dao.viewPicture(req.body.ID)
            if(result){
                
                res.json(result)
            }else{
                res.status(404).json("No photo has been found")
            }
        }catch(e){
            res.status(500).json("Something went wrong")
        }
    
    }
    async searchImage(req,res){
        try{
            
        }catch(e){res.status(500).json("Server is shut down")}
    }
    async cardValidator(req,res){
       try{
            var num = valid.number(req.body.cardNumber)
            var holder = valid.cardholderName(req.body.accountHolder)
            var expires = valid.expirationDate(req.body.mExpiry)
            var code = valid.cvv(req.body.cvv)
            console.log(req.body)
            console.log(num.isValid)
            if(num.isValid && holder.isValid && expires.isValid && code.isValid === true){
            
                res.status(200).json("Card is valid")
            }else{
               res.status(403).json({"ERROR":"Card details are wrong, the requested booking has been deleted"})
              
            }
       }catch(e){
           console.log(e)
           res.status(500).json({"ERROR":"An server error has occured"})}
    }
 
    async removeLastBooking(req,res){
        console.log("I have been called")
        const response = await this.dao.removeLastBooking()
        
        if(response == 1){
            res.status(200).json("successfully removed due to the lack of payment.")
        }
        else{
            res.status(500).json("Booking could not be removed, please remove it manually.")
        }
    }
}
module.exports = UserController