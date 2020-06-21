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