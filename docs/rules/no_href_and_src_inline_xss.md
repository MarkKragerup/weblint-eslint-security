# Disallows unescaped variables of uncertain origin from href and src values, due to the concern that they might originate from user input.

## Rule details
The following test files serves as a demonstration of all the different situations the rule is considering.
<br/><br/>
The following patterns are considered warnings:
<br/><br/>
Variable with unsafe user input.
```javascript
    const userInput = prompt("What input do you like?");
    
    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);
    
    // Assign link destination to variable
    a.href = userInput;
    
    document.body.appendChild(a);
```

Variable with unsafe user input.
```javascript
    const userInput = prompt("What input do you like?");
    
    // Initialize iframe
    let iframe = document.createElement("iframe");
    
    // Assign link destination to variable
    iframe.src = userInput;
    
    document.body.appendChild(iframe);
```

Safe variable gets reassigned to unsafe user input.
```javascript
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

Safe variable gets reassigned to unsafe user input.
```javascript
    // Declare safe variable
    let googleLink = "google.com";

    // Re-assign to unknown user input
    googleLink = prompt("What input do you like?");

    // Initialize iframe
    let iframe = document.createElement("iframe");

    // Insert link to variable
    iframe.src = googleLink;

    document.body.appendChild(iframe);
```

Safe string concatenation is concatenated with unsafe user input.
```javascript
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

Safe string concatenation is concatenated with unsafe user input.
```javascript
    // Declare variable, initialised as a safe concatenation of two explicit strings
    let googleLink = "google.com" + "/contact"
    const userInput = prompt("What input do you like?");
    
    // Initialize iframe
    let iframe = document.createElement("iframe");
    
    // Assign link value to the result of the safe addition, plus the result of some unsafe input
    iframe.src = userInput + googleLink;
    
    document.body.appendChild(iframe);
```

Variable containing unsafe user input is used in a template string.
```javascript
    const userInput = prompt("What input do you like?");
    
    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);
    
    // Insert template string including variable value as link destination
    a.href = `${userInput}`;
    
    document.body.appendChild(a);
```

Variable containing unsafe user input is used in a template string.
```javascript
    const userInput = prompt("What input do you like?");
    
    // Initialize iframe
    let iframe = document.createElement("iframe");
    
    // Insert template string including variable value as src destination
    iframe.src = `${userInput}`;
    
    document.body.appendChild(iframe);
```

The following patterns are NOT considered warnings:
<br/><br/>
Safe string concatenation.
```javascript
    // Declare variable, initialised as a safe concatenation of two explicit strings
    let googleLink3 = "google.com" + "/contact";

    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);

    // Assign link value to the result of the safe addition, plus the result of some unsafe input
    a.href = googleLink3 + "/address";

    document.body.appendChild(a);
```

Safe string concatenation.
```javascript
    // Declare variable, initialised as a safe concatenation of two explicit strings
    let googleLink3 = "google.com" + "/contact";

    // Initialize iframe
    let iframe = document.createElement("iframe");

    // Assign link value to the result of the safe addition, plus the result of some unsafe input
    iframe.src = googleLink3 + "/address";

    document.body.appendChild(iframe);
```

Safe variable is reassigned to unsafe user input, but reassigned again to safe string.
```javascript
    // Declare and initialise variable as explicit string
    let googleLink = "google.com";

    // Re-assign variable to potentially unsafe input
    googleLink = prompt("What input do you like?");

    // Re-assign variable again, to safe explicit string
    googleLink = "drive.google.com";

    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);

    // Insert variable value as link destination
    a.href = googleLink;

    document.body.appendChild(a);
```

Safe variable is reassigned to unsafe user input, but reassigned again to safe string.
```javascript
    // Declare and initialise variable as explicit string
    let googleLink = "google.com";

    // Re-assign variable to potentially unsafe input
    googleLink = prompt("What input do you like?");

    // Re-assign variable again, to safe explicit string
    googleLink = "drive.google.com";

    // Initialize iframe
    let iframe = document.createElement("iframe");

    // Insert variable value as link destination
    iframe.src = googleLink;

    document.body.appendChild(iframe);
```

Safe variable.
```javascript
    // Declare and initialise variable as explicit string
    let googleLink = "google.dk";

    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);

    // Set link destination as value of safe string
    a.href = googleLink;

    document.body.appendChild(a);
```

Safe variable.
```javascript
    // Declare and initialise variable as explicit string
    let googleLink = "google.dk";

    // Initialize iframe
    let iframe = document.createElement("iframe");

    // Set link destination as value of safe string
    iframe.src = googleLink;

    document.body.appendChild(iframe);
```

Safe variable is used in a template string.
```javascript
    const myLink = "google.com";

    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);

    // Insert template string including variable value as link destination
    a.href = `${myLink}`;

    document.body.appendChild(a);
```

Safe variable is used in a template string.
```javascript
    const myLink = "google.com";

    // Initilize iframe
    let iframe = document.createElement("iframe");

    // Insert template string including variable value as link destination
    iframe.src = `${myLink}`;

    document.body.appendChild(iframe);
```

Variable containing unsafe user input is being escaped.
```javascript
    let userInput = prompt("What input do you like?");

    // Create text link
    let a = document.createElement("a");
    const btn = document.createTextNode("Click here");
    a.appendChild(btn);

    // Assign link destination to an escaped version of the unsafe user input
    a.href = userInput.toLowerCase().replace('javascript:', '/javascript/:/');

    document.body.appendChild(a);
```

Variable containing unsafe user input is being escaped.
```javascript
    let userInput = prompt("What input do you like?");

    // Initialize iframe
    let iframe = document.createElement("iframe");

    // Assign link destination to an escaped version of the unsafe user input
    iframe.src = userInput.toLowerCase().replace('javascript:', '/javascript/:/');

    document.body.appendChild(iframe);
```
