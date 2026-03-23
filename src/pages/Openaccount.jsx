import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import API from "./api";

const Openaccount = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    validationSchema: yup.object({
      firstName: yup.string().required("First Name is required"),
      lastName: yup.string().required("Last Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup.string().min(6).required("Password is required"),
    }),

onSubmit: async (values, { resetForm }) => {
  try {
    const res = await API.post(
      "/api/auth/register",
      {
        fullName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
      }
    );

    const token = res.data.token;

    localStorage.setItem("token", token);

    alert("Account Created Successfully");

    navigate("/dashboard");

    resetForm();

  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error.message ||
      "Registration failed";

    alert(msg);
  }
},
  });

  return (
    <>
      <div id="adminForm">
        <form className="row g-3 card p-3" onSubmit={formik.handleSubmit}>
          <h2 style={{ textAlign: "center" }}>Open an Account</h2>

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.firstName}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.lastName}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-2"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <button type="submit" className="btn btn-dark">
            Create Account
          </button>

        </form>
      </div>
    </>
  );
};

export default Openaccount;