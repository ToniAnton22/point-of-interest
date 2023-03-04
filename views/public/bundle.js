(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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




},{"../scripts/ajax":2,"../scripts/cardValidator":3,"../scripts/map":4}],2:[function(require,module,exports){


async function changeStatus(username){
 
    if(username){
        let logoutButton = document.createElement('button')
        logoutButton.textContent = "Logout"
        logoutButton.setAttribute("type","submit")
        document.getElementById("change").innerHTML = `Logged in as ${username} `
        document.getElementById("change").append(logoutButton)
        logoutButton.addEventListener("click",logout.bind(this))
    }else{
        document.getElementById("change").innerHTML =`<h2 > Login in below </h2>
        <form action='/login' method = "post" id ="signup">
            <label for="username"> Username</label>
            <input type='text' name='username' id ="username" placeholder = "username">
            <label for ="passowrd">Password</label>
            <input type="password" name="password" id= "password" placeholder="password">
            <button type= 'submit' value= "submit" id = "loginSubmit">Login</button>
        </form>`
    }
    
    
}
async function loggedStatus(){
    document.getElementById("wrongCredentials").style.display = "none"
    const response =await (await fetch("http://localhost:3300/login")).json()
   
    if(response.username == -1){
       
        document.getElementById("wrongCredentials").style.display = "block"
    }else{
        if(response.username){
            await changeStatus(response.username)
        }else{
            document.getElementById("wrongCredentials").style.display = "block"    
        }
    }  
}

async function logout(){
    
    let response = await fetch("http://localhost:3300/logout",{
        method: "POST",
    })
    let user = response.json()
    await changeStatus(user.username)
}

async function bookQuery(id){
    document.getElementById("bookForm").style.display = "block"
    
    document.getElementById("bookingDetails").addEventListener("click",book.bind(this,id))
}

async function book(id){
   
    let bookError = document.getElementById("bookError")
    let npeople = document.getElementById("npeople").value
    let thedate = document.getElementById("date").value
    const acc = {accID:id,npeople: parseInt(npeople),thedate: parseInt(thedate)}
   
    try{
       
        var response = await fetch(`http://localhost:3300/user/bookAccommodation`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(acc)
        })
        
        if(response.status == 200){
            
            if(acc.npeople&&acc.thedate){
                var resp = await fetch(`http://localhost:3300/user/booked`,{
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(acc)
            })
                if(resp.status == 200){
                    document.getElementById("cc").style.display = "block"
                    alert("Booking in place, to finish the transaction enter your card details to finish the payment.")
                   
                }
                else if(resp.status == 400){
                    bookError.innerHTML = await resp.text()
                    bookError.style.display = "block"
                    
                }else{
                    bookError.innerHTML ="Some error might have occured"
                    bookError.style.display = "block"
                }
            }else{
          
                bookError.innerHTML = "Information provided is either missing or in the wrong format."
                bookError.style.display = "block"
            }
              
        }else if(response.status == 401){
            bookError.innerHTML = await response.text()
            bookError.style.display = "block"
        }
        else{
            bookError.innerHTML = "No such place has been found"
            bookError.style.display = "block"
        }
    }catch(e){
        console.log(e)
        bookError.innerHTML = e
        bookError.style.display = "block"
    }

}

async function bookCreation(accommodation){
    const node = document.getElementById("tableBody")
    const html = document.createElement("tr")
    node.appendChild(html)
    html.innerHTML = `
    <td>${accommodation.name}</td>
    <td>${accommodation.type}</td>
    <td>${accommodation.location}</td>
    <td><button id="bookbutton${accommodation.ID}">Book!</button></td>`
    
    document.getElementById(`bookbutton${accommodation.ID}`).addEventListener("click",bookQuery.bind(this,accommodation.ID))    
  
}

async function search(setUpMarkers,map){
    let dom = document.getElementById("result")
    dom.textContent = ''
    document.getElementById("tableBody").textContent = ''
    
    var type = document.getElementById('searchTxt').value;
    var node 
    var response = await fetch(`http://localhost:3300/search/bytype/${type}`)
    
    if(response.status == 200){    
        
        var accom = await response.json()
        accom[0].forEach(accom =>{
            bookCreation(accom)
            setUpMarkers(accom,map)
        })
        
    }else{
        node = document.createElement('h2')
        html = document.createTextNode(`No result found while searching for ${type}`)
        node.appendChild(html)
        document.getElementById("result").appendChild(node)
    }

}

async function uploadPictures(acc){
    
    const photoFiles = document.getElementById("userPhoto").files
    
    if(photoFiles.length == 0){
        alert('No files selected!')

    }else{
        const formData = new FormData();
        formData.append('userPhoto',photoFiles[0])
        formData.append('accomID',acc.ID)
        
       
        const response = await fetch('http://localhost:3300/user/photos/upload',{
            method: 'POST',
            body: formData
        })
        
        if(response.status == 200){
            alert("Upload successful")
        }else{
           
            alert("Something went wrong")
        }
    }
}
async function checkPictures(acc){
    const response = await fetch("http://localhost:3300/view/picture",{
        method: "POST",
        body: JSON.stringify(acc)
    })
    if (response.status == 200){
        let list = []
        let pictures = response.json()
        forEach.pictures(picture =>{
            list.append(picture)
        })
        const answer = await fetch("http://localhost:3300/")
    }
}
module.exports = {
    changeStatus,
    loggedStatus,
    logout,
    book,
    search,
    uploadPictures,
    bookCreation
}
},{}],3:[function(require,module,exports){
async function creditCardValidator(){
    let bookSuccess = document.getElementById("bookSuccess")
    let bookError = document.getElementById("bookError")
    const number = document.getElementById("cardnum").value
    const mExpiry= document.getElementById("monthExp").value
    const cvv = document.getElementById("securityCode").value
    const holder = document.getElementById("accHolder").value
    const cardDetails = {cardNumber: number, mExpiry,accountHolder: holder, cvv}
    document.getElementById("bookForm").style.display = "none"
    const response = await fetch('http://localhost:3300/user/card/check',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(cardDetails)
    })
    if(response.status == 200){
        bookError.style.display = "none"
        bookSuccess.innerHTML = "Your booking has been successful"
        bookSuccess.style.display = "block"
        
        document.getElementById("cc").style.display = 'none'
    }else{
        bookError.innerHTML = "The card is invalid, we will be removing the booking as per company policy."
        bookError.style.display = "block"
        await fetch('http://localhost:3300/user/delete/lastBooking',{
            method:'POST'
        })
        document.getElementById("cc").style.display = 'none'
    }
}

module.exports = {
    creditCardValidator
}
},{}],4:[function(require,module,exports){
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
    console.log(data)
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
        console.log(`The values are ${accomDetails[i]} and they are ${ready}`)
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
    console.log(ready, send)
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
},{"./ajax":2}]},{},[1]);
