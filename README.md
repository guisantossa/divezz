# Splitwise Clone

This project is a clone of the popular expense tracking application, Splitwise. It is built using FastAPI for the backend and React with TypeScript for the frontend. The application allows users to manage their expenses, groups, and settlements in a user-friendly interface.

## Features

- User authentication (registration and login)
- Group management (create, update, delete groups)
- Expense management (add, view, and manage expenses)
- Settlement management between users
- Responsive design using TailwindCSS
- Interactive charts for expense visualization using Recharts

## Tech Stack

### Backend
- **FastAPI**: A modern web framework for building APIs with Python 3.11+
- **PostgreSQL**: A powerful, open-source relational database
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM) system for Python
- **Alembic**: Database migration tool for SQLAlchemy
- **Pydantic**: Data validation and settings management using Python type annotations
- **JWT**: JSON Web Tokens for secure authentication
- **Pytest**: Testing framework for Python

### Frontend
- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript
- **Vite**: A fast build tool and development server
- **TailwindCSS**: A utility-first CSS framework for rapid UI development
- **shadcn/ui**: A component library for building UI components
- **TanStack Query**: A powerful data-fetching library for React
- **react-hook-form**: A library for managing forms in React
- **Zod**: A TypeScript-first schema declaration and validation library
- **Lucide-react**: A collection of customizable icons for React
- **Recharts**: A composable charting library built on React components

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js (version 16 or higher)
- PostgreSQL
- Docker (optional)

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the database:
   - Create a PostgreSQL database and update the database URL in `backend/app/core/config.py`.

4. Run migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the FastAPI application:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the required Node packages:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Running Tests

### Backend Tests

To run the backend tests, navigate to the `backend` directory and run:
```bash
pytest
```

### Frontend Tests

To run the frontend tests, navigate to the `frontend` directory and run:
```bash
npm test
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Inspired by Splitwise for its user-friendly design and functionality.
- Thanks to the open-source community for the libraries and tools used in this project.