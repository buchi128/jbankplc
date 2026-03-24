import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_SEED_SECRET
import API from "@/api"

//  axios.create({
//   baseURL: "/api",
// });
//const API =
export default function SeedAdminForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    seed: "",
    email: "",
    password: "",
    firstName: "Admin",
    lastName: "User",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.seed || !form.email || !form.password) {
      setMessage({
        type: "error",
        text: "Seed, email and password are required",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/api/auth/seed-admin", {
        seed: form.seed,
        email: form.email,
        password: form.password,
        fullName: `${form.firstName} ${form.lastName}`,
      });

      setMessage({
        type: "success",
        text: res.data?.message || "Admin created",
      });

      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
       navigate("/admin/dashboard", { replace: true });
        return;
      }
      navigate("/login", { replace: true });

    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card p-3" id="adminForm">
        <h5 style={{ textAlign: "center" }}>Admin Registration Form</h5>

        {message && (
          <div
            className={`alert ${message.type === "success"
              ? "alert-success"
              : "alert-danger"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="seed"
            placeholder="Seed Key"
            value={form.seed}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
