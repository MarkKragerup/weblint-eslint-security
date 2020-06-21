import React, {useState, useEffect} from 'react';

// Functional ReactJS component
export default function SafeValueUnsafeReassign(){

    // Example script input: javascript:alert('Hacked!');

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
        <iframe src={(destination).toLowerCase().replace('javascript:', '/javascript/:/')}/>
    );
}