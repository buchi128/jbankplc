import { useEffect, useState } from "react";
import API from "@/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        
        const res = await API.get("/transactions/history");
        console.log("HISTORY LEDGER API RESPONSE:", res.data);
        
       
        const ledgerArray = res.data?.data || res.data || [];
        setTransactions(Array.isArray(ledgerArray) ? ledgerArray : []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions history list");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: "20px" }} id="table">
      <h2 style={{ color: "white" }}>Transaction History</h2>

      {loading && <p style={{ color: "white" }}>Loading history logs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && transactions.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
          <thead>
            <tr style={{ backgroundColor: "#333", color: "white" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "10px", textTransform: "uppercase" }}>{t.type}</td>
                <td style={{ padding: "10px", fontWeight: "bold" }}>₦{Number(t.amount || 0).toLocaleString()}</td>
                <td style={{ padding: "10px" }}>{new Date(t.createdAt).toLocaleString()}</td>
                <td style={{ padding: "10px" }}>
                  <span className={`badge ${t.status === 'completed' || t.status === 'Completed' ? 'bg-success' : 'bg-warning'} p-1 text-uppercase`}>
                    {t.status || 'Completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p style={{ color: "white" }}>No transactions recorded on this profile yet.</p>
      )}
    </div>
  );
}

export default Transactions;
