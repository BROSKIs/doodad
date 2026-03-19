document.getElementById("itemCreate").onsubmit = validate;

function validate() {
    let isValid = true;
    clearErrors();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
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