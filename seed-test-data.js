const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Setting up clean database...');

    // Clear all existing data
    console.log('🧹 Clearing existing data...');
    await prisma.message.deleteMany();
    await prisma.matchRequest.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Database cleaned successfully');
    console.log('🎉 Database ready for real users!');

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