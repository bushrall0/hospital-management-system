# HealSmart Database Setup Guide

## Prerequisites

1. **Oracle Database** (Express Edition or higher)
   - Download: https://www.oracle.com/database/technologies/xe-downloads.html
   - Ensure Oracle Database is running

2. **Oracle Instant Client** (for oracledb Node.js module)
   - Download: https://www.oracle.com/database/technologies/instant-client/downloads.html
   - Extract to a folder (e.g., `C:\oracle\instantclient_19_8`)

## Database Credentials

```
Username: project332
Password: 1234
Host: localhost/XEPDB1
```

## Setup Steps

### Step 1: Test Database Connection

```bash
npm run db:test
```

This will verify that:
- Oracle database is running
- Credentials are correct
- Connection can be established

### Step 2: Initialize Database Schema

```bash
npm run db:init
```

This will:
- Create all required tables (Users, Appointments, Medical_Records, Insurance, Payments, Lab_Tests, Prescriptions)
- Create sequences for auto-increment IDs
- Create indexes for performance
- Insert sample data for testing

## Database Schema Overview

### Tables Created

1. **Users** - Stores all system users (Admin, Doctor, Patient, Nurse, Lab Technician, Accountant, Manager)
2. **Appointments** - Patient appointments with doctors
3. **Medical_Records** - Patient medical history and visit records
4. **Insurance** - Patient insurance information
5. **Payments** - Billing and payment transactions
6. **Lab_Tests** - Laboratory test orders and results
7. **Prescriptions** - Medication prescriptions

### Sample Data

The initialization script creates sample users:
- **Admin:** admin@healsmart.com / admin123
- **Manager:** manager@healsmart.com / manager123
- **Doctors:**
  - ahmed.rashid@healsmart.com / doctor123 (Cardiology)
  - fatima.hassan@healsmart.com / doctor123 (Pediatrics)
  - mohammed.ali@healsmart.com / doctor123 (Orthopedics)
  - noura.abdullah@healsmart.com / doctor123 (Dermatology)
- **Patients:**
  - ali.ibrahim@email.com / patient123
  - maryam.khalid@email.com / patient123
  - khalid.ahmed@email.com / patient123
  - sara.mohammed@email.com / patient123

## Troubleshooting

### Connection Error: ORA-12154

**Problem:** TNS could not resolve the connect identifier

**Solution:**
1. Verify Oracle database is running
2. Check that XEPDB1 pluggable database exists
3. Ensure tnsnames.ora is configured correctly

### Error: DPI-1047

**Problem:** Oracle Client library cannot be loaded

**Solution:**
1. Install Oracle Instant Client
2. Add Instant Client directory to PATH environment variable
3. Restart your terminal/IDE

### Error: ORA-01017

**Problem:** Invalid username/password

**Solution:**
1. Verify credentials: project332 / 1234
2. Create user if not exists:
   ```sql
   CREATE USER project332 IDENTIFIED BY 1234;
   GRANT CONNECT, RESOURCE, DBA TO project332;
   ```

## Running the Application

Once database is set up:

```bash
npm run dev
```

Visit: http://localhost:3000

## Database Management

### View Tables
```sql
SELECT table_name FROM user_tables ORDER BY table_name;
```

### View Sample Data
```sql
SELECT * FROM Users;
SELECT * FROM Appointments;
SELECT * FROM Medical_Records;
```

### Reset Database
Run the initialization script again:
```bash
npm run db:init
```

This will drop all tables and recreate them with fresh sample data.

## Database File Locations

- **Schema:** `src/database/schema.sql`
- **Sample Data:** `src/database/seed.sql`
- **Connection:** `src/database/connection.ts`
- **Configuration:** `src/config/database.ts`

## Notes

- All database code is organized and well-commented
- SQL scripts are in separate files for easy maintenance
- Connection pooling is implemented for performance
- All IDs use Oracle sequences for auto-increment
- Foreign keys maintain referential integrity
