const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create test users with Clerk IDs
    const testUsers = [
      // Athletes
      {
        id: 'user_athlete1',
        role: 'athlete',
        profile: {
          name: 'John Smith',
          bio: 'Experienced rugby player with 5 years of competitive play. Specializing in fly-half position with strong kicking and tactical awareness.',
          sport: 'Rugby',
          achievements: 'Provincial U19 champion, Top scorer in Western Cape league 2023, MVP in school tournament',
          stats: 'Try conversion rate: 85%, Penalty success: 78%, Average points per game: 12',
          imageUrl: null
        }
      },
      {
        id: 'user_athlete2',
        role: 'athlete',
        profile: {
          name: 'Sarah Johnson',
          bio: 'All-rounder with strong batting and bowling skills. Captain of school team and provincial representative.',
          sport: 'Cricket',
          achievements: 'Provincial U17 champion, Best all-rounder award 2023, School team captain',
          stats: 'Batting average: 45.2, Bowling average: 18.5, 50+ scores: 12, 5-wicket hauls: 3',
          imageUrl: null
        }
      },
      {
        id: 'user_athlete3',
        role: 'athlete',
        profile: {
          name: 'Mike Wilson',
          bio: 'Fast-paced midfielder with excellent ball control and vision. Known for creating scoring opportunities.',
          sport: 'Football',
          achievements: 'School team captain, Provincial U16 champion, Top assist provider 2023',
          stats: 'Goals: 15, Assists: 22, Pass accuracy: 87%, Distance covered per game: 11.2km',
          imageUrl: null
        }
      },
      {
        id: 'user_athlete4',
        role: 'athlete',
        profile: {
          name: 'Lisa Thompson',
          bio: 'Versatile player with strong defensive skills and leadership qualities. Team captain for 3 consecutive years.',
          sport: 'Netball',
          achievements: 'Provincial U18 champion, Best defender award 2023, School team captain',
          stats: 'Intercepts per game: 8.5, Rebound rate: 92%, Pass accuracy: 89%',
          imageUrl: null
        }
      },
      {
        id: 'user_athlete5',
        role: 'athlete',
        profile: {
          name: 'David Brown',
          bio: 'Powerful forward with excellent scrum technique and ball carrying ability. Team leader on and off the field.',
          sport: 'Rugby',
          achievements: 'Provincial U20 champion, Best forward award 2023, School team vice-captain',
          stats: 'Tries: 18, Tackles per game: 12.5, Carries per game: 15, Metres gained: 120',
          imageUrl: null
        }
      },

      // Recruiters
      {
        id: 'user_recruiter1',
        role: 'recruiter',
        profile: {
          name: 'David Coach',
          bio: 'Head coach at Western Cape Rugby Academy. Specializing in developing young talent for provincial and national teams.',
          sport: 'Rugby',
          achievements: 'Former provincial coach, 15+ years experience, Developed 50+ professional players',
          stats: 'Success rate: 85%, Players developed: 50+, Provincial selections: 25',
          imageUrl: null
        }
      },
      {
        id: 'user_recruiter2',
        role: 'recruiter',
        profile: {
          name: 'Lisa Manager',
          bio: 'Talent scout for Cape Town Cricket Academy. Focus on identifying and nurturing cricket talent in the Western Cape.',
          sport: 'Cricket',
          achievements: 'Former provincial player, 10+ years scouting experience, Academy director',
          stats: 'Players scouted: 30+, Provincial selections: 18, Academy success rate: 90%',
          imageUrl: null
        }
      },
      {
        id: 'user_recruiter3',
        role: 'recruiter',
        profile: {
          name: 'Tom Scout',
          bio: 'Football talent scout for Cape Town United FC. Specializing in youth development and academy recruitment.',
          sport: 'Football',
          achievements: 'Former professional player, UEFA licensed coach, Academy head scout',
          stats: 'Players discovered: 45+, Professional contracts: 12, Academy graduates: 28',
          imageUrl: null
        }
      }
    ];

    console.log('📝 Creating users and profiles...');
    
    for (const userData of testUsers) {
      // Create user
      await prisma.user.upsert({
        where: { id: userData.id },
        update: {},
        create: {
          id: userData.id,
          role: userData.role,
        }
      });

      // Create profile
      await prisma.profile.upsert({
        where: { userId: userData.id },
        update: userData.profile,
        create: {
          ...userData.profile,
          userId: userData.id,
        }
      });
    }

    console.log('✅ Users and profiles created successfully');

    // Create some sample match requests
    console.log('🤝 Creating sample match requests...');
    
    const matchRequests = [
      {
        recruiterId: 'user_recruiter1',
        athleteId: 'user_athlete1',
        status: 'pending'
      },
      {
        recruiterId: 'user_recruiter1',
        athleteId: 'user_athlete5',
        status: 'accepted'
      },
      {
        recruiterId: 'user_recruiter2',
        athleteId: 'user_athlete2',
        status: 'accepted'
      },
      {
        recruiterId: 'user_recruiter3',
        athleteId: 'user_athlete3',
        status: 'pending'
      },
      {
        recruiterId: 'user_recruiter3',
        athleteId: 'user_athlete4',
        status: 'declined'
      }
    ];

    for (const request of matchRequests) {
      await prisma.matchRequest.upsert({
        where: {
          recruiterId_athleteId: {
            recruiterId: request.recruiterId,
            athleteId: request.athleteId
          }
        },
        update: { status: request.status },
        create: request
      });
    }

    console.log('✅ Match requests created successfully');

    // Create some sample messages for accepted matches
    console.log('💬 Creating sample messages...');
    
    const messages = [
      {
        matchId: (await prisma.matchRequest.findFirst({
          where: {
            recruiterId: 'user_recruiter1',
            athleteId: 'user_athlete5',
            status: 'accepted'
          }
        }))?.id,
        senderId: 'user_recruiter1',
        content: 'Hi David! I was impressed by your performance in the recent tournament. Would you be interested in joining our academy?'
      },
      {
        matchId: (await prisma.matchRequest.findFirst({
          where: {
            recruiterId: 'user_recruiter1',
            athleteId: 'user_athlete5',
            status: 'accepted'
          }
        }))?.id,
        senderId: 'user_athlete5',
        content: 'Thank you for the opportunity! I would love to learn more about your academy program.'
      },
      {
        matchId: (await prisma.matchRequest.findFirst({
          where: {
            recruiterId: 'user_recruiter2',
            athleteId: 'user_athlete2',
            status: 'accepted'
          }
        }))?.id,
        senderId: 'user_recruiter2',
        content: 'Hi Sarah! Your all-round performance caught my attention. Are you available for a trial session?'
      },
      {
        matchId: (await prisma.matchRequest.findFirst({
          where: {
            recruiterId: 'user_recruiter2',
            athleteId: 'user_athlete2',
            status: 'accepted'
          }
        }))?.id,
        senderId: 'user_athlete2',
        content: 'Absolutely! I would be honored to trial with your academy. When would be convenient?'
      }
    ];

    for (const message of messages) {
      if (message.matchId) {
        await prisma.message.create({
          data: message
        });
      }
    }

    console.log('✅ Messages created successfully');
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedData()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }); 