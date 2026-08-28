import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Deposit from "../components/transactions/DepositForm";
import Withdraw from "../components/transactions/WithdrawForm";
import TransferForm from "../components/transactions/TransferForm";
import API from "@/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(false);
 
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const fetchUserAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      
      const res = await API.get("/accounts/me");
      console.log("DASHBOARD LIVE RECOVERY RESPONSE:", res.data);

      const accountData = res.data?.data || null;

      if (accountData) {
        setAccount(accountData);

        setTransactions(Array.isArray(accountData.transactions) ? accountData.transactions : []);
      } else {
        setAccount(null);
      }
    } catch (err) {
      console.error("Dashboard hydration critical failure:", err.response?.data || err.message);
      setError("Failed to load dashboard metrics");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserAccounts();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchUserAccounts]);

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (loading && !account) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        
        {/* SIDEBAR NAVIGATION CARD PANELS */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse min-vh-100">
          <div className="position-sticky pt-3 text-white">
            <h5 className="text-center mb-4">Profile</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link className="nav-link text-white activefw-bold" to="#">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Link>
              </li>

              <li className="nav-item mb-3 px-3">
                <span className="text-muted small text-uppercase">Account Info</span>
                {account ? (
                  <div className="card text-bg-secondary p-2 mt-1 mb-2 border-0 shadow-sm text-light">
                    <small className="opacity-75">Account Number</small>
                    <strong className="fs-6">{account.accountNumber}</strong>
                    <small className="opacity-75 mt-2">Active Balance</small>
                    <strong className="fs-5 text-warning">₦{Number(account.balance || 0).toLocaleString()}</strong>
                  </div>
                ) : (
                  <p className="small text-warning mt-1">No account linked</p>
                )}
              </li>

              <li className="nav-item px-3 mt-4">
                <button className="btn btn-outline-light w-100 btn-sm" onClick={logout} id="logoutbtn">
                  Logout Security Session
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* MAIN BODY DASHBOARD METRICS HOOKS */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h2 className="h3">Welcome to JBank Dashboard</h2>
            <button className="btn btn-dark btn-sm shadow-sm" onClick={fetchUserAccounts}>
              Refresh Ledgers
            </button>
          </div>

          {error && <div className="alert alert-danger shadow-sm">{error}</div>}

          {/* MAIN BANKING BALANCE RENDER CARD */}
          <div id="accounts" className="mb-4">
            <div className="row">
              {account ? (
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0 bg-white">
                    <div className="card-body p-4">
                      <h6 className="text-uppercase text-muted small fw-bold mb-1">Account Number</h6>
                      <h4 className="fw-bold tracking-wide text-dark mb-3">{account.accountNumber}</h4>
                      <h6 className="text-uppercase text-muted small fw-bold mb-1">Available Ledger Balance</h6>
                      <h3 className="text-success fw-bold mb-0">
                        ₦{Number(account.balance || 0).toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-12">
                  <div className="alert alert-warning shadow-sm">
                    No active bank account generated. Reach out to the admin panel to issue a bank account string.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COMPONENT TRANSACTION ENGINE FORM INPUTS */}
          <div className="row g-4 mb-5">
            <div id="transfer" className="col-12 col-lg-4">
              <div className="card shadow-sm border-0 h-100 p-3 bg-white">
                <h5 className="fw-bold mb-3 small text-uppercase text-muted">Money Transfer</h5>
                <TransferForm accountId={account?._id} refresh={fetchUserAccounts} />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100 p-3 bg-white">
                <h5 className="fw-bold mb-3 small text-uppercase text-muted">Deposit Asset Funds</h5>
                <Deposit onSuccess={fetchUserAccounts} />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100 p-3 bg-white">
                <h5 className="fw-bold mb-3 small text-uppercase text-muted">Withdraw Funds Asset</h5>
                <Withdraw onSuccess={fetchUserAccounts} />
              </div>
            </div>
          </div>

          {/* TRANSACTION DATA GENERAL TIMELINE */}
          <h5 className="fw-bold mb-3 text-secondary text-uppercase small">Transaction History Log</h5>
          <div className="table-responsive bg-white shadow-sm rounded-3 border p-2 mb-4">
            <table className="table table-hover align-middle mb-0" id="transactions">
              <thead className="table-light text-secondary">
                <tr>
                  <th>Operation Type</th>
                  <th>Execution Amount</th>
                  <th>Target Destination</th>
                  <th>Timestamp Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted small">
                      No matching historical transaction activities found on this profile ledger ledger.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <span className={`badge ${t.type === 'deposit' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} p-2 text-uppercase`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="fw-bold">₦{Number(t.amount || 0).toLocaleString()}</td>
                      <td className="small text-muted">
                        {t.type === "transfer"
                          ? `To: ${t.targetAccountId?.accountNumber || "External Vendor"}`
                          : account?.accountNumber || "-"}
                      </td>
                      <td className="small text-muted">{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
