// Example script input: javascript:alert('Hacked!');
const userInput = prompt("What input do you like?");

// Create text link
let iframe = document.createElement("iframe");

// Insert template string including variable value as link destination
iframe.src = (`${userInput}`).toLowerCase().replace('javascript:', '/javascript/:/');

document.body.appendChild(iframe);
