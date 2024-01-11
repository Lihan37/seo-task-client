// Home.jsx
import React, { useState, useEffect } from 'react';
import { FaRegCircle, FaCheckCircle, FaClock, FaArrowAltCircleUp, FaCircleNotch, FaPaperclip } from 'react-icons/fa';
import Modal from './Modal'; 
import axios from 'axios';

const Home = () => {
  const cardTitles = [
    { title: 'Incomplete', icon: <FaRegCircle /> },
    { title: 'Todo', icon: <FaCheckCircle /> },
    { title: 'Doing', icon: <FaClock /> },
    { title: 'UnderReview', icon: <FaArrowAltCircleUp /> },
    { title: 'Completed', icon: <FaCircleNotch /> },
  ];

  const [clientData, setClientData] = useState({});
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientFileCounts, setClientFileCounts] = useState({}); 

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

  const handleInsertClick = (clientId) => {
    setSelectedClientId(clientId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClientId(null);
    setIsModalOpen(false);
  };

  const updateFileCount = (clientId, count) => {
    setClientFileCounts((prevCounts) => ({ ...prevCounts, [clientId]: count }));
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {cardTitles.map((card, index) => (
        <div key={index} className={`p-4 border rounded text-black bg-${card.title.toLowerCase()} hover:bg-${card.title.toLowerCase()}-dark overflow-y-auto min-h-screen`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {card.icon}
              <h2 className="ml-2 text-lg font-bold">{card.title}</h2>
            </div>
            {clientData[card.title.toLowerCase()] && (
              <span className="text-sm text-gray-600">Total: {clientData[card.title.toLowerCase()].length}</span>
            )}
          </div>
          {clientData[card.title.toLowerCase()] && (
            <div className="grid grid-cols-1 gap-2" style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}>
              {clientData[card.title.toLowerCase()].map((client) => (
                <div key={client.id} className="border p-3 rounded">
                  <p>Name: {client.name}</p>
                  <p>Phone: {client.phone}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-600">Insert: </span>
                    <FaPaperclip className="text-blue-500 cursor-pointer ml-1" onClick={() => handleInsertClick(client.id)} />
                    <span className="ml-1">{clientFileCounts[client.id] || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {isModalOpen && selectedClientId && (
        <Modal clientId={selectedClientId} closeModal={closeModal} updateFileCount={updateFileCount} />
      )}
    </div>
  );
};

export default Home;
