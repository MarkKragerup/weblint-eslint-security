// Example script input: javascript:alert('Hacked!');
const userInput = prompt("What input do you like?");

// Create text link
let a = document.createElement("a");
const btn = document.createTextNode("Click here");
a.appendChild(btn);

// Assign link destination to variable
a.href = userInput;

document.body.appendChild(a);
