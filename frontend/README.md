# Finance Tracker Frontend

A React-based frontend application for tracking personal finances, built with TypeScript, Material-UI, and modern React practices.

## Features

- Responsive dashboard with financial overview
- Income tracking and management
- Expense tracking and management
- Budget planning and monitoring
- Dark/Light theme support
- Real-time data updates
- Material-UI components for modern UI
- TypeScript for type safety

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- React Router v6
- Axios for API calls
- Vite for build tooling
- ESLint for code quality

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API integration layer
│   ├── assets/           # Static assets (images, icons)
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Application entry point
├── public/               # Public static files
└── package.json          # Project dependencies and scripts
```

## Component Structure

### Core Components
- `Dashboard.tsx`: Main dashboard with financial overview
  - Displays total income, expenses, and net balance
  - Shows budget utilization chart
  - Provides month/year selection
  - Links to add income, expenses, and budgets

- `IncomeList.tsx`: Income transaction list and management
  - Lists all income entries for the current month
  - Provides edit and delete functionality
  - Shows total income amount
  - Handles loading and error states

- `ExpenditureList.tsx`: Expense transaction list and management
  - Lists all expense entries for the current month
  - Provides edit and delete functionality
  - Shows total expense amount
  - Handles loading and error states

- `BudgetList.tsx`: Budget planning and tracking
  - Lists all budget entries for the current month
  - Provides edit and delete functionality
  - Shows total budget amount
  - Handles loading and error states

- `BudgetTracking.tsx`: Budget utilization monitoring
  - Shows budget vs spent amounts for each category
  - Visual progress bars for budget utilization
  - Color-coded indicators for over-budget categories
  - Handles loading and error states

### Form Components
- `IncomeForm.tsx`: Income entry form
  - Date selection
  - Description input
  - Amount input with validation
  - Error handling and loading states

- `ExpenditureForm.tsx`: Expense entry form
  - Date selection
  - Description input
  - Amount input with validation
  - Category selection
  - Error handling and loading states

- `BudgetForm.tsx`: Budget planning form
  - Amount input with validation
  - Category selection
  - Automatic date assignment
  - Error handling and loading states

### Utility Components
- `ThemeToggle.tsx`: Dark/Light theme switcher
  - Uses ThemeContext for state management
  - Provides visual feedback with icons
  - Persists theme preference

## Data Flow

1. **API Integration**
   - All API calls are centralized in the `api` directory
   - Uses Axios for HTTP requests
   - Handles error responses and loading states

2. **State Management**
   - Local state with React hooks (useState, useEffect)
   - Context API for global state (ThemeContext)
   - Props for component communication

3. **Component Communication**
   - Parent-child communication through props
   - Callback functions for state updates
   - Context for global state sharing

4. **Data Validation**
   - Form validation in form components
   - Type checking with TypeScript
   - Error handling and user feedback

## Type Definitions

The application uses TypeScript interfaces for type safety:

```typescript
// Core financial types
interface Income {
    id: number;
    amount: number;
    date: string;
    description: string;
}

interface Expenditure {
    id: number;
    amount: number;
    date: string;
    description: string;
    category: Category;
}

interface Budget {
    id: number;
    amount: number;
    category: Category;
    month: string;
}

// Category enum
enum Category {
    FOOD = 'FOOD',
    TRANSPORT = 'TRANSPORT',
    ENTERTAINMENT = 'ENTERTAINMENT',
    BILLS = 'BILLS',
    SHOPPING = 'SHOPPING',
    OTHER = 'OTHER'
}
```

## Setup and Installation

1. **Prerequisites**
   - Node.js 16 or higher
   - npm or yarn

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:5173`

## Development

### Key Features

1. **Component Architecture**
   - Functional components with hooks
   - Custom hooks for reusable logic
   - Context API for state management
   - Material-UI for consistent styling

2. **State Management**
   - React Context for global state
   - Local state with useState
   - Custom hooks for complex state logic

3. **API Integration**
   - Axios for HTTP requests
   - Type-safe API calls
   - Error handling and loading states

4. **Routing**
   - React Router for navigation
   - Protected routes
   - Nested routing support

5. **Styling**
   - Material-UI components
   - Custom theme support
   - Responsive design
   - Dark/Light mode

### Best Practices

1. **Code Organization**
   - Feature-based directory structure
   - Separation of concerns
   - Reusable components
   - Type safety with TypeScript

2. **Performance**
   - React.memo for component optimization
   - useMemo and useCallback for expensive operations
   - Lazy loading for routes
   - Efficient re-rendering

3. **Error Handling**
   - Try-catch blocks for API calls
   - Error boundaries
   - User-friendly error messages
   - Loading states

4. **Testing**
   - Component testing
   - Integration testing
   - API mocking
   - User interaction testing

### Code Quality Tools

The frontend uses ESLint, Prettier, and TypeScript for code quality. Run these commands from the `frontend` directory:

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check

# Check TypeScript types
npm run type-check
```

The frontend code quality tools are configured to:
- Enforce TypeScript best practices
- Maintain consistent code formatting
- Check for React hooks rules
- Prevent common JavaScript/TypeScript errors
- Ensure consistent code style across the codebase