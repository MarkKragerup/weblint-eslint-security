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
        <a href={destination}>Link to user website</a>
    );
}