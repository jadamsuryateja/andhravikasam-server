import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Clear existing admins
    await Admin.deleteMany({});

    // Create new admin with a secure password
    await Admin.create({
      username: 'admin',
      // More secure password with mixed case, numbers, and special characters
      password: 'Andhra@Vikasam#2025',
      role: 'admin',
      tokenExpiry: false
    });

    console.log(`
====================================
🔐 Admin Account Created Successfully
====================================
Username: admin
Password: Andhra@Vikasam#2025
Role: State Admin

⚠️ IMPORTANT: Save these credentials securely!
====================================
    `);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
