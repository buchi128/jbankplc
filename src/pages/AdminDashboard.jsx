import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Transactions from '../components/transactions/TransactionList';
import API from '@/api';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalBalance: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Issue account form state
  const [form, setForm] = useState({
    userId: '',
    email: '',
    bankName: 'JBank',
    accountType: 'Savings',
    initialDeposit: 0,
    currency: 'NGN',
  });
  const [issuing, setIssuing] = useState(false);
  const [issueMessage, setIssueMessage] = useState(null);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/api/admin/dashboard');
      const data = res.data?.data ?? res.data;

      setSummary({
        totalUsers: data.totalUsers ?? 0,
        totalAccounts: data.totalAccounts ?? 0,
        totalTransactions: data.totalTransactions ?? 0,
        totalBalance: data.totalBalance ?? 0,
      });

      setRecentUsers(Array.isArray(data.recentUsers) ? data.recentUsers : []);
      setRecentTransactions(Array.isArray(data.recentTransactions) ? data.recentTransactions : []);
      setTransfers(Array.isArray(data.transfers) ? data.transfers : []);
      setWithdrawals(Array.isArray(data.withdrawals) ? data.withdrawals : []);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }
       console.log(status)
      setError(err?.response?.data?.message || err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   let mounted = true;
   if (mounted) fetchDashboard();
   return () => { mounted = false; };
  }, [navigate]);

  // Handle form input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Issue bank account handler
  const handleIssueAccount = async e => {
    e.preventDefault();
    setIssueMessage(null);

    // Basic validation: require userId or email
    if (!form.userId.trim() && !form.email.trim()) {
      setIssueMessage({ type: 'error', text: 'Provide either userId or email' });
      return;
    }

    const payload = {
      userId: form.userId?.trim() || undefined,
      email: form.email?.trim() || undefined,
      bankName: form.bankName || undefined,
      accountType: form.accountType || undefined,
      initialDeposit: Number(form.initialDeposit) || 0,
      currency: form.currency || undefined,
    };

    setIssuing(true);
    try {
      const res = await API.post('/register', payload);
      const message = res?.data?.message || 'Bank account issued';

      setIssueMessage({ type: 'success', text: message });

      setForm({
        userId: '',
        email: '',
        bankName: 'JBank',
        accountType: 'Savings',
        initialDeposit: 0,
        currency: 'NGN',
      });

      await fetchDashboard();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to issue account';
      setIssueMessage({ type: 'error', text: msg });
    } finally {
      setIssuing(false);
    }
  };

  if (loading) {
    return <div className="container py-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  return (
    <div className="container py-4">
      <div id='logoutAdmin'>
        <h1 className="mb-4">Admin Dashboard</h1>
        <p><LogoutButton /></p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card text-bg-light h-100">
            <div className="card-body">
              <h6 className="card-title">Total Users</h6>
              <p className="display-6 mb-0">{summary.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card text-bg-light h-100">
            <div className="card-body">
              <h6 className="card-title">Total Accounts</h6>
              <p className="display-6 mb-0">{summary.totalAccounts}</p>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card text-bg-light h-100">
            <div className="card-body">
              <h6 className="card-title">Total Transactions</h6>
              <p className="display-6 mb-0">{summary.totalTransactions}</p>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <strong>Transfers</strong>
            </div>

            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>From Account</th>
                    <th>To Account</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transfers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-3">
                        No transfers found
                      </td>
                    </tr>
                  )}

                  {transfers.map(t => (
                    <tr key={t._id}>
                      <td>{t.fromAccount?.accountNumber}</td>
                      <td>{t.toAccount?.accountNumber}</td>
                      <td>₦{Number(t.amount).toLocaleString()}</td>
                      <td>{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
  <div className="card">
    <div className="card-header">
      <strong>Withdrawals</strong>
    </div>

    <div className="card-body p-0">
      <table className="table mb-0">
        <thead>
          <tr>
            <th>Account</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {withdrawals.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-3">
                No withdrawals found
              </td>
            </tr>
          )}

          {withdrawals.map(w => (
            <tr key={w._id}>
              <td>{w.accountId?.accountNumber}</td>
              <td>₦{Number(w.amount).toLocaleString()}</td>
              <td>{w.status}</td>
              <td>{new Date(w.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

        <div className="col-6 col-md-3">
          <div className="card text-bg-light h-100">
            <div className="card-body">
              <h6 className="card-title">Total Balance</h6>
              <p className="display-6 mb-0">₦{Number(summary.totalBalance).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Bank Account Panel */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Issue Bank Account</strong>
        </div>
        <div className="card-body">
          {issueMessage && (
            <div className={`alert ${issueMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
              {issueMessage.text}
            </div>
          )}

          <form onSubmit={handleIssueAccount}>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <label className="form-label">User ID</label>
                <input name="userId" value={form.userId} onChange={handleChange} className="form-control" placeholder="Mongo userId (optional if email provided)" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="User email (optional if userId provided)" />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Bank Name</label>
                <input name="bankName" value={form.bankName} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Account Type</label>
                <select name="accountType" value={form.accountType} onChange={handleChange} className="form-select">
                  <option> Savings </option>
                  <option> Current </option>
                  <option> Business </option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Currency</label>
                <input name="currency" value={form.currency} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Initial Deposit</label>
                <input name="initialDeposit" type="number" value={form.initialDeposit} onChange={handleChange} className="form-control" min="0" />
              </div>

              <div className="col-12 col-md-6 d-flex align-items-end justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={issuing}>
                  {issuing ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Issue Account'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
 <Transactions />
      <div className="row gy-4">
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <strong>Recent Users</strong>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-3">No recent users</td></tr>
                  )}
                  {recentUsers.map(u => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{new Date(u.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <strong>Recent Transactions</strong>
            </div>
            <div>
              <table className="table mb-0 card-body p-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Account</th>
                    <th>Date</th>
                  </tr>
                </thead>
               
                <tbody>
                  {recentTransactions.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-3">No recent transactions</td></tr>
                  )}
                  {recentTransactions.map(tx => (
                    <tr key={tx._id}>
                      <td>{tx.type}</td>
                      <td>₦{Number(tx.amount).toLocaleString()}</td>
                      <td>{tx.accountId?.accountNumber ?? tx.accountId}</td>
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

