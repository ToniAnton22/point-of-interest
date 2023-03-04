const {uploadPictures} = require('./ajax')

function setUpMap(map){
    const attrib = "Map data copyright OpenStreetMap,contributors, Open Database Licence"
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution: attrib}).addTo(map)
    map.setView([50.908,-1.4],10)
}
async function setUpMarkers(accommodation,map){
    try{
        const node = document.createElement("div")
        const marker =L.marker([accommodation.latitude,accommodation.longitude]).addTo(map)
        const picButton = document.createElement("input")
        picButton.setAttribute("id",`uploadBtn${accommodation.ID}`)
        picButton.setAttribute("type","button")
        picButton.setAttribute("value","Upload pictures of accomodation!")
        picButton.textContent = "Upload picture of accommodation!"
        
    
        const fileHandler = document.createElement("input")
        fileHandler.setAttribute("type","file")
        fileHandler.setAttribute("id","userPhoto")

        let text = document.createElement(`form`)
        text.setAttribute("method","post")
        text.setAttribute("enctype", "multipart/form-data")
        text.setAttribute("action","/search/view/picture")
        
        text.appendChild(fileHandler)
        text.appendChild(picButton)
        picButton.addEventListener("click",uploadPictures.bind(this,accommodation))
        let html = `You clicked on ${accommodation.name}. ${accommodation.description}. They offer ${accommodation.type}
    services in ${accommodation.location}.`
        node.append(html)
        node.appendChild(text)
        // <img src="/getimage/3" />
        
        marker.bindPopup(node)
        map.setView([accommodation.latitude,accommodation.longitude],9)
        
    }catch(e){
        console.log(e)
        alert("Something went wrong with the markers")
    }
   
}
async function addAccommodationForm(event){
    document.getElementById("lat").setAttribute("value",`${event.latlng.lat}`)
    document.getElementById("lon").setAttribute("value",`${event.latlng.lng}`)
    document.getElementById("addForm").style.display="block";
    
    document.getElementById("addButton").addEventListener("click",addAccommodation.bind(this,[event.latlng.lat,event.latlng.lng]))
}

async function verifyInput(data){
    let ready;
    if(data == '' || data == undefined || data == null){
        ready = false
        return ready
    }
    ready = true
    return ready

}

async function addAccommodation(data){
   
    let accomDetails = {
        name:document.getElementById("name").value,
        type:document.getElementById("type").value,
        location:document.getElementById("loc").value,
        latitude:data[0],
        longitude:data[1],
        description:document.getElementById("description").value
    }
    
    const message = document.getElementById("addResponse")
    message.textContent = ''
    let ready;
    let send = false
    for(i in accomDetails){
        let text = document.createElement("h4");
        ready = await verifyInput(accomDetails[i])
        if(ready === false){
            text.innerHTML = `* The ${i} box is required, please don't leave any blank boxes.`
            
            message.appendChild(text)
        }
   
    }
    if(message.textContent == ''){
        send = true
    }else{
        message.style.display = "block"
    }
    if(send === true && ready === true){
        const response = await fetch("http://localhost:3300/user/addAccommodation",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(accomDetails)
    })
        if(response.status == 200){
            message.innerHTML = "Your accommodation has been uploaded successfully"
            message.style.display = "block"
            
        }else if(response.status == 401){
            message.innerHTML = await response.text()
            message.style.display = "block"
        }else{
            message.innerHTML = await response.text()
            message.style.display = "block"
        }
    }
    
}

module.exports = {
    setUpMap,
    setUpMarkers,
    addAccommodationForm
   
}