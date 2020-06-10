// Example script input: javascript:alert('Hacked!');
const userInput = prompt("What input do you like?");

// Create text link
let a = document.createElement("a");
const btn = document.createTextNode("Click here");
a.appendChild(btn);

// Insert template string including variable value as link destination
a.href = `${userInput}`;

document.body.appendChild(a);
