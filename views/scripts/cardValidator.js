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