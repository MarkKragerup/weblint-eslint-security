// Example script input: javascript:alert('Hacked!');

// Declare variable, initialised as a safe concatenation of two explicit strings
let googleLink3 = "google.com" + "/contact";

// Create text link
let iframe = document.createElement("iframe");

// Assign link value to the result of the safe addition, plus the result of some unsafe input
iframe.src = googleLink3 + "/address";

document.body.appendChild(iframe);