import React, {useState, useEffect} from 'react';

// Functional ReactJS component
export default function StateIsUnsafeUserInput(){

    // Example script input: javascript:alert('Hacked!');

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
        <a href={(destination).toLowerCase().replace('javascript:', '/javascript/:/')}>Link to user website</a>
    );
}