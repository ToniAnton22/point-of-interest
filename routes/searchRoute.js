const express = require('express')
const searchRoutes = express.Router()
const SearchController = require('../controller/search')


async function startRoute(){
    //Start database for this route
    const dbStarter = require('../controller/con_database')
    const con = await dbStarter.conDatabase()
    const searchController = new SearchController(con,"accommodation");

    searchRoutes.get("/",(req,res)=>{
        res.send("hi search router!")
    })
    searchRoutes.get('/bytype/:type',searchController.findByType.bind(searchController) )

    searchRoutes.post('/view/picture',searchController.findPhotos.bind(searchController))


}
startRoute()

module.exports = searchRoutes