# Agent Management System - MERN Stack Demo

A modern, production-ready MERN stack application for managing agents and distributing tasks through CSV uploads.

## 🚀 Features

- **Admin Authentication**: Secure login with JWT tokens
- **Agent Management**: Create and manage agent profiles
- **CSV Upload & Distribution**: Upload CSV files and automatically distribute tasks among agents
- **Modern UI**: Beautiful, responsive interface built with React and TailwindCSS
- **Real-time Updates**: Dynamic content updates without page reloads

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS + Radix UI
- **Backend**: Express.js + Node.js
- **Build Tool**: Vite
- **Package Manager**: PNPM

## 📋 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PNPM package manager

### Installation

1. **Clone the repository** (if not already done)
2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Start the development server**:

   ```bash
   pnpm dev
   ```

4. **Open your browser** and navigate to `http://localhost:8080`

## 🔐 Demo Credentials

Use these credentials to access the admin dashboard:

- **Email**: `admin@demo.com`
- **Password**: `password123`

## 📁 CSV File Format

When uploading CSV files for task distribution, ensure your file contains these columns:

- **FirstName** (required) - Contact's first name
- **Phone** (required) - Phone number with country code
- **Notes** (required) - Additional notes or comments

### Example CSV Format:

```csv
FirstName,Phone,Notes
John,+1234567890,Important client
Jane,+1234567891,Follow up needed
Bob,+1234567892,New lead
```

## 🎯 How to Use

### 1. Login

- Navigate to the homepage
- Use the demo credentials provided above
- Click "Sign In" to access the dashboard

### 2. Manage Agents

- Go to the "Agents" tab
- View the 5 pre-loaded demo agents
- Click "Add Agent" to create new agents with:
  - Name
  - Email
  - Mobile number (with country code)
  - Password

### 3. Upload and Distribute Lists

- Go to the "Upload & Distribute" tab
- Select a CSV file (or XLSX/XLS for demo data)
- The system will automatically:
  - Validate the file format
  - Parse the data
  - Distribute items equally among all 5 agents
  - Handle remainder items sequentially

### 4. View Distributed Lists

- Go to the "Distributed Lists" tab
- See how tasks are distributed among agents
- Each agent's assigned items are displayed separately

## 🏗️ Architecture

### Frontend Structure

```
client/
├── pages/           # React pages (Login, Dashboard)
├── components/ui/   # Reusable UI components
├── App.tsx         # Main app component with routing
└── global.css      # TailwindCSS styles
```

### Backend Structure

```
server/
├── routes/         # API route handlers
│   ├── auth.ts    # Authentication logic
│   ├── agents.ts  # Agent management
│   └── upload.ts  # File upload & distribution
└── index.ts       # Express server setup
```

### Shared Types

```
shared/
└── types.ts       # TypeScript interfaces shared between client/server
```

## 🔄 Distribution Algorithm

The system distributes tasks using a round-robin approach:

1. **Equal Distribution**: Items are distributed equally among all agents
2. **Remainder Handling**: If items don't divide evenly, remainder items are distributed sequentially
3. **Example**:
   - 23 items ÷ 5 agents = 4 items each + 3 remainder
   - Distribution: Agent1(5), Agent2(5), Agent3(5), Agent4(4), Agent5(4)

## 🎨 Design System

The application uses a modern design system with:

- **Colors**: Blue and indigo gradients for primary elements
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent UI components from Radix UI
- **Layout**: Responsive grid system that works on all devices
- **Animations**: Subtle transitions and hover effects

## 🚀 Production Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## 🔧 Environment Variables

Create a `.env` file in the root directory for configuration:

```env
PING_MESSAGE=pong
```

## 📦 Deployment

The application is ready for deployment on platforms like:

- **Netlify**: Connect via [MCP integration](#open-mcp-popover)
- **Vercel**: Connect via [MCP integration](#open-mcp-popover)
- **Traditional hosting**: Use the production build

## ⚠️ Demo Limitations

This is a demo application with the following limitations:

- **No real database**: Data is stored in memory and resets on server restart
- **Simple authentication**: JWT tokens are basic and for demo purposes only
- **File processing**: XLSX/XLS files use demo data instead of actual parsing
- **No persistence**: Uploaded data doesn't persist between server restarts

## 🔄 Future Enhancements

For a production version, consider adding:

- MongoDB integration for data persistence
- Real XLSX/XLS file parsing
- User role management
- Email notifications
- Advanced reporting and analytics
- Agent performance tracking

## 🎥 Video Demonstration

A working video demonstration would show:

1. Logging in with demo credentials
2. Viewing and adding agents
3. Uploading a CSV file
4. Viewing the distributed lists across agents
5. Navigation between different sections

## 🆘 Support

If you encounter any issues:

1. Ensure all dependencies are installed correctly
2. Check that the development server is running on port 8080
3. Verify the demo credentials are entered correctly
4. Check the browser console for any error messages

---

**Built with ❤️ using modern web technologies**
