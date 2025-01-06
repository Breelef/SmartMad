import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { GoogleLoginComponent } from "../components/googleLogin.js";
import { RecipeButton } from "../components/find_opskrifter_knap.js";

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
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();
        console.log(data);

        // Handle successful login
        if (data.accessToken) {
          console.log("User logged in successfully");
          localStorage.setItem("accessToken", data.accessToken);
          navigate("/udfyld-til-opskrift"); // Redirect to dashboard (or other page)
        } else {
          console.error("Login failed", data.message);
          alert("Login failed: " + data.message);
        }
      } catch (error) {
        console.error("Error during login", error);
      }
    },
  });
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
          <RecipeButton type="submit">Login</RecipeButton>
        </form>

        {/* Google login button */}
        <div className="mt-4">
          <GoogleLoginComponent />
        </div>
      </div>
    </div>
  );
};