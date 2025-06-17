# Finance Tracker Backend

A Spring Boot backend application for tracking personal finances, including budgets, income, and expenditures.

## Features

- Budget management with categories
- Income tracking
- Expenditure tracking
- Budget utilization tracking
- RESTful API endpoints
- Swagger/OpenAPI documentation
- In-memory H2 database for development

## Tech Stack

- Java 17
- Spring Boot 3.x
- Spring Data JPA
- H2 Database
- Lombok
- Swagger/OpenAPI
- Maven

## Project Structure

```
src/main/java/com/yoni/financetracker/
├── config/                         # Configuration classes
├── controller/                     # REST controllers
├── dto/                            # Data Transfer Objects
├── model/                          # Entity classes
├── repository/                     # Data access layer
├── service/                        # Business logic layer
└── FinanceTrackerApplication.java  # Main application class
```

## API Endpoints

### Budget Management
- `POST /api/budget` - Create or update a budget
- `GET /api/budget` - Get all budgets for a month
- `GET /api/budget/category` - Get budget for a specific category
- `PUT /api/budget/{id}` - Update a budget
- `DELETE /api/budget/{id}` - Delete a budget

### Income Management
- `POST /api/income` - Add new income
- `GET /api/income` - Get income records for a month
- `GET /api/income/total` - Get total income for a month
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income

### Expenditure Management
- `POST /api/expenditure` - Add new expenditure
- `GET /api/expenditure` - Get expenditures for a month
- `GET /api/expenditure/total` - Get total expenditure for a month
- `PUT /api/expenditure/{id}` - Update expenditure
- `DELETE /api/expenditure/{id}` - Delete expenditure

### Budget Tracking
- `GET /api/budget-tracking` - Get budget tracking information for a month

## Setup and Installation

1. **Prerequisites**
   - Java 17 or higher
   - Maven

2. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-tracker
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## Database

The application uses an in-memory H2 database for development. The H2 console is available at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:financetracker`
- Username: `sa`
- Password: `password`

## API Documentation

Swagger/OpenAPI documentation is available at:
- URL: `http://localhost:8080/swagger-ui.html`

## Development

### Project Structure Details

1. **Controllers**
   - Handle HTTP requests
   - Implement REST endpoints
   - Use DTOs for data transfer
   - Implement CORS for frontend communication

2. **Services**
   - Implement business logic
   - Manage transactions
   - Handle data validation
   - Coordinate between controllers and repositories

3. **Repositories**
   - Provide data access functionality
   - Extend Spring Data JPA repositories
   - Implement custom queries

4. **Models**
   - Define core business entities
   - Use JPA annotations for database mapping
   - Implement data validation

5. **DTOs**
   - Transfer data between frontend and backend
   - Implement validation constraints
   - Separate internal models from API contracts

### Key Features

- **Transaction Management**: All database operations are wrapped in transactions
- **Data Validation**: Input validation using Jakarta Validation
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Configured for frontend development
- **API Documentation**: Swagger/OpenAPI integration
- **Logging**: Detailed logging for debugging and monitoring

### Code Quality Tools

The project uses Checkstyle and Spotless for maintaining code quality and consistent formatting.

#### Backend Code Quality
Checkstyle enforces coding standards and best practices. Run the following command to check your code:
```bash
mvn checkstyle:check
```

Spotless automatically formats your code according to Google Java Style Guide. Use these commands:
```bash
# Format your code
mvn spotless:apply

# Check if your code is properly formatted
mvn spotless:check
```

The backend code quality tools are configured to:
- Enforce Google Java Style Guide
- Check for common coding issues
- Maintain consistent code formatting
- Remove unused imports
- Apply proper import ordering