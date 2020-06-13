# Disallows unescaped variables of uncertain origin from href and src values, due to the concern that they might originate from user input.

## Rule details
The following patterns are considered warnings:
```
    const userInput = prompt("What input do you like?");
    
    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);
    
    // Assign link destination to variable
    a.href = userInput;
    
    document.body.appendChild(a);
```
```
    const userInput = prompt("What input do you like?");
    
    // Create text link
    let iframe = document.createElement("iframe");
    
    // Assign link destination to variable
    iframe.src = userInput;
    
    document.body.appendChild(iframe);
```
```
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
```
```
    // Declare safe variable
    let googleLink = "google.com";

    // Re-assign to unknown user input
    googleLink = prompt("What input do you like?");

    // Create text link
    let iframe = document.createElement("iframe");

    // Insert link to variable
    iframe.src = googleLink;

    document.body.appendChild(iframe);
```
```
    let googleLink = "google.com" + "/contact"
    const userInput = prompt("What input do you like?");
    
    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);
    
    // Assign link value to the result of the safe addition, plus the result of some unsafe input
    a.href = userInput + googleLink;
    
    document.body.appendChild(a);
```
```
    // Declare variable, initialised as a safe concatenation of two explicit strings
    let googleLink = "google.com" + "/contact"
    const userInput = prompt("What input do you like?");
    
    // Initialize iframe
    let iframe = document.createElement("iframe");
    
    // Assign link value to the result of the safe addition, plus the result of some unsafe input
    iframe.src = userInput + googleLink;
    
    document.body.appendChild(iframe);
```
```
    const userInput = prompt("What input do you like?");
    
    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);
    
    // Insert template string including variable value as link destination
    a.href = `${userInput}`;
    
    document.body.appendChild(a);
```
```
    const userInput = prompt("What input do you like?");
    
    // Initialize iframe
    let iframe = document.createElement("iframe");
    
    // Insert template string including variable value as src destination
    iframe.src = `${userInput}`;
    
    document.body.appendChild(iframe);
```
