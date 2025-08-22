export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface ListItem {
  id: string;
  firstName: string;
  phone: string;
  notes: string;
  assignedTo?: string; // Agent ID
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  distributedLists?: { [agentId: string]: ListItem[] };
}
