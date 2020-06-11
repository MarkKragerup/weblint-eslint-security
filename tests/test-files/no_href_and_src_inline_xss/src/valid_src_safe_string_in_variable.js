// Declare and initialise variable as explicit string
let googleLink = "google.dk";

// Create text link
let iframe = document.createElement("iframe");

// Set link destination as value of safe string
iframe.src = googleLink;

document.body.appendChild(iframe);
