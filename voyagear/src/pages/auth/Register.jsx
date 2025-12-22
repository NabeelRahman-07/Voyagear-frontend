import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [error, setError] = useState("");

  const registration = yup.object({
    name: yup
      .string()
      .min(3, "Name must contain at least 3 characters")
      .required("Name is required"),

    email: yup
      .string()
      .email("Invalid E-mail")
      .required("E-mail is required"),

    password: yup
      .string()
      .min(8, "Password must contain at least 8 characters")
      .required("Password is required"),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-secondary/20">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-primary">
            Join Voyagear
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start exploring
          </p>
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={registration}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              await register(values.name, values.email, values.password);
              resetForm();
              navigate("/", { replace: true });
            } catch (err) {
              toast.error("User already exist!")
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {(formik) => (
            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
              <div className="space-y-5">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...formik.getFieldProps("name")}
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.name && formik.errors.name
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-300 focus:ring-secondary focus:border-secondary'
                      }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-500 animate-pulse">{formik.errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...formik.getFieldProps("email")}
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.email && formik.errors.email
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-300 focus:ring-secondary focus:border-secondary'
                      }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-500 animate-pulse">{formik.errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    {...formik.getFieldProps("password")}
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.password && formik.errors.password
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-300 focus:ring-secondary focus:border-secondary'
                      }`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-red-500 animate-pulse">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    {...formik.getFieldProps("confirmPassword")}
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-gray-300 focus:ring-secondary focus:border-secondary'
                      }`}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500 animate-pulse">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                {/* Error Message
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )} */}
              </div>

              {/* Password Requirements
              <div className="bg-primary/5 p-4 rounded-lg border border-secondary/10">
                <p className="text-sm font-medium text-primary mb-2">Password must contain:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${formik.values.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(formik.values.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(formik.values.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    One lowercase letter
                  </li>
                </ul>
              </div> */}

              {/* Terms and Conditions
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{" "}
                  <Link to="/terms" className="font-medium text-secondary hover:text-accent">
                    Terms & Conditions
                  </Link>
                </label>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${formik.isSubmitting
                  ? 'bg-secondary/70 cursor-not-allowed'
                  : 'bg-secondary hover:bg-accent focus:ring-secondary transform hover:scale-[1.02]'
                  }`}
              >
                {formik.isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Account
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-secondary hover:text-accent transition-colors hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;