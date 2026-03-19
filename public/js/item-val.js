document.getElementById("itemCreate").onsubmit = validate;

function validate() {
    let isValid = true;
    clearErrors();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let price = document.getElementById("price").value;
    let desc = document.getElementById("desc").value.trim();

    // if name is empty
    if(!name){
        isValid = false;
        document.getElementById("name-err").style.display = "inline-block";
    }
    
    // if email is empty or email is not valid
    if(!valid(email) || !email){
        isValid = false;
        document.getElementById("email-err").style.display = "inline-block";
    }

    // if price is below zero
    if (price < 0) {
        isValid = false;
        document.getElementById("price-err").style.display = "inline-block";
    }

    // if item description is empty
    if(!desc) {
        isValid = false;
        document.getElementById("desc-err").style.display = "inline-block";
    }

    return isValid;
}

// function to clear errors
function clearErrors(){
    let errors = document.getElementsByClassName("err");
    for(let i=0; i<errors.length; i++){
        errors[i].style.display = "none";
    }
}

// function to validate emails. Must include "@ and ."
function valid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}