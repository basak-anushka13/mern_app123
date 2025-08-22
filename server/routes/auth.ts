import { RequestHandler } from "express";
import { LoginRequest, LoginResponse, User } from "@shared/types";

// Demo user for testing
const demoUser: User = {
  id: "admin-1",
  email: "admin@demo.com",
  name: "Admin User"
};

const demoPassword = "password123";

// Simple JWT token generation (demo only)
const generateToken = (user: User): string => {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64');
};

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validate demo credentials
    if (email === demoUser.email && password === demoPassword) {
      const token = generateToken(demoUser);
      
      const response: LoginResponse = {
        success: true,
        token,
        user: demoUser,
        message: "Login successful"
      };
      
      res.json(response);
    } else {
      const response: LoginResponse = {
        success: false,
        message: "Invalid email or password"
      };
      
      res.status(401).json(response);
    }
  } catch (error) {
    const response: LoginResponse = {
      success: false,
      message: "Server error"
    };
    
    res.status(500).json(response);
  }
};
