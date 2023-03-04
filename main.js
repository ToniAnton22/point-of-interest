//Server libraries
const express = require('express');
const app = express();
const cors = require('cors')
const bcrypt = require('bcrypt')
const expressSession = require('express-session')
const fs = require('fs').promise
const UserLoginDao = require('./model/dao/singup')
const UserLoginController = require('./controller/login')


//Routes
const searchRoutes = require('./routes/searchRoute')
const userRoutes = require('./routes/userRoutes')

//Variables for our session middlware
const passport = require('passport');
const UserController = require('./controller/userFunc');
const LocalStrategy = require('passport-local').Strategy
const MySQLStore = require('express-mysql-session')(expressSession)
const fileUpload = require('express-fileupload')

//Middleware
require('dotenv').config()
app.use(express.static("views/public"))
app.use(express.static("dist"))
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin:  "http://localhost"
}))
app.use(fileUpload({
    useTempFlies:true,
    tempFileDir: process.env.TMPDIR,
    limits:{fileSize: process.env.UPLOAD_LIMIT_IN_MB *1024 *1024}
}))


async function startServer(){
    
    let con = null
    try{
        
        //Starts database
        const dbStarter = require('./controller/con_database')
        con = await dbStarter.conDatabase()
        const sessionStore = new MySQLStore({ },con);
        app.use(expressSession({
            store: sessionStore,
            secret: process.env.COOKIE_SECRET,
            resave: false,
            saveUninitialized: false,
            rolling: true,
            unset: 'destroy',
            proxy: true,
            cookie:{
                maxAge: 600000,
                httpOnly: false
            }
        }))
        console.log("Everything is connected!")
     
    }catch(e){
        console.error("The database connection has failed")
        console.log(e)
        process.exit(1)
    }
    app.use(passport.session())
    const loginController = new UserLoginController(con,"acc_users")

    passport.use(new LocalStrategy(loginController.findUser.bind(loginController)),)
    

    passport.serializeUser((userDetails,done)=>{
        done(null,userDetails.ID)
    })
    passport.deserializeUser(async(userid,done) =>{
        try{
            const loginDao = new UserLoginDao(con,"acc_users")
            const details = await loginDao.findUser(userid)
            done(null,details)

        }catch(e){
            done(e)
        }
    })
    
   
    //Finish encrypting later
    app.get('/encrypt',async(req,res) =>{
        const loginDao = new UserLoginDao(con)
        const encrypt = await loginDao.encryptPass("tim")
      
        res.send(encrypt)
    })
    app.post('/login',passport.authenticate('local',{failureRedirect:'/badlogin'}),(req,res)=>{
        
        req.session.username = req.user.username
        res.redirect('http://localhost:3300/index.html')
  
    })
    app.get('/login',(req,res) =>{
        res.json({username: req.session.username || null} );
    })
    app.post('/logout', (req,res) =>{
        req.session = null
        res.json({"success":1})
    })
    app.get('/badlogin',(req,res) =>{
        req.session.username = -1
        res.redirect('http://localhost:3300/index.html')

    })
    app.get('/test',async(req,res) =>{
        try{
           

        }catch(e){res.json(e)}
    })

    let userController = new UserController(con,"accommodation")
    //Enable Search Router
    app.use("/search",searchRoutes)
    
    app.use("/user",userRoutes)
    app.post('/view/picture',userController.viewPicture.bind(userController))
    
    
    app.listen(process.env.APP_PORT)
}

startServer()
console.log("Server is listening on the port "+ process.env.APP_PORT)