import { RequestHandler } from "express";
import { Agent } from "@shared/types";

// Demo agents data
let agents: Agent[] = [
  {
    id: "agent-1",
    name: "John Smith",
    email: "john@example.com",
    mobile: "+1 234 567 8901",
    password: "password123",
  },
  {
    id: "agent-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    mobile: "+1 234 567 8902",
    password: "password123",
  },
  {
    id: "agent-3",
    name: "Mike Davis",
    email: "mike@example.com",
    mobile: "+1 234 567 8903",
    password: "password123",
  },
  {
    id: "agent-4",
    name: "Emily Wilson",
    email: "emily@example.com",
    mobile: "+1 234 567 8904",
    password: "password123",
  },
  {
    id: "agent-5",
    name: "David Brown",
    email: "david@example.com",
    mobile: "+1 234 567 8905",
    password: "password123",
  },
];

export const getAgents: RequestHandler = (_req, res) => {
  res.json(agents);
};

export const createAgent: RequestHandler = (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Basic validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingAgent = agents.find((agent) => agent.email === email);
    if (existingAgent) {
      return res
        .status(400)
        .json({ error: "Agent with this email already exists" });
    }

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name,
      email,
      mobile,
      password,
    };

    agents.push(newAgent);
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
