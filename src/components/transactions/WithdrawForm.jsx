import { useState } from "react";
import API from "@/api";

function Withdraw() {
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

      const res = await API.post("/api/transactions/withdraw", {
        amount: amt,
      });

      alert(`Withdrawal successful! New balance: ${res.data.balance}`);
      setAmount("");

    } catch (error) {
      console.error(error);

      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Withdrawal failed";

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        disabled={loading}
      />

      <button onClick={handleWithdraw} disabled={loading}>
        {loading ? "Processing..." : "Withdraw"}
      </button>
    </div>
  );
}

export default Withdraw;