import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "@/api"

const AdminLogin = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: yup.object({
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),

      password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await API.post(
          "/api/auth/login",
          values
        );

        const user = res.data.user;
        const token = res.data.token;
       
        if (user.role !== "admin") {
          return alert("Access denied: Admins only");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        navigate("/admin/dashboard", { replace: true });

      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.message || err.message || "Login failed");
      }
    },
  });

  return (
    <div id="adminForm">
      <form className="row g-3 card p-3" id="regform" onSubmit={formik.handleSubmit}>
        <h2 style={{ textAlign: "center" }}>Admin Login</h2>


        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-2"
          name="email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.email && formik.errors.email && (
          <small className="text-danger">{formik.errors.email}</small>
        )}
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control mb-2"
          name="password"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password && (
          <small className="text-danger">{formik.errors.password}</small>
        )}

        <button type="submit" className="btn btn-dark">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;