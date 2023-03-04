//Get imports

const {setUpMap, setUpMarkers} = require('../scripts/map')
const ajaxFun = require('../scripts/ajax')
const { creditCardValidator } = require('../scripts/cardValidator')
const {addAccommodationForm} = require("../scripts/map")
//Initialize map
const map = L.map("map")

setUpMap(map)

map.on("click", e =>{
    addAccommodationForm(e)
})

//Get Buttons
document.getElementById("ccButton").addEventListener("click",creditCardValidator.bind(this))

document.getElementById("searchTypeBtn").addEventListener("click",ajaxFun.search.bind(this,setUpMarkers,map))

//Check if logged in
ajaxFun.loggedStatus()



