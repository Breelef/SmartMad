import React, { useState } from "react";
import {RecipeButton} from "../components/find_opskrifter_knap.js";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:8080/login", {
          email: values.email,
          password: values.password,
        });

        // Handle successful login
        if (response.data.success) {
          console.log("User logged in successfully");
          navigate("/dashboard"); // Redirect to dashboard (or other page)
        } else {
          console.error("Login failed", response.data.message);
          alert("Login failed: " + response.data.message);
        }
      } catch (error) {
        console.error("Error during login", error);
        alert("An error occurred during login. Please try again.");
      }
    },
  });

  // Google login success handler
  const handleGoogleLogin = async (response) => {
    try {
      // Send the Google token to the backend for authentication
      const googleResponse = await axios.post("http://localhost:8080/auth/google", {
        token: response.credential,
      });

      if (googleResponse.data.success) {
        console.log("Google login successful");
        navigate("/dashboard");
      } else {
        alert("Google login failed: " + googleResponse.data.message);
      }
    } catch (error) {
      console.error("Error during Google login", error);
      alert("An error occurred during Google login.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-900">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6 text-teal-500">SmartOpskrift</h1>
        <h2 className="text-center text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-md bg-gray-200 text-blue-900 ${
                formik.touched.email && formik.errors.email ? "border-red-500" : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-md bg-gray-200 text-blue-900 ${
                formik.touched.password && formik.errors.password ? "border-red-500" : ""
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit button for traditional login */}
          <button
            type="submit"
            className="w-full py-2 bg-teal-500 text-white rounded-md"
          >
            Login
          </button>
        </form>

        {/* Google login button */}
        <div className="mt-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
};