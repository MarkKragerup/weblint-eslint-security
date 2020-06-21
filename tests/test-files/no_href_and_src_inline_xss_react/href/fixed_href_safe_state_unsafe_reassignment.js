import React, {useState, useEffect} from 'react';

// Functional ReactJS component
export default function SafeStateUnsafeReassign(){

    // Example script input: javascript:alert('Hacked!');

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
        <a href={(destination).toLowerCase().replace('javascript:', '/javascript/:/')}>Link to user website</a>
    );
}