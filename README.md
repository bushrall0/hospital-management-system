# HealSmart Hospital Management System

A comprehensive web-based Hospital Management System built with React, TypeScript, and Oracle Database.

## Features

### Patient Portal
- Book appointments with doctors
- View appointment history
- Access medical records
- View lab test results
- Payment method management
- Insurance verification
- Customer service chat support

### Admin Dashboard
- User management
- Appointment oversight
- Insurance provider management
- System administration

### Doctor Dashboard
- View scheduled appointments
- Update appointment status
- Add medical records for patients
- Request lab tests

### Lab Technician Dashboard
- View pending lab test requests
- Upload test results
- Manage test records

### Accountant Dashboard
- View payment transactions
- Generate financial reports
- Monitor revenue statistics

### Marketing Dashboard
- Send promotional email campaigns (UI)
- Target specific patient groups

### Customer Service
- Chat support system
- Manage patient inquiries
- Resolve support tickets

## Technology Stack

- **Frontend**: React 19.2, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Oracle Database 21c XE
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or higher)
- Oracle Database 21c XE
- npm or yarn

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update with your Oracle database credentials:
     ```
     DB_USER=your_database_username
     DB_PASSWORD=your_database_password
     DB_CONNECTION_STRING=localhost/XEPDB1
     ```

3. Set up the database:
   - Follow instructions in `DATABASE_SETUP.md`
   - Run the database migration scripts in the `src/database/migrations/` folder

4. Start the backend server:
   ```bash
   npm run server
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:3000`

## Default Login Credentials

### Admin
- Email: admin@healsmart.com
- Password: admin123

### Doctor
- Email: doctor@healsmart.com
- Password: doctor123

### Patient
- Email: patient@healsmart.com
- Password: patient123

### Lab Technician
- Email: labtech@healsmart.com
- Password: labtech123

### Accountant
- Email: accountant@healsmart.com
- Password: accountant123

### Marketing
- Email: marketing@healsmart.com
- Password: marketing123

### Customer Service
- Email: customerservice@healsmart.com
- Password: customerservice123

## Documentation

- `DATABASE_SETUP.md` - Database setup and configuration
- `ORACLE_DATABASE_INTEGRATION.md` - Oracle database integration guide

## Project Structure

```
hospital-management-system/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── doctor/      # Doctor dashboard pages
│   │   ├── patient/     # Patient portal pages
│   │   ├── accountant/  # Accountant dashboard pages
│   │   ├── marketing/   # Marketing dashboard pages
│   │   └── customerService/ # Customer service pages
│   ├── services/        # API service functions
│   ├── database/        # Database connection and migrations
│   └── types.ts         # TypeScript type definitions
├── server/              # Express.js backend
└── about the project/   # Project documentation
```

## License

This project is for educational purposes.
