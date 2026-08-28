import React, { useState } from 'react';
import API from "@/api";

function CreateAccount() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateAccount = async () => {
    if (!userId.trim()) {
      setMessage("Please enter a valid User ID.");
      return;
    }
    
    try {
      setMessage("Generating account number...");
      
      
      const { data } = await API.post('/accounts/create', { userId: userId.trim() });
      
      const acctNumber = data.account?.accountNumber || data.accountNumber || "N/A";
      setMessage(`Account created successfully! Account Number: ${acctNumber}`);
    } catch (err) {
      console.error("Account Generation Error:", err);
      setMessage(err.response?.data?.message || err.response?.data?.error || 'Error creating account');
    }
  };

  return (
    <div>
      <h3>Create Account</h3>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
        style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <button onClick={handleCreateAccount} style={{ padding: "8px 12px", cursor: "pointer" }}>
        Generate Account Number
      </button>
      <p style={{ marginTop: "12px", fontWeight: "bold" }}>{message}</p>
    </div>
  );
}

export default CreateAccount;
