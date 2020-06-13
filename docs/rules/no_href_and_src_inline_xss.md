# Disallows unescaped variables of uncertain origin from href and src values, due to the concern that they might originate from user input.

## Rule details
The following patterns are considered warnings:

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
