document.getElementById("contact-us-form").onsubmit = validate;

function validate(){
    isValid = true;
    //Clear erros
    clearErrors();
    // if name or email is empty not submit
    let name = document.getElementById("name").value.trim();
    if(!name){
        isValid = false;
        document.getElementById("name-err").style.display = "inline-block";
    }
    let email = document.getElementById("email").value.trim();
    if(!email){
        isValid = false;
        document.getElementById("email-err").style.display = "inline-block";
    }
    return isValid;
}
//function to clear erros
function clearErrors(){
    let errors = document.getElementsByClassName("err");
    for(let i=0; i<errors.length; i++){
        errors[i].style.display = "none";
    }
}