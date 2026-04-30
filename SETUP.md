# Project Setup and Configuration

## Environment Variables

Create a `.env` file in the root directory:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=formation_db
DB_USER=root
DB_PASSWORD=root

JWT_SECRET=your-very-long-secret-key-change-this-in-production
JWT_EXPIRATION=86400000

CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Building the Project

### Using Gradle Wrapper (Recommended)

**On Windows:**
```bash
gradlew.bat bootRun
```

**On Linux/Mac:**
```bash
./gradlew bootRun
```

## Database Setup

### MySQL
```sql
CREATE DATABASE formation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE formation_db;

-- Roles
INSERT INTO role (nom) VALUES ('ADMINISTRATEUR');
INSERT INTO role (nom) VALUES ('RESPONSABLE');
INSERT INTO role (nom) VALUES ('SIMPLE UTILISATEUR');

-- Demo Domains
INSERT INTO domaine (libelle) VALUES ('Informatique');
INSERT INTO domaine (libelle) VALUES ('Finance');
INSERT INTO domaine (libelle) VALUES ('Mécanique');
INSERT INTO domaine (libelle) VALUES ('Comptabilité');

-- Demo Profiles
INSERT INTO profil (libelle) VALUES ('Informaticien (Bac+5)');
INSERT INTO profil (libelle) VALUES ('Informaticien (Bac+3)');
INSERT INTO profil (libelle) VALUES ('Gestionnaire');
INSERT INTO profil (libelle) VALUES ('Juriste');
INSERT INTO profil (libelle) VALUES ('Technicien Supérieur');

-- Demo Structures
INSERT INTO structure (libelle) VALUES ('Direction Centrale');
INSERT INTO structure (libelle) VALUES ('Direction Régionale Nord');
INSERT INTO structure (libelle) VALUES ('Direction Régionale Sud');

-- Demo Employers
INSERT INTO employeur (nomemployeur) VALUES ('Green Building');
INSERT INTO employeur (nomemployeur) VALUES ('Software Solutions Ltd');
INSERT INTO employeur (nomemployeur) VALUES ('Consulting Firm Inc');
```

### PostgreSQL
```sql
CREATE DATABASE formation_db ENCODING 'UTF8';

\c formation_db;

-- Roles
INSERT INTO role (nom) VALUES ('ADMINISTRATEUR');
INSERT INTO role (nom) VALUES ('RESPONSABLE');
INSERT INTO role (nom) VALUES ('SIMPLE UTILISATEUR');

-- Tables and data same as MySQL
```

## Running Tests

```bash
# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests FormationApplicationTests

# Run with coverage
./gradlew test jacocoTestReport
```

## Frontend Package Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

## Docker Setup (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: formation_db
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/formation_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root

  frontend:
    build: ./frontend
    ports:
      - "3000:3000" 
    depends_on:
      - backend

volumes:
  mysql_data:
```

Run with Docker:
```bash
docker-compose up
```

## Production Deployment

1. **Build backend JAR:**
   ```bash
   ./gradlew build -x test
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Configure for production:**
   - Update `application-prod.properties`
   - Set strong JWT secret
   - Configure proper database
   - Enable HTTPS
   - Set appropriate CORS origins

4. **Deploy JAR:**
   ```bash
   java -jar build/libs/formation-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
   ```

## Performance Tuning

### Database
- Add indexes on frequently queried columns
- Use pagination for large datasets
- Consider caching with Redis

### Backend
- Enable response compression
- Use async processing for heavy operations
- Implement rate limiting

### Frontend
- Enable gzip compression
- Optimize bundle size
- Lazy load routes
- Use production build

## Monitoring

### Enable actuator endpoints:
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized
```

Access:
- Health: `http://localhost:8080/actuator/health`
- Metrics: `http://localhost:8080/actuator/metrics`

## Troubleshooting

### Port already in use
```bash
# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Database connection failed
- Check credentials in application.properties
- Ensure database server is running
- Verify firewall settings

### Frontend CORS errors
- Check API URL configuration
- Verify CORS settings in SecurityConfig
- Check browser console for detailed errors
