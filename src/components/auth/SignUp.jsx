import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import toast from 'react-hot-toast';

function validateInput(fullName, emailId, password, confirmPassword) {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (!/^[A-Za-z\s]+$/.test(fullName.trim())) {
    errors.fullName = "Full name should contain only alphabets and spaces";
  }

  if (!emailId.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
    errors.email = "Email is not valid";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8 || password.length > 20) {
    errors.password = "Password should be between 8 to 20 characters long";
  } else if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
      password
    )
  ) {
    errors.password =
      "Password is not strong enough. It should contain uppercase, lowercase, number and special character";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

const createAccount = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
    console.log(response);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error?.response?.data?.message || "Failed to create account",
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        error:
          "No response from server. Please check your internet connection.",
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const isLoggedIn = useSelector((state) => state.userinfo.isLoggedIn);

  // Clear API error when form values change
  useEffect(() => {
    setApiError("");
  }, [fullName, emailId, password, confirmPassword]);

  // Real-time validation effect
  useEffect(() => {
    const validationErrors = validateInput(
      fullName,
      emailId,
      password,
      confirmPassword
    );
    setErrors(validationErrors);
  }, [fullName, emailId, password, confirmPassword]);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  const isFormValid = () => {
    const validationErrors = validateInput(
      fullName,
      emailId,
      password,
      confirmPassword
    );
    return Object.keys(validationErrors).length === 0 && termsAccepted;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    if (!termsAccepted) {
      setErrors((prev) => ({
        ...prev,
        terms: "You must accept the terms and conditions",
      }));
      toast.error("You must accept the terms and conditions");
      setIsSubmitting(false);
      return;
    }

    try {
      const userData = {
        fullName,
        email: emailId,
        password,
      };

      const result = await createAccount(userData);

      if (result.success) {
        // Show success toast
        toast.success("Account created successfully! Please check your email for verification. 📧");
        
        // Show verification popup instead of immediately navigating
        const message = typeof result.data.message === 'string' 
          ? result.data.message 
          : "User created successfully. Please check your email for verification.";
        setVerificationMessage(message);
        setShowVerificationPopup(true);
        // Don't dispatch login state yet - wait for email verification
        // dispatch(setUserinfo(result.data));
        // dispatch(setIsLoggedIn(true));
        // navigate('/feed');
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : "An error occurred during signup. Please try again.";
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setApiError(errorMsg);
      toast.error(errorMsg);
      console.error("Error creating account:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationPopupClose = () => {
    setShowVerificationPopup(false);
    // Navigate to signin page after closing popup
    navigate("/auth/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1B1E] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Email Verification Popup */}
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full ring-1 ring-white/20 mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              {/* Email Icon */}
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">
                Check Your Email
              </h3>
              <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 px-1">
                {verificationMessage}
              </p>

              <div className="bg-white/5 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-white/60 text-xs sm:text-sm">
                  <strong className="block sm:inline">
                    Didn't receive the email?
                  </strong>
                  <span className="block sm:inline sm:ml-1">
                    Check your spam folder or try signing up again with a
                    different email address.
                  </span>
                </p>
              </div>

              <button
                onClick={handleVerificationPopupClose}
                className="w-full bg-white text-[#1A1B1E] py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 rounded-lg font-semibold hover:bg-white/90 transition text-sm sm:text-base"
              >
                Continue to Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {apiError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full ring-1 ring-white/20 mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">
                Sign Up Failed
              </h3>
              <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 px-1">
                {apiError}
              </p>

              <div className="bg-white/5 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-white/60 text-xs sm:text-sm">
                  <strong className="block sm:inline">
                    What you can try:
                  </strong>
                  <span className="block sm:inline sm:ml-1">
                    Check your internet connection, verify your email format, or try again in a few moments.
                  </span>
                </p>
              </div>

              <button
                onClick={() => setApiError("")}
                className="w-full bg-white text-[#1A1B1E] py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 rounded-lg font-semibold hover:bg-white/90 transition text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-lg">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Join Devtinder
            </h1>
            <p className="text-white/60 text-base sm:text-lg mb-6 sm:mb-8">
              Create your account and start connecting with developers from
              around the world.
            </p>
            <div className="hidden lg:flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Create your developer profile</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Showcase your projects</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Connect with like-minded developers</span>
              </div>
            </div>
          </div>

          {/* Right Content - Sign Up Form */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 ring-1 ring-white/10">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                Create Your Account
              </h2>
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className={`w-full px-4 py-2.5 sm:py-3 bg-white/5 border ${
                        errors.fullName ? "border-red-500" : "border-white/10"
                      } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition`}
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className={`w-full px-4 py-2.5 sm:py-3 bg-white/5 border ${
                        errors.email ? "border-red-500" : "border-white/10"
                      } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition`}
                      placeholder="Enter your email"
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-2.5 sm:py-3 bg-white/5 border ${
                        errors.password ? "border-red-500" : "border-white/10"
                      } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition`}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-4 py-2.5 sm:py-3 bg-white/5 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-white/10"
                      } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition`}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="flex items-start">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        setErrors((prev) => ({ ...prev, terms: "" }));
                        if (e.target.checked) {
                          toast.success("Terms accepted! ✅");
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="terms" className="text-sm text-white/60">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.terms}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition ${
                    isFormValid() && !isSubmitting
                      ? "bg-white text-[#1A1B1E] hover:bg-white/90"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-white/60 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/auth/signin"
                    className="text-white hover:text-white/80 transition"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
