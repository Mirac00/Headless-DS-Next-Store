'use client';

// Import React hooks
import { useState } from "react";
// Import Next.js useRouter for navigation
import { useRouter } from "next/navigation";
// Import API functions
import { registerStoreUser, loginUser, getLoggedInUserData } from "@/services/api";
// Import toast for notifications
import { toast } from "react-toastify";
// Import context hook
import { myStoreHook } from "@/context/MyStoreContext";
// Import types
import { User } from "@/types";

export default function AuthClient() {
  // Access context state and functions
  const { setPageLoading, setIsAuthenticated, setLoggedInUserData } = myStoreHook();
  // Router instance for navigation
  const router = useRouter();

  // State for login form
  const [loginData, setLoginData] = useState({
    login_username: "",
    login_password: "",
  });

  // State for signup form
  const [signUpData, setSignUpData] = useState({
    signup_name: "",
    signup_email: "",
    signup_username: "",
    signup_password: "",
  });

  // Handle change in login form
  const handleOnChangeLoginFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle login form submission
  const handleLoginFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPageLoading(true);

    try {
      const response = await loginUser({
        username: loginData.login_username,
        password: loginData.login_password,
      });

      if (!response) throw new Error("Login failed");

      setLoginData({
        login_username: "",
        login_password: "",
      });

      localStorage.setItem("auth_token", response.token);

      setIsAuthenticated(true);

      // Get user data
      const userData = await getLoggedInUserData(response.token);
      if (!userData) throw new Error("Failed to fetch user data");

      const loggedInUserData: User = {
        id: userData.id,
        name: userData.name,
        email: response.user_email,
        username: response.user_nicename,
      };

      localStorage.setItem("user_data", JSON.stringify(loggedInUserData));
      setLoggedInUserData(loggedInUserData);

      toast.success("User logged in successfully");
      router.push("/products");
    } catch (error) {
      console.error(error);
      toast.error("Invalid login details");
    } finally {
      setPageLoading(false);
    }
  };

  // Handle change in signup form
  const handleOnChangeSignUpFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignUpData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle signup form submission
  const handleSignUpFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPageLoading(true);

    try {
      await registerStoreUser({
        name: signUpData.signup_name,
        username: signUpData.signup_username,
        email: signUpData.signup_email,
        password: signUpData.signup_password,
      });

      setSignUpData({
        signup_name: "",
        signup_email: "",
        signup_username: "",
        signup_password: "",
      });

      toast.success("User registered successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to register user");
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="toast-container"></div>
      <h1 className="my-4 text-center">Login / Signup</h1>
      <div className="row">
        <div className="col-md-6">
          <h2>Login</h2>
          <form onSubmit={handleLoginFormSubmit}>
            <div className="mb-3">
              <label htmlFor="loginUsername" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                name="login_username"
                value={loginData.login_username}
                onChange={handleOnChangeLoginFormData}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="login_password"
                value={loginData.login_password}
                onChange={handleOnChangeLoginFormData}
                className="form-control"
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Login
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Signup</h2>
          <form onSubmit={handleSignUpFormSubmit}>
            <div className="mb-3">
              <label htmlFor="signupName" className="form-label">
                Name
              </label>
              <input
                type="text"
                name="signup_name"
                value={signUpData.signup_name}
                onChange={handleOnChangeSignUpFormData}
                className="form-control"
                placeholder="Enter name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signupEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="signup_email"
                value={signUpData.signup_email}
                onChange={handleOnChangeSignUpFormData}
                className="form-control"
                placeholder="Enter email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signupUsername" className="form-label">
                Username
              </label>
              <input
                type="text"
                name="signup_username"
                value={signUpData.signup_username}
                onChange={handleOnChangeSignUpFormData}
                className="form-control"
                placeholder="Enter username"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signupPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="signup_password"
                value={signUpData.signup_password}
                onChange={handleOnChangeSignUpFormData}
                className="form-control"
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="btn btn-success mt-3">
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}