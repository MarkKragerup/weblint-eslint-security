import React, {useState, useEffect} from 'react';

// Functional ReactJS component
export default function UnsafeValueInBinary(){

    // Example script input: javascript:alert('Hacked!');

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
        <iframe src={(destination).toLowerCase().replace('javascript:', '/javascript/:/')}/>
    );
}