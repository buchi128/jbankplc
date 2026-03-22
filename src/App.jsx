import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Loginform from "./pages/LoginForm";
import AdminLogin from "./pages/AdminLogin"
import Openaccount from "./pages/Openaccount";
import RegisterAdmin from "./pages/RegisterAdmin"
import PageNotFound from "./pages/PageNotFound";
import LogoutButton from "./pages/LogoutButton";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home"; // new landing page
import About from "./components/About";
import ImportantLinks from "./components/ImportantLinks";
import Resources from "./components/Resources";
import Transactions from "./components/transactions/TransactionList";

let token = localStorage.token;

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/importantlinks" element={<ImportantLinks />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/register" element={<Openaccount />} />
        <Route path="/admin/seed-admin" element={<RegisterAdmin />} />
        <Route path="/login" element={<Loginform />} />
        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/admin/login" element={<AdminLogin />} /> {/* create this */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard" element={token ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
