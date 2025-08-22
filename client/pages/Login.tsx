import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, Users, Upload } from "lucide-react";
import { LoginRequest, LoginResponse } from "@shared/types";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Clear any existing auth data on component mount
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Add a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const loginData: LoginRequest = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      console.log('Attempting login with:', { email: loginData.email });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed with status:', response.status, 'Error:', errorText);
        throw new Error(`Login failed (${response.status}): ${errorText}`);
      }

      const data = (await response.json()) as LoginResponse;
      console.log('Login response data:', { success: data.success, hasToken: !!data.token, hasUser: !!data.user });

      if (data.success && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log('Login successful, navigating to dashboard');

        // Clear form and error before navigation
        setEmail("");
        setPassword("");
        setError("");

        navigate("/dashboard");
      } else {
        setError(
          data.message ||
            "Invalid credentials. Please check your email and password.",
        );
      }
    } catch (error) {
      console.error("Login error details:", error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError("Network connection failed. Please check your internet connection and try again.");
      } else {
        setError(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-12">
        {/* Left side - Features */}
        <div className="hidden lg:flex flex-col space-y-8 max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Agent Management System
            </h1>
            <p className="text-lg text-slate-600">
              Streamline your agent operations with powerful tools for team
              management and task distribution.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Secure Admin Access
                </h3>
                <p className="text-sm text-slate-600">
                  JWT-based authentication with role management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Agent Management
                </h3>
                <p className="text-sm text-slate-600">
                  Create and manage your agent network efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Smart Distribution
                </h3>
                <p className="text-sm text-slate-600">
                  Upload CSV files and auto-distribute tasks to agents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-800">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Access your agent management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setEmail("admin@demo.com");
                  setPassword("password123");
                  setError("");
                }}
                variant="outline"
                className="w-full h-11 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Use Demo Credentials
              </Button>
            </form>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Demo Credentials:
              </p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong>Email:</strong> admin@demo.com
                </p>
                <p>
                  <strong>Password:</strong> password123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
