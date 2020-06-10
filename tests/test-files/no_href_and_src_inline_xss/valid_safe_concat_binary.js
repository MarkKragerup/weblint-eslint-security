// Example script input: javascript:alert('Hacked!');

// Declare variable, initialised as a safe concatenation of two explicit strings
let googleLink3 = "google.com" + "/contact";

// Create text link
let a = document.createElement("a");
const btn = document.createTextNode("Click here");
a.appendChild(btn);

// Assign link value to the result of the safe addition, plus the result of some unsafe input
a.href = googleLink3 + "/address";

document.body.appendChild(a);