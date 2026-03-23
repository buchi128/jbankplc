import React, { useState } from 'react';
import axios from 'axios';
import API from "@/api"

const API = API.create({ baseURL: '/api' });

function CreateAccount() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateAccount = async () => {
    try {
      const { data } = await API.post('/register', { userId });
      setMessage(`Account created: ${data.account.accountNumber}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error creating account');
    }
  };

  return (
    <div>
      <h3>Create Account</h3>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
      />
      <button onClick={handleCreateAccount}>Generate Account Number</button>
      <p>{message}</p>
    </div>
  );
}

export default CreateAccount;

