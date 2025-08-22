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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Plus,
  Users,
  Upload,
  FileText,
  Phone,
  User,
  Mail,
  Key,
} from "lucide-react";
import {
  Agent,
  ListItem,
  User as UserType,
  UploadResponse,
} from "@shared/types";

export default function Dashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [distributedLists, setDistributedLists] = useState<{
    [agentId: string]: ListItem[];
  }>({});
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(userData));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setConnectionError("");

    try {
      await Promise.all([fetchAgents(), fetchDistributedLists()]);
    } catch (error) {
      setConnectionError("Unable to load dashboard data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      throw error; // Re-throw to be caught by loadDashboardData
    }
  };

  const fetchDistributedLists = async () => {
    try {
      const response = await fetch("/api/lists");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDistributedLists(data);
    } catch (error) {
      console.error("Error fetching lists:", error);
      throw error; // Re-throw to be caught by loadDashboardData
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAgent),
      });

      if (response.ok) {
        await fetchAgents();
        setNewAgent({ name: "", email: "", mobile: "", password: "" });
        setIsAddAgentOpen(false);
      }
    } catch (error) {
      console.error("Error adding agent:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (!allowedTypes.includes(fileExtension)) {
      setUploadError("Please upload only CSV, XLSX, or XLS files");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as UploadResponse;

      if (data.success) {
        setUploadSuccess(data.message);
        setUploadError("");
        if (data.distributedLists) {
          setDistributedLists(data.distributedLists);
        }
      } else {
        setUploadError(data.message);
        setUploadSuccess("");
      }
    } catch (error) {
      setUploadError("Error uploading file");
      setUploadSuccess("");
    }
  };

  const getAgentListCount = (agentId: string) => {
    return distributedLists[agentId]?.length || 0;
  };

  const getTotalItems = () => {
    return Object.values(distributedLists).flat().length;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Agent Management System
              </h1>
              <p className="text-sm text-slate-600">
                Welcome back, {user.name}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-slate-300 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="upload">Upload & Distribute</TabsTrigger>
            <TabsTrigger value="lists">Distributed Lists</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Agents
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {agents.length}
                  </div>
                  <p className="text-xs text-slate-600">
                    Active agents in system
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Distributed Items
                  </CardTitle>
                  <FileText className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {getTotalItems()}
                  </div>
                  <p className="text-xs text-slate-600">
                    Total items distributed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    System Status
                  </CardTitle>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Active
                  </div>
                  <p className="text-xs text-slate-600">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Agent Management
              </h2>
              <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agent
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Add New Agent</DialogTitle>
                    <DialogDescription>
                      Create a new agent profile with contact details.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddAgent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newAgent.name}
                        onChange={(e) =>
                          setNewAgent({ ...newAgent, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAgent.email}
                        onChange={(e) =>
                          setNewAgent({ ...newAgent, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile (with country code)</Label>
                      <Input
                        id="mobile"
                        placeholder="+1 234 567 8900"
                        value={newAgent.mobile}
                        onChange={(e) =>
                          setNewAgent({ ...newAgent, mobile: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newAgent.password}
                        onChange={(e) =>
                          setNewAgent({ ...newAgent, password: e.target.value })
                        }
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Create Agent
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card
                  key={agent.id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-800">
                        {agent.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {getAgentListCount(agent.id)} items
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4" />
                      {agent.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4" />
                      {agent.mobile}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>
                  Upload a CSV file with FirstName, Phone, and Notes columns.
                  The data will be automatically distributed among all agents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Select CSV, XLSX, or XLS file
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {uploadError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                )}

                {uploadSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700">
                      {uploadSuccess}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2">
                    File Format Requirements:
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• FirstName column (required)</li>
                    <li>• Phone column (required)</li>
                    <li>• Notes column (required)</li>
                    <li>• Accepted formats: CSV, XLSX, XLS</li>
                    <li>• Data will be distributed equally among all agents</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lists" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Distributed Lists
            </h2>

            {Object.keys(distributedLists).length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">
                    No Lists Distributed
                  </h3>
                  <p className="text-slate-600">
                    Upload a CSV file to see distributed lists here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <Card
                    key={agent.id}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{agent.name}</span>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {getAgentListCount(agent.id)} items
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {distributedLists[agent.id]?.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {distributedLists[agent.id].map((item) => (
                            <div
                              key={item.id}
                              className="p-3 bg-slate-50 rounded-lg border"
                            >
                              <div className="font-medium text-slate-800">
                                {item.firstName}
                              </div>
                              <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                <Phone className="h-3 w-3" />
                                {item.phone}
                              </div>
                              <div className="text-sm text-slate-600 mt-2">
                                <strong>Notes:</strong> {item.notes}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-4">
                          No items assigned
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
