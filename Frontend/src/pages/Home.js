import React, { useEffect, useState } from 'react';
import { fetchTest } from '../services/api';

const Home = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTest()
            .then((response) => setMessage(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>AWGEI Frontend</h1>
            <p>{message}</p>
        </div>
    );
};

export default Home;

