// Example script input: javascript:alert('Hacked!');

// Declare safe variable
let googleLink = "google.com";

// Re-assign to unknown user input
googleLink = prompt("What input do you like?");

// Create text link
let iframe = document.createElement("iframe");

// Insert link to variable
iframe.src = (googleLink).toLowerCase().replace('javascript:', '/javascript/:/');

document.body.appendChild(iframe);
