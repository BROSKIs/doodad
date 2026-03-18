export function validateContact(data) {
    console.log("Starting contact validation...");
    console.log(data);

    const errors = [];

    /*
    name
    email
    message
    */

    // Empty name returns true.
    if (data.name.trim() == "") { errors.push("Name is required."); }

    // If the email fails validation, return true.
    if (!valid(data.email.trim()))
        { errors.push("A valid email must be entered."); }

    // Messages must be at least 10 characters or longer.
    if (data.message.trim().length < 10)
        { errors.push("Please enter a message that is greater than 10 characters."); }

    return { isValid: errors.length === 0, errors};
}

export function validateItem(data) {
    console.log("Starting item listing validation...");
    console.log(data);

    const errors = [];
    // HTML passes price as a string, and we need it as a number.

    /*
    itemImage (how do i verify this?)
    email
    name
    price
    desc (needs description?)
    */

    // If the email fails validation, return true.
    if (!valid(data.email.trim()))
        { errors.push("A valid email must be entered."); }

    // Empty name returns true.
    if (data.name.trim() == "") { errors.push("Name is required."); }

    // If price is not a number OR price < 0, return true.
    if (Number.isFinite(Number(data.price)) || Number(data.price) < 0) { 
        errors.push("Enter a price that is valid, and greater than or equal to 0.");
    }
    
    // Empty description returns true.
    if (data.desc.trim() == "") {errors.push("Item description is required.")}

    return { isValid: errors.length === 0, errors};
}

// function to validate emails. Must include "@ and ."
function valid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}