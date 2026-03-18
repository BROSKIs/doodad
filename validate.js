export function validateContact(data) {
    console.log("Starting contact validation...");
    console.log(data);

    const errors = [];

    /*
    name
    email
    message
    */

    if (data.name.trim() == "") { errors.push("Name is required."); }
    if (data.email.trim() == "" || !valid(data.email.trim()))
        { errors.push("A valid email must be entered."); }
    if (data.message.trim().length < 10)
        { errors.push("Please enter a message that is greater than 10 characters.")};

    return { isValid: errors.length === 0, errors};
}

export function validateItem(data) {
    console.log("Starting item listing validation...");
    console.log(data);

    const errors = [];

    /*
    itemImage (how do i verify this?)
    email
    name
    price
    desc (needs description?)
    */




    return { isValid: errors.length === 0, errors};
}

// function to validate emails. Must include "@ and ."
function valid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}