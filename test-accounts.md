# Test Accounts for Talent Scout ZA

## How to Create Test Accounts

### Method 1: Using the Sign-up Page
1. Go to `http://localhost:3000/sign-up`
2. Create accounts with these test credentials:

### Athlete Test Accounts

**Athlete 1 - Rugby Player**
- Email: `athlete1@test.com`
- Password: `TestPassword123!`
- Name: `John Smith`
- Role: Athlete (select when prompted)

**Athlete 2 - Cricket Player**
- Email: `athlete2@test.com`
- Password: `TestPassword123!`
- Name: `Sarah Johnson`
- Role: Athlete (select when prompted)

**Athlete 3 - Football Player**
- Email: `athlete3@test.com`
- Password: `TestPassword123!`
- Name: `Mike Wilson`
- Role: Athlete (select when prompted)

### Recruiter Test Accounts

**Recruiter 1 - Rugby Club**
- Email: `recruiter1@test.com`
- Password: `TestPassword123!`
- Name: `David Coach`
- Role: Recruiter (select when prompted)

**Recruiter 2 - Cricket Academy**
- Email: `recruiter2@test.com`
- Password: `TestPassword123!`
- Name: `Lisa Manager`
- Role: Recruiter (select when prompted)

**Recruiter 3 - Football Club**
- Email: `recruiter3@test.com`
- Password: `TestPassword123!`
- Name: `Tom Scout`
- Role: Recruiter (select when prompted)

## Sample Profile Data for Athletes

### John Smith (Rugby Player)
- **Sport**: Rugby
- **Bio**: "Experienced rugby player with 5 years of competitive play. Specializing in fly-half position with strong kicking and tactical awareness."
- **Achievements**: "Provincial U19 champion, Top scorer in Western Cape league 2023, MVP in school tournament"
- **Stats**: "Try conversion rate: 85%, Penalty success: 78%, Average points per game: 12"

### Sarah Johnson (Cricket Player)
- **Sport**: Cricket
- **Bio**: "All-rounder with strong batting and bowling skills. Captain of school team and provincial representative."
- **Achievements**: "Provincial U17 champion, Best all-rounder award 2023, School team captain"
- **Stats**: "Batting average: 45.2, Bowling average: 18.5, 50+ scores: 12, 5-wicket hauls: 3"

### Mike Wilson (Football Player)
- **Sport**: Football
- **Bio**: "Fast winger with excellent dribbling skills and goal-scoring ability. Played for local academy teams."
- **Achievements**: "Academy player of the year 2023, Top scorer in youth league, Regional trials selection"
- **Stats**: "Goals per game: 0.8, Assists per game: 0.5, Speed: 11.2s 100m"

## Testing Scenarios

### For Athletes:
1. **Profile Creation**: Create detailed profiles with the sample data above
2. **View Match Requests**: Check the requests page for incoming recruiter interest
3. **Dashboard Navigation**: Test all dashboard features

### For Recruiters:
1. **Athlete Discovery**: Browse through athlete profiles
2. **Send Match Requests**: Send requests to athletes you're interested in
3. **Track Requests**: Monitor the status of your sent requests

### Cross-Platform Testing:
1. **Athlete → Recruiter**: Create athlete profiles, then test as recruiter viewing them
2. **Request Flow**: Test the complete match request process
3. **Profile Updates**: Test editing and updating profiles

## Database Setup

If you need to reset the database or create fresh test data:

```bash
# Reset database (if using Prisma)
npx prisma db push --force-reset

# Or if you want to seed with test data
npx prisma db seed
```

## Notes

- All test accounts use the same password for simplicity: `TestPassword123!`
- Email addresses are fictional and won't receive actual emails
- You can create additional test accounts as needed
- Remember to test both athlete and recruiter flows thoroughly

Created by Leon Jordaan 