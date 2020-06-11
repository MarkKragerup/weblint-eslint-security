// Example script input: javascript:alert('Hacked!');

// Declare variable, initialised as a safe concatenation of two explicit strings
let googleLink = "google.com" + "/contact";

const userInput = prompt("What input do you like?");

// Create text link
let iframe = document.createElement("iframe");

// Assign link value to the result of the safe addition, plus the result of some unsafe input
iframe.src = userInput + googleLink;

document.body.appendChild(iframe);
