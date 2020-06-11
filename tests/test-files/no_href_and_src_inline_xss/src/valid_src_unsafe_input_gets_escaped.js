// Example script input: javascript:alert('Hacked!');
let userInput = prompt("What input do you like?");

// Create text link
let iframe = document.createElement("iframe");

// Assign link destination to an escaped version of the unsafe user input
iframe.src = userInput.toLowerCase().replace('javascript:', '/javascript/:/');

document.body.appendChild(iframe);
