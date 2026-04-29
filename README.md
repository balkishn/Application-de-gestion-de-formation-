# Formation Management System

A comprehensive web application for managing training sessions, participants, and trainers for the "Excellence Training" center.

## Project Overview

This is a full-stack application built with:
- **Backend**: Spring Boot 3.2, Spring Data JPA, Spring Security, JWT
- **Frontend**: React 18, React Router, Axios
- **Database**: MySQL or PostgreSQL
- **Build Tool**: Gradle

## Features

### User Management
- Role-based access control (Administrator, Manager, User)
- JWT-based authentication
- User account management

### Training Management
- Create, read, update, delete formations
- Assign trainers and participants
- Track training budget and duration
- Organize by domain and year

### Participant Management
- Register participants
- Assign to structures and profiles
- Track contact information

### Trainer Management
- Manage internal and external trainers
- Assign to employer organizations
- Contact information management

### Administrative Features
- Domain and profile management
- Structure management
- Employer management
- User administration

### Analytics
- Training statistics
- Budget tracking
- Participant count

## Project Structure

```
formation/
├── src/
│   ├── main/
│   │   ├── java/abh/formation/
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repository/       # Spring Data repositories
│   │   │   ├── service/          # Business logic
│   │   │   ├── controller/       # REST endpoints
│   │   │   ├── dto/              # Data transfer objects
│   │   │   ├── security/         # Security configuration & JWT
│   │   │   └── FormationApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── frontend/
    ├── src/
    │   ├── pages/               # Page components
    │   ├── components/          # Reusable components
    │   ├── services/            # API services
    │   ├── styles/              # CSS files
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Backend Setup

1. **Prerequisites**
   - Java 17+
   - MySQL 8.0+ or PostgreSQL 12+
   - Gradle

2. **Database Configuration**
   - Create database: `CREATE DATABASE formation_db;`
   - Update `application.properties` with your database credentials
   
   For MySQL:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/formation_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
   
   For PostgreSQL:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/formation_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

3. **Run Backend**
   ```bash
   ./gradlew bootRun
   ```
   
   The backend will start on `http://localhost:8080`

4. **Initialize Demo Data**
   After first startup, run the initialization script to populate demo roles:
   ```sql
   INSERT INTO role (nom) VALUES ('ADMINISTRATEUR');
   INSERT INTO role (nom) VALUES ('RESPONSABLE');
   INSERT INTO role (nom) VALUES ('SIMPLE UTILISATEUR');
   ```

   Create demo users:
   ```sql
   -- Password: password (hashed with BCrypt)
   INSERT INTO utilisateur (login, password, idRole, is_active) 
   VALUES ('admin', '$2a$10$...', 1, true);
   INSERT INTO utilisateur (login, password, idRole, is_active) 
   VALUES ('manager', '$2a$10$...', 2, true);
   INSERT INTO utilisateur (login, password, idRole, is_active) 
   VALUES ('user', '$2a$10$...', 3, true);
   ```

### Frontend Setup

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   The frontend will start on `http://localhost:3000` or `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate token

### Participants
- `GET /api/participants` - List all participants
- `POST /api/participants` - Create participant
- `GET /api/participants/{id}` - Get participant by ID
- `PUT /api/participants/{id}` - Update participant
- `DELETE /api/participants/{id}` - Delete participant
- `GET /api/participants/structure/{structureId}` - Get by structure

### Formations
- `GET /api/formations` - List all formations
- `POST /api/formations` - Create formation
- `GET /api/formations/{id}` - Get formation by ID
- `PUT /api/formations/{id}` - Update formation
- `DELETE /api/formations/{id}` - Delete formation
- `GET /api/formations/domaine/{domaineId}` - Get by domain
- `GET /api/formations/annee/{annee}` - Get by year

### Formateurs
- `GET /api/formateurs` - List all trainers
- `POST /api/formateurs` - Create trainer
- `GET /api/formateurs/{id}` - Get trainer by ID
- `PUT /api/formateurs/{id}` - Update trainer
- `DELETE /api/formateurs/{id}` - Delete trainer
- `GET /api/formateurs/type/{type}` - Get by type (INTERNE/EXTERNE)

### Reference Data
- `/api/domaines` - Domains
- `/api/profils` - Profiles
- `/api/structures` - Structures
- `/api/employeurs` - Employers
- `/api/utilisateurs` - Users

## Default Credentials

```
Username: admin
Password: password
Role: ADMINISTRATEUR

Username: manager
Password: password
Role: RESPONSABLE

Username: user
Password: password
Role: SIMPLE UTILISATEUR
```

## Key Technologies

### Backend
- **Spring Boot 3.2.0** - Framework
- **Spring Data JPA** - Database access
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **Lombok** - Reduce boilerplate code
- **Hibernate** - ORM framework

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool & dev server
- **CSS3** - Styling

## Database Schema

The application uses 8 main tables:
- `utilisateur` - Users with roles
- `role` - User roles
- `domaine` - Training domains
- `profil` - Participant profiles
- `structure` - Organization structures
- `formateur` - Trainers
- `employeur` - Employer organizations
- `formation` - Training sessions
- `formation_participant` - Many-to-many relationship

## Security Features

- JWT token-based authentication
- Role-based access control (RBAC)
- Password encryption (BCrypt)
- CORS configuration for frontend integration
- Secure token validation
- Automatic token expiration

## Error Handling

All endpoints return standardized responses:

```json
{
  "success": true/false,
  "message": "Operation message",
  "data": {}
}
```

## Development Guidelines

### Code Style
- Follow Java conventions with Lombok annotations
- Use DTOs for API responses
- Keep business logic in services
- Use controllers for HTTP handling only

### Database Changes
- Use Hibernate's `ddl-auto=update` for development
- Create migrations for production deployments
- Always validate input data

### Frontend
- Use functional components with hooks
- Implement proper error handling
- Load data on component mount
- Use CSS modules for component-specific styles

## Troubleshooting

### Backend won't start
- Check database connection
- Verify Java version (17+)
- Check port 8080 is not in use
- Review application.properties configuration

### Frontend won't connect to backend
- Ensure backend is running on port 8080
- Check CORS configuration matches frontend URL
- Verify Authorization header contains Bearer token

### Database issues
- Ensure database exists and is accessible
- Check user credentials in application.properties
- Verify database dialect matches (MySQL8Dialect, PostgreSQLDialect)

## Future Enhancements

- Export data to PDF/Excel
- Email notifications
- Advanced analytics and reporting
- Multi-language support
- Calendar view for formations
- Attendance tracking
- Certificate generation
- Mobile application

## License

This project is proprietary and developed for Excellence Training center.

## Contact & Support

For issues and questions, contact the development team.
