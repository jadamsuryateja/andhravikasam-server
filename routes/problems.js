import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Problem from '../models/Problem.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new problem report
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { category, location, details, contact } = req.body;

    console.log('Received data:', {
      category,
      location: typeof location === 'string' ? JSON.parse(location) : location,
      details: typeof details === 'string' ? JSON.parse(details) : details,
      contact: typeof contact === 'string' ? JSON.parse(contact) : contact
    });

    // Upload images to Cloudinary if any
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'andhra-vikasam/problems'
        });
        
        imageUrls.push(result.secure_url);
      }
    }

    // Parse JSON strings if needed
    const locationData = typeof location === 'string' ? JSON.parse(location) : location;
    const detailsData = typeof details === 'string' ? JSON.parse(details) : details;
    const contactData = typeof contact === 'string' ? JSON.parse(contact) : contact;

    // Create new problem report
    const problem = new Problem({
      category,
      location: locationData,
      details: detailsData,
      contact: contactData,
      images: imageUrls
    });

    console.log('Creating problem with data:', {
      category,
      location: locationData,
      details: detailsData,
      contact: contactData,
      images: imageUrls
    });

    await problem.save();
    res.status(201).json({
      message: 'Problem reported successfully',
      problem
    });

  } catch (error) {
    console.error('Problem report error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all problems (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { district, pinCode, category } = req.query;
    const filter = {};

    if (district) filter['location.district'] = district;
    if (pinCode) filter['location.pinCode'] = pinCode;
    if (category) filter.category = category;

    const problems = await Problem.find(filter)
      .sort({ createdAt: -1 });
      
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update problem status (admin only)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(problem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add this new route for suggestions
router.get('/suggestions', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { type, query } = req.query;
    let suggestions = [];

    if (type === 'district') {
      suggestions = await Problem.distinct('location.district', {
        'location.district': new RegExp(query, 'i')
      });
    } else if (type === 'pinCode') {
      suggestions = await Problem.distinct('location.pinCode', {
        'location.pinCode': new RegExp('^' + query)
      });
    }

    res.json(suggestions.slice(0, 10)); // Limit to 10 suggestions
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to handle deletions
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem report not found' });
    }

    // Delete the problem report
    await Problem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Problem report deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting problem report' });
  }
});

export default router;