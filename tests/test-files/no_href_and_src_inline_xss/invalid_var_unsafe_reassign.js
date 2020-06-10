// Example script input: javascript:alert('Hacked!');

// Declare safe variable
let googleLink = "google.com";

// Re-assign to unknown user input
googleLink = prompt("What input do you like?");

// Create text link
let a = document.createElement("a");
const btn = document.createTextNode("Click here");
a.appendChild(btn);

// Insert link to variable
a.href = googleLink;

document.body.appendChild(a);
