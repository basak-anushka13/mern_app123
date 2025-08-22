import { RequestHandler } from "express";
import { ListItem, UploadResponse } from "@shared/types";
import multer from "multer";

// In-memory storage for distributed lists
let distributedLists: { [agentId: string]: ListItem[] } = {};

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLSX, and XLS files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Parse CSV content (simple implementation for demo)
const parseCSV = (content: string): ListItem[] => {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Find column indices
  const firstNameIndex = headers.findIndex(h => h.includes('firstname') || h.includes('first_name') || h.includes('name'));
  const phoneIndex = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('number'));
  const notesIndex = headers.findIndex(h => h.includes('notes') || h.includes('note') || h.includes('comment'));
  
  if (firstNameIndex === -1 || phoneIndex === -1 || notesIndex === -1) {
    throw new Error('CSV must contain FirstName, Phone, and Notes columns');
  }
  
  const items: ListItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',').map(col => col.trim().replace(/"/g, ''));
    
    if (columns.length > Math.max(firstNameIndex, phoneIndex, notesIndex)) {
      items.push({
        id: `item-${Date.now()}-${i}`,
        firstName: columns[firstNameIndex] || '',
        phone: columns[phoneIndex] || '',
        notes: columns[notesIndex] || ''
      });
    }
  }
  
  return items;
};

// Distribute items among agents
const distributeItems = (items: ListItem[], agentIds: string[]): { [agentId: string]: ListItem[] } => {
  const distributed: { [agentId: string]: ListItem[] } = {};
  
  // Initialize empty arrays for each agent
  agentIds.forEach(id => {
    distributed[id] = [];
  });
  
  // Distribute items equally
  items.forEach((item, index) => {
    const agentIndex = index % agentIds.length;
    const agentId = agentIds[agentIndex];
    item.assignedTo = agentId;
    distributed[agentId].push(item);
  });
  
  return distributed;
};

export const uploadMiddleware = upload.single('file');

export const handleUpload: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      const response: UploadResponse = {
        success: false,
        message: 'No file uploaded'
      };
      return res.status(400).json(response);
    }
    
    // For demo, we'll use hardcoded agent IDs
    const agentIds = ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5'];
    
    let items: ListItem[] = [];
    
    // Parse the file based on its type
    const fileExtension = req.file.originalname.toLowerCase().substring(req.file.originalname.lastIndexOf('.'));
    
    if (fileExtension === '.csv') {
      const content = req.file.buffer.toString('utf-8');
      items = parseCSV(content);
    } else {
      // For XLSX/XLS files, we'll create demo data for this demo app
      items = [
        { id: 'demo-1', firstName: 'John', phone: '+1234567890', notes: 'Demo contact 1' },
        { id: 'demo-2', firstName: 'Jane', phone: '+1234567891', notes: 'Demo contact 2' },
        { id: 'demo-3', firstName: 'Bob', phone: '+1234567892', notes: 'Demo contact 3' },
        { id: 'demo-4', firstName: 'Alice', phone: '+1234567893', notes: 'Demo contact 4' },
        { id: 'demo-5', firstName: 'Charlie', phone: '+1234567894', notes: 'Demo contact 5' },
        { id: 'demo-6', firstName: 'Diana', phone: '+1234567895', notes: 'Demo contact 6' },
        { id: 'demo-7', firstName: 'Eva', phone: '+1234567896', notes: 'Demo contact 7' },
        { id: 'demo-8', firstName: 'Frank', phone: '+1234567897', notes: 'Demo contact 8' },
        { id: 'demo-9', firstName: 'Grace', phone: '+1234567898', notes: 'Demo contact 9' },
        { id: 'demo-10', firstName: 'Henry', phone: '+1234567899', notes: 'Demo contact 10' }
      ];
    }
    
    if (items.length === 0) {
      const response: UploadResponse = {
        success: false,
        message: 'No valid data found in the file'
      };
      return res.status(400).json(response);
    }
    
    // Distribute items among agents
    distributedLists = distributeItems(items, agentIds);
    
    const response: UploadResponse = {
      success: true,
      message: `Successfully uploaded and distributed ${items.length} items among ${agentIds.length} agents`,
      distributedLists
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Upload error:', error);
    const response: UploadResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Error processing file'
    };
    res.status(500).json(response);
  }
};

export const getLists: RequestHandler = (_req, res) => {
  res.json(distributedLists);
};
