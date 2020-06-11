// Example script input: javascript:alert('Hacked!');
const myLink = "google.com";

// Create text link
let iframe = document.createElement("iframe");

// Insert template string including variable value as link destination
iframe.src = `${myLink}`;

document.body.appendChild(iframe);
