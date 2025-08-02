# Talent Scout ZA

A modern talent scouting platform connecting athletes with recruiters in South Africa. Built with Next.js, Prisma, and real-time messaging.

## Features

- **Real-time Messaging**: WebSocket-based chat system for accepted matches
- **Profile Management**: Complete athlete and recruiter profiles with image uploads
- **Match Requests**: Recruiters can send requests to athletes
- **Real-time Notifications**: Instant notifications for new messages and requests
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Authentication**: Secure user authentication with Clerk

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: Clerk
- **Real-time**: Socket.io
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

## Development

### Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: Code linting and style enforcement
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit checks
- **Lint-staged**: Run linters on staged files only

### Available Scripts

```bash
# Development
npm run dev              # Start Next.js development server
npm run dev:full         # Start both Next.js and Socket.io servers
npm run socket           # Start Socket.io server only

# Building
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run type-check       # Run TypeScript type checking

# Database
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate Prisma client
```

### Pre-commit Hooks

The project includes pre-commit hooks that automatically:
- Run ESLint on staged files
- Check TypeScript compilation
- Ensure code quality before commits

### VS Code Setup

The project includes VS Code configuration for optimal development experience:
- Auto-formatting on save
- ESLint integration
- Tailwind CSS IntelliSense
- TypeScript support

Recommended extensions are listed in `.vscode/extensions.json`.

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- Cloudinary account for image storage

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/talent_scout_za"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
SOCKET_SERVER_URL=http://localhost:3001

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talent-scout-za
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed test data (optional)**
   ```bash
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev:full
   ```

This will start both the Next.js app (port 3000) and the Socket.io server (port 3001).

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── athletes/      # Athlete discovery
│   │   ├── match-request/ # Match request management
│   │   ├── messages/      # Real-time messaging
│   │   ├── profile/       # Profile management
│   │   └── user/          # User management
│   └── dashboard/         # Main application pages
├── components/            # Reusable UI components
├── hooks/                # Custom React hooks
└── lib/                  # Utility libraries
```

## API Endpoints

### Authentication Required
All endpoints require authentication via Clerk.

- `GET /api/athletes` - Get all athlete profiles (recruiters only)
- `GET /api/user` - Get current user info
- `POST /api/user` - Create/update user role
- `GET /api/profile/[userId]` - Get user profile
- `POST /api/profile` - Create/update profile
- `POST /api/profile/upload` - Upload profile image
- `GET /api/match-request` - Get user's match requests
- `POST /api/match-request` - Send match request
- `PATCH /api/match-request/[requestId]` - Accept/decline request
- `GET /api/messages` - Get messages for a match
- `POST /api/messages` - Send a message

## Real-time Features

The application uses Socket.io for real-time communication:

- **New Message Notifications**: Instant notifications when receiving messages
- **Match Request Updates**: Real-time updates when requests are accepted/declined
- **Typing Indicators**: Shows when someone is typing
- **Live Chat**: Real-time messaging for accepted matches

## Image Upload

Profile images are uploaded to Cloudinary with automatic optimization:
- Images are resized to 400x400px
- Automatic quality optimization
- Face detection for better cropping
- Secure HTTPS URLs

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Start the Socket.io server:
   ```bash
   node socket-server.js
   ```

## Development

### Running Tests
```bash
npm run lint
```

### Database Management
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Reset database (development only)
npx prisma db push --force-reset
```

### Socket Server
The Socket.io server runs on port 3001 and handles:
- Real-time messaging
- Typing indicators
- Match request notifications
- User presence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Created by Leon Jordaan**
