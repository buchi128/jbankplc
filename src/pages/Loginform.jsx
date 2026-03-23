import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "@/api"

const Loginform = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
      password: yup
        .string()
        .required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await API.post(
          "/api/auth/login",
          values
        );
        console.log('login response', res);
        console.log('res.data', res.data);

        const { user, token } = res.data;

        if (!token || !user) {
          throw new Error("Invalid server response");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("role", user.role);
        alert("Login Successful");
        console.log("User Role:", user.role);
        
        if (user.role.toLowerCase() === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        resetForm();
      } catch (err) {
        console.error("Login Error:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Login failed");
      }
    }
  });

  return (
    <div id="adminForm">
      <form className="row g-3 card p-3" id="regform" onSubmit={formik.handleSubmit}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
          <label className="form-label">Email</label>

          <input
            type="email"
            className="form-control mb-2"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
          />

          {formik.touched.email && formik.errors.email && (
            <small className="text-danger">{formik.errors.email}</small>
          )}

      
          <label className="form-label">Password</label>

          <input
            type="password"
            className="form-control mb-2"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
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

export default Loginform;