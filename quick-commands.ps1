# Quick Commands for Orthopedic Shop (PowerShell)
# Usage: .\quick-commands.ps1 [command]

function Show-Commands {
    Write-Host "🏥  Shop - Quick Commands" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "🔧 Development:" -ForegroundColor Yellow
    Write-Host "  .\quick-commands.ps1 up         - Start all services"
    Write-Host "  .\quick-commands.ps1 down       - Stop all services"
    Write-Host "  .\quick-commands.ps1 logs       - View logs"
    Write-Host "  .\quick-commands.ps1 ps         - Show status"
    Write-Host ""
    
    Write-Host "🐳 Docker:" -ForegroundColor Yellow
    Write-Host "  .\quick-commands.ps1 up         - Start Docker Compose"
    Write-Host "  .\quick-commands.ps1 down       - Stop Docker Compose"
    Write-Host "  .\quick-commands.ps1 clean      - Remove containers"
    Write-Host "  .\quick-commands.ps1 rebuild    - Rebuild images"
    Write-Host ""
    
    Write-Host "📊 Monitoring:" -ForegroundColor Yellow
    Write-Host "  .\quick-commands.ps1 health     - Health check all services"
    Write-Host "  .\quick-commands.ps1 ps         - Container status"
    Write-Host ""
    
    Write-Host "🔑 Authentication:" -ForegroundColor Green
    Write-Host "  Admin Email:    admin@senmedicaltech.com"
    Write-Host "  Admin Password: admin123"
    Write-Host ""
    
    Write-Host "📍 URLs:" -ForegroundColor Green
    Write-Host "  Frontend:  http://localhost:3000"
    Write-Host "  API:       http://localhost:5000/api"
    Write-Host "  Health:    http://localhost:5000/api/health"
    Write-Host "  MongoDB:   mongodb://localhost:27017"
    Write-Host ""
}

function Health-Check {
    Write-Host "🏥 Running Health Check..." -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "📦 Services Status:" -ForegroundColor Yellow
    docker-compose ps
    Write-Host ""
    
    Write-Host "📊 API Health:" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing
        Write-Host $response.Content -ForegroundColor Green
    } catch {
        Write-Host "❌ API is not responding" -ForegroundColor Red
    }
    Write-Host ""
}

function Start-Services {
    Write-Host "Starting services..." -ForegroundColor Cyan
    docker-compose up -d
    Write-Host "✅ Services started" -ForegroundColor Green
    Health-Check
}

function Stop-Services {
    Write-Host "Stopping services..." -ForegroundColor Cyan
    docker-compose down
    Write-Host "✅ Services stopped" -ForegroundColor Green
}

function View-Logs {
    Write-Host "Viewing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    docker-compose logs -f
}

function Show-Status {
    docker-compose ps
}

function Run-Seed {
    Write-Host "Running seed..." -ForegroundColor Cyan
    docker-compose exec backend node src/seed.js
}

function Clean-All {
    Write-Host "Cleaning up..." -ForegroundColor Cyan
    docker-compose down -v
    Write-Host "✅ Cleaned" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "Restarting services..." -ForegroundColor Cyan
    docker-compose restart
    Write-Host "✅ Services restarted" -ForegroundColor Green
    Health-Check
}

# Main logic
$command = $args[0]

switch ($command) {
    "help" { Show-Commands }
    "health" { Health-Check }
    "up" { Start-Services }
    "down" { Stop-Services }
    "logs" { View-Logs }
    "ps" { Show-Status }
    "seed" { Run-Seed }
    "clean" { Clean-All }
    "restart" { Restart-Services }
    "rebuild" { docker-compose build --no-cache }
    { $null -eq $_ } { Show-Commands }
    default {
        Write-Host "Unknown command: $command" -ForegroundColor Red
        Write-Host "Use 'help' parameter for available commands" -ForegroundColor Yellow
    }
}
