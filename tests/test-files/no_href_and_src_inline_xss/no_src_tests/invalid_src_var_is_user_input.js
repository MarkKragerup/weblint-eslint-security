// Example script input: javascript:alert('Hacked!');
const userInput = prompt("What input do you like?");

// Create text link
let iframe = document.createElement("iframe");

// Assign link destination to variable
iframe.src = userInput;

document.body.appendChild(iframe);
