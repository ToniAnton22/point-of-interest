const SearchDao = require('../model/dao/search')

class searchController{
    constructor(db,table){
        this.dao = new SearchDao(db,table)
    }
    async findByType(req,res){
        console.log(req.params)
        const results = await this.dao.findByType(req.params.type)
        console.log(results)
        if(results==null){
            res.status(404).json(results)
        }else{
            res.status(200).json(results)
        }
    }
    async addAccommodation(req,res){
        const results = await this.user.addAccommodation(req.body)
        if(results == 0){
            res.status(401).json("The details you've entered are incorrect or in the wrong format")
        }else{
            res.status(200).json("Uploaded")
        }
    }
    async findPhotos(req,res){
        const results = await this.dao.findPhotos(req.body.ID)
        if(results[0].length == 0){
            res.status(404).json("No images have been found.")
        }else{
            res.status(200).json(results)
        }
    }
}
module.exports = searchController