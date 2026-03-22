import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Deposit from "../components/transactions/DepositForm";
import Withdraw from "../components/transactions/WithdrawForm";
import TransferForm from "../components/transactions/TransferForm";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default function UserDashboard() {

  const navigate = useNavigate();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
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

      console.log("API RESPONSE:", res.data);

      const payload = res.data || {};

      setAccounts(Array.isArray(payload.accounts) ? payload.accounts : []);
      setTransactions(Array.isArray(payload.transactions) ? payload.transactions : []);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to load dashboard");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [navigate]);
  useEffect(() => {
    fetchUserAccounts();

    return () => (mountedRef.current = false);

  }, [fetchUserAccounts]);

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });

  };

  return (

    <div className="container-fluid">
      <div className="row">

        {/* SIDEBAR */}

        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">

          <div className="position-sticky pt-3 text-white">

            <h5 className="text-center mb-4">Profile</h5>

            <ul className="nav flex-column">

              <li className="nav-item">
                <Link className="nav-link text-white" to="#">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="#accounts">
                  Accounts
                </Link>
                {accounts.map((acc) => (
                  <div key={acc._id} className="card p-3 mb-2 text-light">
                    <h6>Account Number</h6>
                    <p>{acc.accountNumber}</p>

                    <h6 style={{ color: "white" }}>Balance</h6>
                    <p>₦{Number(acc.balance).toLocaleString()}</p>
                  </div>
                ))}
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="#transactions">
                  Transactions
                </Link>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{tx.type}</td>
                    <td>₦{Number(tx.amount).toLocaleString()}</td>

                    <td>
                      {tx.type === "transfer"
                        ? `To: ${tx.targetAccountId?.accountNumber}`
                        : tx.accountId?.accountNumber}
                    </td>

                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="#transfer">
                  Transfer
                </Link>
              </li>

              <li className="nav-item mt-4">
                <button
                  className="btn btn-outline-light w-100"
                  onClick={logout} id="logoutbtn"
                >
                  Logout
                </button>
              </li>

            </ul>

          </div>

        </nav>

        {/* MAIN*/}

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">

          {/* TOPBAR */}

          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">


            <button
              className="btn btn-primary"
              onClick={fetchUserAccounts}
            >
              Refresh
            </button>

          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {/* ACCOUNTS */}

          <div id="accounts" className="mb-5">


            <div className="row">

              {/* {accounts.map((acc) => ( */}
              {Array.isArray(accounts) && accounts.map((acc) => (
                <div className="col-12 col-md-6 col-lg-4" key={acc._id}>

                  <div className="card shadow-sm mb-3">

                    <div className="card-body">

                      <h6 className="text-muted">
                        Account Number
                      </h6>

                      <h5>{acc.accountNumber}</h5>

                      <p className="mt-2">
                        Balance
                      </p>

                      <h4 className="text-success">
                        ₦{Number(acc.balance).toLocaleString()}
                      </h4>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* TRANSFER */}

          <div id="transfer" className="mb-5">

            <div>
              <TransferForm accountId={accounts[0]?._id} refresh={fetchUserAccounts} />
            </div>

          </div>

          {/* DEPOSIT */}

          <div className="mb-5">

            <Deposit onSuccess={fetchUserAccounts} />

          </div>

          {/* WITHDRAW */}

          <div className="mb-5">

            <Withdraw onSuccess={fetchUserAccounts} />

          </div>

          {/* TRANSACTIONS */}

          <h5>Transaction History</h5>
          <table className="table table-responsive bg-white p-3 shadow-sm rounded" id="transactions">

            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Account</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {
                Array.isArray(transactions) && transactions.map((t) => (
                  <tr key={t._id}>

                    <td>{t.type}</td>

                    <td>₦{Number(t.amount).toLocaleString()}</td>

                    <td>
                      {t.type === "transfer"
                        ? `To: ${t.targetAccountId?.accountNumber}`
                        : t.accountId?.accountNumber || "-"}
                    </td>

                    <td>{new Date(t.createdAt).toLocaleString()}</td>

                  </tr>

                ))
              }

            </tbody>

          </table>

          <Outlet />

        </main>

      </div>
    </div>

  );
}