# Disallows unescaped variables of uncertain origin from href and src values, due to the concern that they might originate from user input.

## Rule details
There following test files serves as a demonstration of all the different situations the rule is considering.
<br/><br/>
**The following patterns are considered warnings**:
<br/><br/>
The safe state is reassigned to unsafe user input. The state is used as the link of the a tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function SafeStateUnsafeReassign(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState("google.dk");

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

      }, []);

      return(
          <a href={destination}>Link to user website</a>
      );
  }
```

The safe state is reassigned to unsafe user input. The state is used as the src of the iframe tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function SafeStateUnsafeReassign(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState("google.dk");

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

      }, []);

      return(
          <iframe src={destination}>Link to user website</a>
      );
  }
```

The state has the value of null before being reassigned to unsafe user input. The state is used as the link of the a tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function StateIsUnsafeUserInput(){

      // Initialise the state and setter, to value null
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

      }, []);

      return(
          <a href={destination}>Link to user website</a>
      );
  }
```

The state has the value of null before being reassigned to unsafe user input. The state is used as the src of the iframe tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function StateIsUnsafeUserInput(){

      // Initialise the state and setter, to value null
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

      }, []);

      return(
          <iframe src={destination}>Link to user website</a>
      );
  }
```

The state has the value of null before being reassigned to unsafe user input, but immidiately after is reassigned to a safe string. The state is used as the link of the a tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function SafeValueUnsafeReassign(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Put safe state
          setDestination('google.com');

          // Overwrite the state, with a unsafe string
          setDestination(userInput);

      }, []);

      return(
          <a href={destination}>Link to user website</a>
      );
  }
```

The state has the value of null before being reassigned to unsafe user input, but immidiately after is reassigned to a safe string. The state is used as the src of the iframe tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function SafeValueUnsafeReassign(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Put safe state
          setDestination('google.com');

          // Overwrite the state, with a unsafe string
          setDestination(userInput);

      }, []);

      return(
          <iframe src={destination}>Link to user website</a>
      );
  }
```

The safe state is reassigned to unsafe user input. The state is used in a template string in the link of the a tag. 
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function UnsafeValueInTemplateString(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState("google.dk");

      const hrefAddition = '/contact/'

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

      }, []);

      return(
          <a href={`${destination}${hrefAddition}`}>Link to user website</a>
      );
  }
```

The safe state is reassigned to unsafe user input. The state is used in a template string in the src of the iframe tag. 
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function UnsafeValueInTemplateString(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState("google.dk");

      const hrefAddition = '/contact/'

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

      }, []);

      return(
          <iframe src={`${destination}${hrefAddition}`}>Link to user website</a>
      );
  }
```

The safe state with the value of null is reassigned to unsafe user input, but immidiately after contatenated with a string. The state is used as the link of the a tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function UnsafeValueInBinary(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput + '/contact/');

      }, []);

      return(
          <a href={destination}>Link to user website</a>
      );
  }
```

The safe state with the value of null is reassigned to unsafe user input, but immidiately after contatenated with a string. The state is used as the src of the iframe tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function UnsafeValueInBinary(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput + '/contact/');

      }, []);

      return(
          <iframe src={destination}>Link to user website</a>
      );
  }
```

**The following patterns are NOT considered warnings**:
<br/><br/>
The safe state with the value of null is reassigned to a safe string concatenation. The state is used in the link of the a tag. 
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function SafeValuesInBinary(){

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let link = 'google.com' + '/contact/'

          // Hold it in state
          setDestination(link);

      }, []);

      return(
          <a href={destination}>Link to user website</a>
      );
  }
```

The safe state with the value of null is reassigned to a safe string concatenation. The state is used in the src of the iframe tag. 
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function SafeValuesInBinary(){

      // Example script input: javascript:alert('Hacked!');

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let link = 'google.com' + '/contact/'

          // Hold it in state
          setDestination(link);

      }, []);

      return(
          <iframe src={destination}>Link to user website</a>
      );
  }
```

The safe state is used in combination with the safe variable in a template string, in the link of the a tag.
```javascript
  import React, {useState, } from 'react';

  // Functional ReactJS component
  export default function SafeValuesInTemplateString(){

      // Example script input: javascript:alert('Hacked!');

      // Initialise the state and setter, to an explicit string
      const [destination, ] = useState("google.dk");

      const hrefAddition = '/contact/'

      return(
          <a href={`${destination}${hrefAddition}`}>Link to user website</a>
      );
  }
```

The safe state is used in combination with the safe variable in a template string, in the src of the iframe tag.
```javascript
  import React, {useState, } from 'react';

  // Functional ReactJS component
  export default function SafeValuesInTemplateString(){

      // Example script input: javascript:alert('Hacked!');

      // Initialise the state and setter, to an explicit string
      const [destination, ] = useState("google.dk");

      const hrefAddition = '/contact/'

      return(
          <iframe src={`${destination}${hrefAddition}`}>Link to user website</a>
      );
  }
```

The safe state with the value of null is reassigned to the unsafe user input but immidiately reassigned to a safe string. The state is used in the link of the a tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function SafeValueReassigned(){

      // Example script input: javascript:alert('Hacked!');

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

          // Overwrite the state, with a safe string
          setDestination('google.com');

      }, []);

      return(
          <a href={destination}>Link to user website</a>
      );
  }
```

The safe state with the value of null is reassigned to the unsafe user input but immidiately reassigned to a safe string. The state is used in the src of the iframe tag.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function SafeValueReassigned(){

      // Example script input: javascript:alert('Hacked!');

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

          // Overwrite the state, with a safe string
          setDestination('google.com');

      }, []);

      return(
          <iframe src={destination}>Link to user website</a>
      );
  }
```

The safe state with the value of null is reassigned to unsafe user input. The state is used as the link of the a tag and properly escaped.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function UnsafeValueProperEscaped(){

      // Example script input: javascript:alert('Hacked!');

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

      }, []);

      return(
          <a href={destination.toLowerCase().replace('javascript:', '/javascript/:/')}>Link to user website</a>
      );
  }
```

The safe state with the value of null is reassigned to unsafe user input. The state is used as the src of the iframe tag and properly escaped.
```javascript
  import React, {useState, useEffect} from 'react';

  // Functional ReactJS component
  export default function UnsafeValueProperEscaped(){

      // Example script input: javascript:alert('Hacked!');

      // Initialise the state and setter, to an explicit string
      const [destination, setDestination] = useState(null);

      // Invoked when component is rendered
      useEffect(() => {

          // Take user input
          let userInput = window.prompt('What input do you like?');

          // Hold it in state
          setDestination(userInput);

      }, []);

      return(
          <iframe src={destination.toLowerCase().replace('javascript:', '/javascript/:/')}>Link to user website</a>
      );
  }
```

