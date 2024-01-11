// Modal.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaPaperclip } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Modal = ({ clientId, closeModal, updateFileCount }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileCount, setFileCount] = useState(0);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/attachments/${clientId}`);
      setUploadedFiles(response.data);
      setFileCount(response.data.length);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, [clientId]);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      Swal.fire('Error', 'Please select a file before uploading.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`http://localhost:5000/upload/${clientId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Swal.fire('Success', 'File added successfully!', 'success');
        fetchUploadedFiles();
        closeModal();
        updateFileCount(clientId, fileCount + 1); // Update file count for the specific client ID
      } else {
        Swal.fire('Error', 'Failed to upload file. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire('Error', 'Failed to upload file. Please try again.', 'error');
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Upload File for Client ID: {clientId}</h2>
      <input type="file" onChange={handleFileChange} />
      <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={handleFileUpload}>
        Upload File
      </button>
      <button className="ml-2 mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded" onClick={closeModal}>
        Close Modal
      </button>

      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Uploaded Files ({fileCount}):</h3>
        <ul>
          {uploadedFiles.map((file) => (
            <li key={file._id}>{file.originalname}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
