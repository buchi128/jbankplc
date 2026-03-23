import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(
          "/api/transactions/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: "20px" }} id="table">
      <h2 style={{ color: "white" }}>Transaction History</h2>

      {transactions.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td>{t.type}</td>
                <td>${t.amount}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: "white" }}>No transactions available</p>
      )}
    </div>
  );
}

export default Transactions;