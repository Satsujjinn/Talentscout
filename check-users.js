const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking users and profiles...\n');

    // Get all users with their profiles
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });

    console.log(`📊 Total users: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Profile: ${user.profile ? '✅ Has profile' : '❌ No profile'}`);
      
      if (user.profile) {
        console.log(`   Name: ${user.profile.name}`);
        console.log(`   Sport: ${user.profile.sport || 'Not specified'}`);
        console.log(`   Bio: ${user.profile.bio ? user.profile.bio.substring(0, 50) + '...' : 'No bio'}`);
      }
      console.log('');
    });

    // Check athletes specifically
    const athletes = users.filter(u => u.role === 'athlete');
    console.log(`🏃 Athletes: ${athletes.length}`);
    athletes.forEach(athlete => {
      console.log(`   - ${athlete.profile?.name || 'Unknown'} (${athlete.id})`);
    });

    // Check recruiters specifically
    const recruiters = users.filter(u => u.role === 'recruiter');
    console.log(`\n🎯 Recruiters: ${recruiters.length}`);
    recruiters.forEach(recruiter => {
      console.log(`   - ${recruiter.profile?.name || 'Unknown'} (${recruiter.id})`);
    });

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 