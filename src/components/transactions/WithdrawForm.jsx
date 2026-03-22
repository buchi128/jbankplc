import { useState } from "react";
import axios from "axios";

function Withdraw() {
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/transactions/withdraw",
        { amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Withdrawal successful! New balance: ${res.data.balance}`);
      setAmount(""); 
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data || "Withdrawal failed");
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
}

export default Withdraw;