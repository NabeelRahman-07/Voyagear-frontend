import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import * as yup from 'yup'
import { Formik } from 'formik';
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const signin = yup.object({
        email: yup.string()
            .email("Invalid E-mail address")
            .required("E-mail is required"),
        password: yup.string()
            .min(8, "Password must contain at least 8 characters")
            .required("Password is required")
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-secondary/20">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-primary">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your Voyagear account
                    </p>
                </div>

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={signin}
                    onSubmit={async (values, { resetForm, setSubmitting }) => {
                        try {
                            await login(values.email, values.password);  
                            resetForm();
                            navigate("/", { replace: true });
                        } catch (err) {
                            resetForm();
                            toast.error(err.message)
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {(formik) => (
                        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                            <div className="space-y-5">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:z-10 transition-all duration-200 ${formik.touched.email && formik.errors.email
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
                                    <div className="flex items-center justify-between mb-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-primary">
                                            Password
                                        </label>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:z-10 transition-all duration-200 ${formik.touched.password && formik.errors.password
                                            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                                            : 'border-gray-300 focus:ring-secondary focus:border-secondary'
                                            }`}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="mt-1 text-sm text-red-500 animate-pulse">{formik.errors.password}</p>
                                    )}
                                </div>
                            </div>

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
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Sign in
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

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500"></span>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600">
                                    New here?{' '}
                                    <Link
                                        to="/register"
                                        className="font-medium text-secondary hover:text-accent transition-colors hover:underline"
                                    >
                                        Create an account
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

export default Login;