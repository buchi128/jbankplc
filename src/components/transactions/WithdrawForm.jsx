import { useState } from "react";
import API from "@/api";

function Withdraw({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (loading) return;

    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      return alert("Enter a valid amount greater than 0");
    }

    try {
      setLoading(true);

     
      const profile = await API.get('/accounts/me');
      const accountId = profile.data?.data?._id;

      if (!accountId) {
        alert("No active bank account profile reference located for this user profile.");
        return;
      }

      
      const res = await API.post("/transactions/withdraw", {
        accountId,
        type: 'withdrawal',
        amount: amt,
        description: 'Cash Withdrawal Funds'
      });

      
      const updatedBalance = res.data?.data?.accountId?.balance || "Updated";
      alert(`Withdrawal successful! Operation completed.`);
      setAmount("");

  
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Withdrawal failed";
      
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 shadow-sm border-0">
      <h5 className="mb-3 small text-uppercase text-muted"></h5>
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
          className="btn btn-danger px-4" 
          onClick={handleWithdraw} 
          disabled={loading}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
}

export default Withdraw;
