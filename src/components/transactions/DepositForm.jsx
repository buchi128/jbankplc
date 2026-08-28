import { useState } from "react";
import API from "@/api";

function Deposit({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    const numericAmount = Number(amount);
    if (!amount || numericAmount <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    setLoading(true);
    try {
     
      const profile = await API.get('/accounts/me');
      const accountId = profile.data?.data?._id;

      if (!accountId) {
        alert("No active bank account profile reference located for this user.");
        setLoading(false);
        return;
      }

     
      const res = await API.post("/transactions/deposit", {
        accountId,
        type: 'deposit',
        amount: numericAmount,
        description: 'Cash Deposit Funds'
      });

     
      alert(res.data?.message || "Deposit successful!");
      setAmount("");


      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Deposit failed";
      alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 shadow-sm border-0">
      <h5 className="mb-3 small text-uppercase text-muted">Deposit Asset Funds</h5>
      <div className="d-flex gap-2">
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={loading}
        />
        <button 
          className="btn btn-success px-4" 
          onClick={handleDeposit}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </div>
    </div>
  );
}

export default Deposit;
