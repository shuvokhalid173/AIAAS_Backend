# Auth Service

A production-ready authentication microservice built with Node.js, Express, MySQL, and Redis. Provides user registration, login, email verification, and JWT-based authentication.

## 🏗️ Architecture

```
┌─────────────────┐
│   Auth API      │ ← Express.js REST API
│   (Port 3001)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│MySQL │  │Redis │
│ DB   │  │Queue │
└──────┘  └───┬──┘
              │
      ┌───────▼────────┐
      │ Email Worker   │ ← Background job processor
      └────────────────┘
```

### Components

- **Auth API**: Main REST API for authentication operations
- **MySQL Database**: Stores user data, credentials, sessions, and permissions
- **Redis**: Job queue for async email processing
- **Email Worker**: Background worker for email verification and notifications

## 🚀 Quick Start with Docker

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

### Running the Application

1. **Clone and navigate to the project**
   ```bash
   cd auth-service
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and update JWT_SECRET and DB_PASSWORD
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Verify services are healthy**
   ```bash
   docker-compose ps
   curl http://localhost:3001/api/health
   ```

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Service health status

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "phone": "+1234567890"
  }
  ```

- `POST /api/auth/login` - User login
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```

- `POST /api/auth/update-user-status` - Update user verification status (internal)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | API server port | `3001` |
| `DB_HOST` | MySQL host | `mysql` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `auth_user` |
| `DB_PASSWORD` | MySQL password | **CHANGE IN PRODUCTION** |
| `DB_NAME` | Database name | `auth_db` |
| `JWT_SECRET` | JWT signing secret | **CHANGE IN PRODUCTION** |
| `JWT_EXPIRATION` | Token expiration | `24h` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `10` |
| `REDIS_HOST` | Redis host | `redis` |
| `REDIS_PORT` | Redis port | `6379` |

### Generating Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 64

# Generate database password
openssl rand -base64 32
```

## 🛠️ Development

### Local Development (without Docker)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up local MySQL and Redis**
   - MySQL on port 3307
   - Redis on port 6379
   - Import `auth_db_init.sql` to MySQL

3. **Configure .env for local development**
   ```env
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3307
   REDIS_HOST=localhost
   ```

4. **Run the application**
   ```bash
   # Start API server
   npm run dev

   # Start email worker (in another terminal)
   npm run emailVerifier
   ```

## 🐳 Docker Commands

### Build and Start
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build
```

### Monitoring
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-api
docker-compose logs -f email-worker

# Check service status
docker-compose ps
```

### Database Management
```bash
# Access MySQL shell
docker-compose exec mysql mysql -uroot -p

# Run SQL commands
docker-compose exec mysql mysql -uauth_user -p auth_db -e "SELECT * FROM auth_users;"

# Backup database
docker-compose exec mysql mysqldump -uroot -p auth_db > backup.sql

# Restore database
docker-compose exec -T mysql mysql -uroot -p auth_db < backup.sql
```

### Cleanup
```bash
# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## 📦 Production Deployment

### Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Change `DB_PASSWORD` to a strong password
- [ ] Use environment-specific `.env` files (not committed to git)
- [ ] Enable HTTPS/TLS termination (use reverse proxy like Nginx)
- [ ] Set up firewall rules (only expose necessary ports)
- [ ] Configure log aggregation and monitoring
- [ ] Set up automated backups for MySQL
- [ ] Review and adjust resource limits in docker-compose

### Deployment Steps

1. **Prepare production environment**
   ```bash
   # Create production .env
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Deploy with production config**
   ```bash
   docker-compose --env-file .env.production up -d
   ```

3. **Verify deployment**
   ```bash
   curl https://your-domain.com/api/health
   ```

4. **Set up monitoring**
   - Configure health check monitoring
   - Set up log aggregation (ELK, Datadog, etc.)
   - Configure alerting for service failures

### Scaling

```bash
# Scale email workers
docker-compose up -d --scale email-worker=3

# Scale API servers (requires load balancer)
docker-compose up -d --scale auth-api=3
```

## 🗄️ Database Schema

The database includes the following tables:
- `auth_users` - User accounts
- `auth_credentials` - Authentication credentials (password, OAuth)
- `auth_sessions` - Active user sessions
- `auth_refresh_tokens` - JWT refresh tokens
- `auth_orgs` - Organizations
- `auth_roles` - User roles
- `auth_permissions` - Granular permissions
- `aiaas_services` - AI services integration

See `auth_db_init.sql` for complete schema.

## 🔍 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Verify port availability
netstat -an | grep 3001
netstat -an | grep 3307
netstat -an | grep 6379
```

### Database connection errors
```bash
# Verify MySQL is healthy
docker-compose exec mysql mysqladmin ping -h localhost -uroot -p

# Check database exists
docker-compose exec mysql mysql -uroot -p -e "SHOW DATABASES;"
```

### Redis connection errors
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Email worker not processing jobs
```bash
# Check worker logs
docker-compose logs -f email-worker

# Verify Redis queue
docker-compose exec redis redis-cli
> KEYS *
> LLEN bull:emailQueue:wait
```

## 📝 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
