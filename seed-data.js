const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleAthletes = [
  {
    id: 'athlete_1',
    role: 'athlete',
    profile: {
      name: 'Sarah Johnson',
      bio: 'Professional rugby player with 5 years of experience. Passionate about developing young talent and promoting sports in the Western Cape.',
      sport: 'Rugby',
      achievements: 'Western Province U21 Captain, Varsity Cup Champion 2023, Provincial Player of the Year 2022',
      stats: 'Position: Fly-half, Height: 1.68m, Weight: 65kg, Experience: 5 years'
    }
  },
  {
    id: 'athlete_2',
    role: 'athlete',
    profile: {
      name: 'Michael Chen',
      bio: 'Cricket all-rounder specializing in fast bowling and aggressive batting. Represented Western Province at various levels.',
      sport: 'Cricket',
      achievements: 'Western Province U19 Captain, Provincial Cricket Champion 2023, Best Bowler Award 2022',
      stats: 'Position: All-rounder, Batting Average: 35.2, Bowling Average: 18.5, Wickets: 45'
    }
  },
  {
    id: 'athlete_3',
    role: 'athlete',
    profile: {
      name: 'Aisha Patel',
      bio: 'Netball goal shooter with exceptional accuracy and court awareness. Committed to excellence both on and off the court.',
      sport: 'Netball',
      achievements: 'Western Province Netball Champion 2023, National U21 Squad Member, Provincial MVP 2022',
      stats: 'Position: Goal Shooter, Height: 1.75m, Shooting Accuracy: 89%, Experience: 4 years'
    }
  },
  {
    id: 'athlete_4',
    role: 'athlete',
    profile: {
      name: 'David Williams',
      bio: 'Football midfielder known for exceptional vision and passing ability. Captain of local club and aspiring professional.',
      sport: 'Football',
      achievements: 'Local League Champion 2023, Best Midfielder Award, Provincial U21 Squad',
      stats: 'Position: Central Midfielder, Goals: 12, Assists: 18, Pass Accuracy: 87%'
    }
  }
];

const sampleRecruiters = [
  {
    id: 'recruiter_1',
    role: 'recruiter',
    profile: {
      name: 'Coach James Wilson',
      bio: 'Head coach at Western Cape Sports Academy with 15 years of experience developing young athletes across multiple sports.',
      sport: 'Multi-sport',
      achievements: '15+ years coaching experience, Developed 50+ professional athletes, Sports Science Degree',
      stats: 'Specialization: Rugby & Cricket, Athletes Coached: 150+, Success Rate: 85%'
    }
  },
  {
    id: 'recruiter_2',
    role: 'recruiter',
    profile: {
      name: 'Dr. Maria Rodriguez',
      bio: 'Sports psychologist and talent scout specializing in mental conditioning and performance optimization for elite athletes.',
      sport: 'Psychology',
      achievements: 'PhD Sports Psychology, Worked with 3 national teams, Published 12 research papers',
      stats: 'Specialization: Mental Conditioning, Athletes Mentored: 75+, Success Rate: 92%'
    }
  },
  {
    id: 'recruiter_3',
    role: 'recruiter',
    profile: {
      name: 'Coach Thomas Brown',
      bio: 'Former professional rugby player turned coach. Specializes in strength and conditioning for contact sports.',
      sport: 'Rugby',
      achievements: 'Former Springbok, 10 years professional experience, Level 3 Coaching Certificate',
      stats: 'Specialization: Strength & Conditioning, Athletes Trained: 200+, Experience: 12 years'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Create sample athletes
    for (const athlete of sampleAthletes) {
      await prisma.user.upsert({
        where: { id: athlete.id },
        update: {},
        create: {
          id: athlete.id,
          role: athlete.role,
          profile: {
            create: athlete.profile
          }
        }
      });
    }

    // Create sample recruiters
    for (const recruiter of sampleRecruiters) {
      await prisma.user.upsert({
        where: { id: recruiter.id },
        update: {},
        create: {
          id: recruiter.id,
          role: recruiter.role,
          profile: {
            create: recruiter.profile
          }
        }
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${sampleAthletes.length} athletes and ${sampleRecruiters.length} recruiters`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase(); 