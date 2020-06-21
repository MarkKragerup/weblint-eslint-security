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