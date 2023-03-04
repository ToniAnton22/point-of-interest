const express = require('express')
const userRoutes = express.Router()
const UserController = require("../controller/userFunc")

async function startRoute(){
    //Start database for this route
    const dbStarter = require('../controller/con_database')
    const con = await dbStarter.conDatabase()
     userRoutes.use((req,res,next) =>{
     
         if(["POST","DELETE"].indexOf(req.method) == -1){
             next();
         }else{
             if(req.session.username){
                 next()
             }else{
              
                 res.status(401).json("You're not logged in. Go AWAY")
             }
        }
    })
  
    const userController = new UserController(con,"accommodation")
    const userBooking = new UserController(con,"acc_bookings")
    userRoutes.get("/",(req,res)=>{
        res.send("hi search router!")
    })
    userRoutes.post("/bookAccommodation",userController.book.bind(userController))

    userRoutes.post('/addAccommodation',userController.addAccommodation.bind(userController))

    userRoutes.post("/booked",userBooking.registerBooking.bind(userBooking))
    
    userRoutes.post('/photos/upload',userController.uploadPicture.bind(userController))
    
    userRoutes.post('/card/check',userController.cardValidator.bind(userController))
    userRoutes.post('/delete/lastBooking',userBooking.removeLastBooking.bind(userBooking))
}

startRoute()

module.exports = userRoutes