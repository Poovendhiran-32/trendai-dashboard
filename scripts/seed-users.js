// User seeding script
import DatabaseService from '../lib/database/database-service.js';
import bcrypt from 'bcryptjs';

async function seedUsers() {
  try {
    console.log('👤 Starting user seeding...');
    
    const users = [
      {
        email: 'admin@trendai.com',
        password: await bcrypt.hash('admin123', 12),
        name: 'Admin User',
        role: 'admin',
        isActive: true
      },
      {
        email: 'user@trendai.com',
        password: await bcrypt.hash('user123', 12),
        name: 'Regular User',
        role: 'user',
        isActive: true
      },
      {
        email: 'viewer@trendai.com',
        password: await bcrypt.hash('viewer123', 12),
        name: 'Viewer User',
        role: 'viewer',
        isActive: true
      },
      {
        email: 'manager@trendai.com',
        password: await bcrypt.hash('manager123', 12),
        name: 'Manager User',
        role: 'admin',
        isActive: true
      }
    ];

    console.log('📝 Creating users...');
    
    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await DatabaseService.getUserByEmail(userData.email);
        if (existingUser) {
          console.log(`⚠️ User ${userData.email} already exists, skipping...`);
          continue;
        }

        const user = await DatabaseService.createUser(userData);
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      } catch (error) {
        console.log(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }

    console.log('✅ User seeding completed!');
    
    // Test the users
    const allUsers = await DatabaseService.getAllUsers({ limit: 10 });
    console.log(`\n📊 Total users in database: ${allUsers.total}`);
    
    allUsers.users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ User seeding failed:', error);
  }
}

seedUsers();
