import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import memberRoutes from './routes/members.js';
import projectRoutes from './routes/projects.js';
import adminRoutes from './routes/admin.js';
import fundRoutes from './routes/funds.js';
import statsRoutes from './routes/stats.js';
import statsAboutRoutes from './routes/statsAbout.js';
import problemRoutes from './routes/problems.js';
import statsJoinRoutes from './routes/statsJoin.js';
import statsTransparencyRoutes from './routes/statsTransparency.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: ['https://andhravikasam-fronend.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/members', memberRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/stats-about', statsAboutRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/stats-join', statsJoinRoutes);
app.use('/api/stats-transparency', statsTransparencyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Andhra Vikasam API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add this to help debug route issues
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});
