import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import Project from '../models/Project.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add console.log to verify configuration
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY !== undefined,
  api_secret: process.env.CLOUDINARY_API_SECRET !== undefined
});

// Public route to get all projects
router.get('/', async (req, res) => {
  try {
    const { status, constituency, district } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (constituency) filter.constituency = constituency;
    if (district) filter.district = district;

    // If there's an auth token, verify and populate additional fields
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        const projects = await Project.find(filter)
          .populate('uploadedBy', 'username role constituency')
          .sort({ createdAt: -1 });
        return res.json(projects);
      } catch (err) {
        console.error('Token verification failed:', err);
      }
    }

    // For public access, return limited data
    const projects = await Project.find(filter)
      .select('-uploadedBy')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Protected routes below should use authenticateToken middleware
router.post('/', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, village, mandal, constituency, sponsor, status } = req.body;
    
    // Ensure we have a user ID from the auth token
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'andhra-vikasam/projects'
          });
          
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload image to Cloudinary');
        }
      }
    }

    // Create new project with uploadedBy field
    const project = new Project({
      title,
      description,
      village,
      mandal,
      constituency,
      sponsor,
      status: status || 'Pending',
      images: imageUrls,
      uploadedBy: req.user.id // Set the uploadedBy field from the auth token
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(400).json({ message: error.message });
  }
});
router.get('/',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { status, constituency, district } = req.query;
      const filter = {};

      if (status) filter.status = status;
      if (constituency) filter.constituency = constituency;

      const projects = await Project.find(filter)
        .populate('uploadedBy', 'username role constituency')
        .sort({ createdAt: -1 });

      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('uploadedBy', 'username role constituency');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update the PATCH route handler
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['Pending', 'In Progress', 'Solved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Status update error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete project route
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

export default router;
