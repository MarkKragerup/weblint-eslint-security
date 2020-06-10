// Declare and initialise variable as explicit string
let googleLink = "google.dk";

// Create text link
let a = document.createElement("a");
const btn = document.createTextNode("Click here");
a.appendChild(btn);

// Set link destination as value of safe string
a.href = googleLink;

document.body.appendChild(a);
