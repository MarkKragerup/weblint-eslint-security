// Example script input: javascript:alert('Hacked!');

// Declare variable, initialised as a safe concatenation of two explicit strings
let googleLink = "google.com" + "/contact";

const userInput = prompt("What input do you like?");

// Create text link
let a = document.createElement("a");
const btn = document.createTextNode("Click here");
a.appendChild(btn);

// Assign link value to the result of the safe addition, plus the result of some unsafe input
a.href = (userInput + googleLink).toLowerCase().replace('javascript:', '/javascript/:/');

document.body.appendChild(a);
