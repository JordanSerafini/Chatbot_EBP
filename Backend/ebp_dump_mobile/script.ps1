docker-compose up -d postgres_app
Start-Sleep -Seconds 300
docker-compose run --rm pg_dump
