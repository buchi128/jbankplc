import { useEffect, useState } from "react";
import API from "@/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/api/transactions/history");
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: "20px" }} id="table">
      <h2 style={{ color: "white" }}>Transaction History</h2>

      {loading && <p style={{ color: "white" }}>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && transactions.length > 0 ? (
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
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{t.type}</td>
                <td>₦{Number(t.amount).toLocaleString()}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p style={{ color: "white" }}>No transactions available</p>
      )}
    </div>
  );
}

export default Transactions;