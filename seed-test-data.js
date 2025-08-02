const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Setting up clean database...');

    // Clean database - no dummy data
    console.log('🧹 Database is clean and ready for real users');
    console.log('✅ Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedData()
  .then(() => {
    console.log('✅ Database setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }); 