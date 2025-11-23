# Oracle Database Integration Guide
## HealSmart Hospital Management System

This guide explains how to integrate and use Oracle Database with the HealSmart application.

---

## 📋 Prerequisites

Before proceeding, ensure you have the following installed:

1. **Oracle Database** (Oracle XE 21c or later)
   - Download from: https://www.oracle.com/database/technologies/xe-downloads.html
   - Default installation creates `XEPDB1` pluggable database

2. **Oracle Instant Client** (for Node.js oracledb package)
   - Download from: https://www.oracle.com/database/technologies/instant-client/downloads.html
   - Extract to a directory (e.g., `C:\oracle\instantclient_21_13`)

3. **Node.js** (v18 or later)
   - Already installed for running React

---

## 🗄️ Database Setup

### Step 1: Create Database User

Connect to Oracle as SYSDBA and create the project user:

```sql
-- Connect as SYSDBA
sqlplus sys/your_password@localhost/XEPDB1 as sysdba

-- Create user
CREATE USER project332 IDENTIFIED BY 1234;

-- Grant necessary privileges
GRANT CONNECT, RESOURCE TO project332;
GRANT CREATE SESSION TO project332;
GRANT CREATE TABLE TO project332;
GRANT CREATE SEQUENCE TO project332;
GRANT UNLIMITED TABLESPACE TO project332;

-- Exit
EXIT;
```

### Step 2: Initialize Database Schema

Run the initialization script to create all tables:

```bash
npm run db:init
```

This will:
- Create all necessary tables (Users, Appointments, Medical_Records, Lab_Tests, Insurance, Payments, Prescriptions)
- Create sequences for auto-increment IDs
- Create indexes for performance
- Seed initial data

### Step 3: Test Database Connection

Verify the database connection is working:

```bash
npm run db:test
```

You should see:
```
✅ Oracle Database Connection Pool initialized successfully
✅ Database connection test successful
```

---

## 🚀 Running the Application with Database

### Step 1: Install Dependencies

Install the new server dependencies:

```bash
npm install
```

This will install:
- `express` - Web framework for API server
- `cors` - Enable cross-origin requests
- `@types/express` - TypeScript definitions
- `@types/cors` - TypeScript definitions
- `concurrently` - Run multiple npm scripts simultaneously

### Step 2: Start Both Frontend and Backend

Run the full application with database:

```bash
npm run dev:all
```

This command runs:
- **Frontend (React + Vite)**: http://localhost:5173
- **Backend (Express API)**: http://localhost:5000

Alternatively, run them separately:

```bash
# Terminal 1 - Backend API Server
npm run server

# Terminal 2 - Frontend React App
npm run dev
```

### Step 3: Verify API Server

Check if the API server is running:

Open browser to: http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "message": "HealSmart API Server is running"
}
```

---

## 📁 Project Structure

```
hospital-management-system/
├── server/
│   └── index.ts                 # Express API server
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── database/
│   │   ├── connection.ts        # Oracle connection pool
│   │   ├── schema.sql           # Database schema
│   │   ├── seed.sql             # Initial data
│   │   ├── init.ts              # Initialization script
│   │   └── test-connection.ts   # Connection test script
│   ├── services/
│   │   ├── userService.ts           # User operations
│   │   ├── appointmentService.ts    # Appointment operations
│   │   ├── labTestService.ts        # Lab test operations
│   │   ├── medicalRecordService.ts  # Medical record operations
│   │   ├── insuranceService.ts      # Insurance operations
│   │   └── paymentService.ts        # Payment operations
│   └── contexts/
│       └── AppContext.tsx       # React context (will use API calls)
└── package.json
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Patient registration

