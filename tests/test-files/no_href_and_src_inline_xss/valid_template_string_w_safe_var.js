// Example script input: javascript:alert('Hacked!');
const myLink = "google.com";

// Create text link
let a = document.createElement("a");
const btn = document.createTextNode("Click here");
a.appendChild(btn);

// Insert template string including variable value as link destination
a.href = `${myLink}`;

document.body.appendChild(a);
