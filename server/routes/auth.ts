import { RequestHandler } from "express";
import { LoginRequest, LoginResponse, User } from "@shared/types";

// Demo user for testing
const demoUser: User = {
  id: "admin-1",
  email: "admin@demo.com",
  name: "Admin User",
};

const demoPassword = "password123";

// Simple JWT token generation (demo only)
const generateToken = (user: User): string => {
  return Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    }),
  ).toString("base64");
};

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Input validation
    if (!email || !password) {
      const response: LoginResponse = {
        success: false,
        message: "Email and password are required",
      };
      return res.status(400).json(response);
    }

    // Normalize email for comparison
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    console.log(`Login attempt: ${normalizedEmail}`);

    // Validate demo credentials
    if (
      normalizedEmail === demoUser.email.toLowerCase() &&
      normalizedPassword === demoPassword
    ) {
      const token = generateToken(demoUser);

      const response: LoginResponse = {
        success: true,
        token,
        user: demoUser,
        message: "Login successful",
      };

      console.log(`Login successful for: ${normalizedEmail}`);
      res.json(response);
    } else {
      const response: LoginResponse = {
        success: false,
        message:
          "Invalid email or password. Please use the demo credentials provided.",
      };

      console.log(`Login failed for: ${normalizedEmail}`);
      res.status(401).json(response);
    }
  } catch (error) {
    console.error("Login error:", error);
    const response: LoginResponse = {
      success: false,
      message: "Server error occurred",
    };

    res.status(500).json(response);
  }
};
