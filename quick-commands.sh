#!/bin/bash
# Quick Commands for Orthopedic Shop

echo "🏥 Orthopedic Shop - Quick Commands"
echo "===================================="
echo ""

# Function to show available commands
show_commands() {
    echo "Available Commands:"
    echo ""
    echo "🔧 Development:"
    echo "  npm start          - Start development servers"
    echo "  npm run dev        - Run with hot reload"
    echo "  npm run seed       - Populate database with test data"
    echo "  npm run test       - Run test suite"
    echo ""
    echo "🐳 Docker:"
    echo "  npm run docker:up     - Start all services"
    echo "  npm run docker:down   - Stop all services"
    echo "  npm run docker:logs   - View logs"
    echo "  npm run docker:clean  - Remove containers and volumes"
    echo "  npm run docker:build  - Rebuild images"
    echo ""
    echo "📊 Monitoring:"
    echo "  npm run docker:ps     - Show container status"
    echo "  npm run health-check  - Verify all services"
    echo ""
    echo "🔑 Authentication:"
    echo "  Admin Email:    admin@orthoshop.com"
    echo "  Admin Password: admin123"
    echo ""
    echo "📍 URLs:"
    echo "  Frontend:  http://localhost:3000"
    echo "  API:       http://localhost:5000/api"
    echo "  Health:    http://localhost:5000/api/health"
    echo "  MongoDB:   mongodb://localhost:27017"
    echo ""
    echo "📚 Documentation:"
    echo "  FINAL_STATUS.md        - Production readiness report"
    echo "  DEPLOYMENT.md          - Complete deployment guide"
    echo "  PRODUCTION_CHECKLIST.md - Pre-deployment checklist"
    echo "  TEST_REPORT.md         - Detailed test results"
}

# Quick health check
health_check() {
    echo "🏥 Running Health Check..."
    echo ""
    
    echo "📦 MongoDB:"
    docker-compose ps mongo | grep mongo
    echo ""
    
    echo "🔙 Backend:"
    docker-compose ps backend | grep backend
    echo ""
    
    echo "🎨 Frontend:"
    docker-compose ps frontend | grep frontend
    echo ""
    
    echo "📊 API Health:"
    curl -s http://localhost:5000/api/health | jq . 2>/dev/null || curl -s http://localhost:5000/api/health
    echo ""
}

# Main menu
case "$1" in
    "help"|"--help"|"-h"|"")
        show_commands
        ;;
    "health")
        health_check
        ;;
    "up")
        docker-compose up -d
        ;;
    "down")
        docker-compose down
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "ps")
        docker-compose ps
        ;;
    "seed")
        docker-compose exec backend node src/seed.js
        ;;
    "clean")
        docker-compose down -v
        ;;
    "restart")
        docker-compose restart
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use './quick-commands.sh help' for available commands"
        ;;
esac
