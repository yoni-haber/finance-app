# Finance Tracker

A full-stack application for tracking personal finances, including budgets, income, and expenditures. The backend is built with Spring Boot (Java), and the frontend is built with React (TypeScript) and Material-UI.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [How the Frontend and Backend Communicate](#how-the-frontend-and-backend-communicate)
- [API Overview](#api-overview)
- [Development and Code Quality](#development-and-code-quality)
- [Additional Resources](#additional-resources)

---

## Features

- Budget management with categories
- Income tracking and management
- Expenditure tracking and management
- Budget utilisation tracking
- Responsive dashboard with financial overview
- Dark/Light theme support
- Real-time data updates
- RESTful API endpoints
- Swagger/OpenAPI documentation
- In-memory H2 database for development
- Type safety with TypeScript

---

## Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- H2 Database (in-memory, for development)
- Lombok
- Swagger/OpenAPI
- Maven

**Frontend:**
- React 18
- TypeScript
- Material-UI (MUI)
- React Router v6
- Axios
- Vite
- ESLint, Prettier

---

## Project Structure

```
finance-tracker/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/              # API integration layer (handles all HTTP requests to backend)
│   │   ├── components/       # Reusable UI components (forms, lists, dashboard, etc.)
│   │   ├── context/          # React context providers (e.g., theme management)
│   │   ├── pages/            # Top-level page components for routing
│   │   ├── types/            # TypeScript type definitions for app data
│   │   ├── App.tsx           # Root React component, sets up routes and layout
│   │   └── main.tsx          # Entry point for the React app (mounts to the DOM)
│   └── package.json          # Frontend dependencies and scripts
├── src/
│   └── main/
│       ├── java/
│       │   └── com/yoni/financetracker/
│       │       ├── config/          # Spring Boot configuration (e.g., CORS)
│       │       ├── controller/      # REST API controllers (handle HTTP requests)
│       │       ├── dto/             # Data Transfer Objects (API request/response shapes)
│       │       ├── exception/       # Global error handling
│       │       ├── model/           # JPA entities (database models)
│       │       ├── repository/      # Data access layer (Spring Data JPA interfaces)
│       │       ├── service/         # Business logic layer
│       │       └── FinanceTrackerApplication.java  # Main Spring Boot entry point
│       └── resources/
│           └── application.properties  # Backend configuration (e.g., DB settings)
├── pom.xml                    # Maven build configuration for backend
└── mvnw, mvnw.cmd             # Maven wrapper scripts
```

---

## Setup and Installation

### Prerequisites
- **Backend:** Java 17 or higher, Maven
- **Frontend:** Node.js 16 or higher, npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd finance-tracker
```

### 2. Backend Setup
```bash
mvn clean install
mvn spring-boot:run
```
- The backend will start at `http://localhost:8080`
- H2 database console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:financetracker`, Username: `sa`, Password: `password`)
- Swagger API docs: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- The frontend will start at `http://localhost:5173`

---

## Usage

1. **Start the backend** (Spring Boot):
   - Runs on port 8080 by default.
2. **Start the frontend** (React):
   - Runs on port 5173 by default.
3. **Access the application**:
   - Open your browser and go to `http://localhost:5173`
   - The frontend will communicate with the backend API at `http://localhost:8080`

---

## Frontend and Backend Communication

- **API Calls:**
  - The frontend uses Axios to make HTTP requests to the backend's RESTful API endpoints (e.g., `/api/income`, `/api/budget`).
  - All API integration is centralised in the `frontend/src/api/` directory for maintainability.
- **CORS (Cross-Origin Resource Sharing):**
  - The backend is configured to allow requests from the frontend development server (`http://localhost:5173`).
  - This is set in the backend's `WebConfig.java` using Spring's CORS support.
- **Data Format:**
  - Data is exchanged in JSON format.
  - TypeScript interfaces in the frontend mirror the backend's DTOs and models for type safety.
- **Error Handling:**
  - The backend returns structured error responses for validation and server errors.
  - The frontend displays user-friendly error messages and handles loading states.

**Example Communication Flow:**
1. User submits a new income entry in the frontend form.
2. The frontend sends a POST request to `/api/income` with the income data as JSON.
3. The backend validates, saves the data, and responds with the created record or an error.
4. The frontend updates the UI accordingly.

---

## API Overview

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

**For full API documentation and example requests/responses, visit:**
- Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## Development and Code Quality

### Backend
- **Code Style:** Enforced by Checkstyle and Spotless (Google Java Style Guide).
- **Validation:** Input validation using Jakarta Validation annotations.
- **Error Handling:** Centralised exception handling with meaningful error messages.
- **Run code quality checks:**
  ```bash
  mvn checkstyle:check
  mvn spotless:apply   # Format code
  mvn spotless:check   # Check formatting
  ```

### Frontend
- **Code Style:** Enforced by ESLint and Prettier.
- **Type Safety:** All code is written in TypeScript.
- **Component Architecture:** Functional components with hooks, context for global state, and feature-based structure.
- **Run code quality checks:**
  ```bash
  npm run lint
  npm run lint:fix
  npm run format
  npm run format:check
  npm run type-check
  ```

---

## Additional Resources

- **Spring Boot:** [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- **React:** [React Documentation](https://react.dev/)
- **Material-UI:** [Material-UI Documentation](https://mui.com/)
- **TypeScript:** [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **REST APIs:** [RESTful API Tutorial](https://restfulapi.net/)

### Key Concepts Explained
- **DTO (Data Transfer Object):** Used to transfer data between frontend and backend, ensuring only necessary data is sent.
- **Entity:** Represents a table in the database (backend model).
- **Component:** A reusable piece of UI in React.
- **Context:** A way to share state globally in React (e.g., theme preference).
- **CORS:** Allows the frontend (on a different port) to access backend APIs securely during development.
- **Environment Variables:** Used to configure API URLs and secrets (consider using `.env` files for production).
