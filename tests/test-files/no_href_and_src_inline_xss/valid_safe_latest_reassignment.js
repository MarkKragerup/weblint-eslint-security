// Example script input: javascript:alert('Hacked!');

// Declare and initialise variable as explicit string
let googleLink = "google.com";

// Re-assign variable to potentially unsafe input
googleLink = prompt("What input do you like?");

// Re-assign variable again, to safe explicit string
googleLink = "drive.google.com";

// Create text link
let a = document.createElement("a");
const btn = document.createTextNode("Click here");
a.appendChild(btn);

// Insert variable value as link destination
a.href = googleLink;

document.body.appendChild(a);