### Users & Staff
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Add new staff member
- `DELETE /api/staff/:id` - Delete staff member
- `GET /api/patients` - Get all patients

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id` - Update appointment status
- `DELETE /api/appointments/:id` - Delete appointment

### Lab Tests
- `GET /api/lab-tests` - Get all lab tests
- `POST /api/lab-tests` - Create lab test
- `PATCH /api/lab-tests/:id` - Update lab test

### Medical Records
- `GET /api/medical-records` - Get all medical records
- `POST /api/medical-records` - Create medical record

### Insurance
- `GET /api/insurance` - Get all insurance records
- `POST /api/insurance` - Create insurance record

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment

---

## 🔧 Configuration

### Database Configuration

Edit `src/config/database.ts`:

```typescript
export const dbConfig = {
  user: 'project332',         // Oracle user
  password: '1234',            // Oracle password
  connectString: 'localhost/XEPDB1',  // Connection string
  poolMin: 2,                  // Minimum connections
  poolMax: 10,                 // Maximum connections
  poolIncrement: 2,            // Connection increment
};
```

### Server Port

The API server runs on port **5000** by default. To change it:

```bash
# Windows
set PORT=3001 && npm run server

# Linux/Mac
PORT=3001 npm run server
```

---

## 🎯 Next Steps

### TODO: Update Frontend to Use API

The frontend currently uses `localStorage`. We need to update `AppContext.tsx` to make API calls instead:

```typescript
// Instead of:
const [staff, setStaff] = useLocalStorage<Staff[]>('staff', INITIAL_STAFF);

// Use:
const [staff, setStaff] = useState<Staff[]>([]);

useEffect(() => {
  // Fetch from API
  fetch('http://localhost:5000/api/staff')
    .then(res => res.json())
    .then(data => setStaff(data.staff));
}, []);
```

This will be implemented in the next batch.

---

## 🐛 Troubleshooting

### Error: Cannot find module 'oracledb'

**Solution**: Install Oracle Instant Client and configure it:

1. Download Instant Client
2. Extract to `C:\oracle\instantclient_21_13`
3. Add to PATH environment variable
4. Uncomment line in `src/database/connection.ts`:
   ```typescript
   oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_13' });
   ```

### Error: ORA-12154: TNS:could not resolve the connect identifier

**Solution**: Check your `connectString` in `database.ts`:
- Should be: `localhost/XEPDB1` or `localhost:1521/XEPDB1`
- Verify Oracle listener is running: `lsnrctl status`

### Error: ORA-01017: invalid username/password

**Solution**:
1. Verify user exists: `sqlplus project332/1234@localhost/XEPDB1`
2. If not, recreate the user (see Step 1 above)

### Port Already in Use

If port 5000 is already in use:

```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port
set PORT=5001 && npm run server
```

---

## 📊 Database Schema Overview

### Users Table
Stores all system users (Admin, Doctor, Patient, Lab Technician)

### Appointments Table
Stores patient appointments with doctors

### Medical_Records Table
Stores patient medical records from visits

### Lab_Tests Table
Stores laboratory test orders and results

### Insurance Table
Stores patient insurance information

### Payments Table
Stores billing and payment information

### Prescriptions Table
Stores medication prescriptions

---

## ✅ Testing Checklist

- [ ] Oracle Database installed and running
- [ ] Database user `project332` created with proper permissions
- [ ] Database schema initialized (`npm run db:init`)
- [ ] Database connection test passed (`npm run db:test`)
- [ ] npm dependencies installed
- [ ] API server starts successfully (`npm run server`)
- [ ] API health check returns OK
- [ ] React frontend connects to API

---

## 📝 Notes

- **Security**: In production, passwords should be hashed (bcrypt)
- **Environment Variables**: Use `.env` file for sensitive data
- **CORS**: Currently allows all origins; restrict in production
- **Connection Pooling**: Configured for optimal performance
- **Error Handling**: All service methods include try-catch blocks
- **Transaction Management**: Auto-commit enabled for simplicity

---

*Last Updated: 2025-11-22*
*Project: HealSmart Hospital Management System*
