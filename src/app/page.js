"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful");
        localStorage.setItem("token", data.token);

        if (data.isNewUser) {
          setMessage("Creating your team...");
          setIsCreatingTeam(true);
          // Start checking team creation status
          router.push(`/dashboard`);
        } else {
          router.push(`/dashboard`);
        }
      } else {
        setMessage(data.error || data.message || "Something Went Wrong");
      }
    } catch (error) {
      setMessage("An error occurred while trying to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Login or Register
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter your credentials to access account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLoginOrRegister}
            className="mt-8 space-y-6 bg-gray-800 p-8 shadow-sm rounded-xl border border-gray-700"
          >
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-600 px-4 py-2 text-white bg-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-gray-800 focus:outline-none transition-colors duration-200"
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-600 px-4 py-2 text-white bg-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-gray-800 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-gray-800 transition-colors duration-200"
            >
              Login
            </button>

            {/* Message Display */}
            {message && (
              <p className="mt-2 text-sm text-center text-gray-400">
                {message}
              </p>
            )}
          </form>

          {/* Additional Links */}
          <div className="text-center text-sm">
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Forgot your password?
            </a>
            <span className="mx-2 text-gray-400">•</span>
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Create an account
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default Auth;
