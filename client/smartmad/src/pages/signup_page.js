import React from "react";
import { RecipeButton } from "../components/find_opskrifter_knap.js";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {GoogleSignupComponent} from "../components/googleLogin.js";  // Import the GoogleLogin component

export const SignupPage = () => {
    const navigate = useNavigate();

    // Form validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required("Navn er påkrævet."),
        email: Yup.string()
            .email("Email er ugyldig.")
            .required("Email er påkrævet."),
        password: Yup.string()
            .min(6, "Kodeord skal være mindst 6 tegn.")
            .required("Kodeord er påkrævet."),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch("http://localhost:8080/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Signup failed:", errorData);
                    alert(`Signup failed: ${errorData.message || "Unknown error"}`);
                    return;
                }
                console.log("User signed up successfully");
                navigate("/login");
            } catch (e) {
                console.error("Error during signup:", e);
                alert("An error occurred during signup. Please try again.");
            }
        },
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-900">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h1 className="text-center text-3xl font-bold mb-6 text-teal-500">SmartOpskrift</h1>
                <h2 className="text-center text-xl font-semibold mb-4">Signup</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-blue-900 font-semibold mb-1">Navn</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Indtast dit navn"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded-md bg-gray-200 text-blue-900 ${
                                formik.touched.name && formik.errors.name ? "border-red-500" : ""
                            }`}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-red-500 text-sm">{formik.errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-blue-900 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Indtast din email"
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
                    <div>
                        <label className="block text-blue-900 font-semibold mb-1">Kodeord</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Indtast din kodeord"
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
                    <RecipeButton type="submit">Signup</RecipeButton>
                </form>

                {/* Google login button */}
                <div className="mt-4">
                    <GoogleSignupComponent />
                </div>
            </div>
        </div>
    );
};
