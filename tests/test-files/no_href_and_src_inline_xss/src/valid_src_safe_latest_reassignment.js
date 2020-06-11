// Example script input: javascript:alert('Hacked!');

// Declare and initialise variable as explicit string
let googleLink = "google.com";

// Re-assign variable to potentially unsafe input
googleLink = prompt("What input do you like?");

// Re-assign variable again, to safe explicit string
googleLink = "drive.google.com";

// Create text link
let iframe = document.createElement("iframe");

// Insert variable value as link destination
iframe.src = googleLink;

document.body.appendChild(iframe);
