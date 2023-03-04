

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