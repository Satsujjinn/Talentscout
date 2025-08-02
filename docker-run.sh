#!/bin/bash

echo "🚀 Starting Talent Scout ZA with Docker..."

# Build and start the containers
docker-compose up --build -d

echo "✅ Containers started successfully!"
echo "📊 Database is running on port 5432"
echo "🌐 Application is running on http://localhost:3000"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down" 