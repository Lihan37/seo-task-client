import React, { useState, useEffect } from 'react';
import { FaRegCircle, FaCheckCircle, FaClock, FaArrowAltCircleUp, FaCircleNotch } from 'react-icons/fa';

const Home = () => {
    const cardTitles = [
        { title: 'Incomplete', icon: <FaRegCircle /> },
        { title: 'Todo', icon: <FaCheckCircle /> },
        { title: 'Doing', icon: <FaClock /> },
        { title: 'UnderReview', icon: <FaArrowAltCircleUp /> },
        { title: 'Completed', icon: <FaCircleNotch /> },
    ];

    const [clientData, setClientData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/info.json');
                const data = await response.json();

                const lowercaseData = {};
                Object.keys(data).forEach((title) => {
                    lowercaseData[title.toLowerCase()] = data[title];
                });

                console.log('Fetched data:', lowercaseData);

                setClientData(lowercaseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-5 gap-4">
            {cardTitles.map((card, index) => (
                <div key={index} className={`p-4 border rounded text-black bg-${card.title.toLowerCase()} hover:bg-${card.title.toLowerCase()}-dark overflow-y-auto min-h-screen`}>
                    <div className="flex items-center mb-2">
                        {card.icon}
                        <h2 className="ml-2 text-lg font-bold">{card.title}</h2>
                    </div>
                    {clientData[card.title.toLowerCase()] && (
                        <div className="grid grid-cols-1 gap-2" style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}>
                            {clientData[card.title.toLowerCase()].map((client) => (
                                <div key={client.id} className="border p-3 rounded">
                                    <p>Name: {client.name}</p>
                                    <p>Email: {client.email}</p>
                                    <p>Phone: {client.phone}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Home;
