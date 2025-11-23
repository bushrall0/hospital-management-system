-- ============================================================
-- HealSmart Hospital Management System
-- Manual Database Initialization Script
-- Run this file using: sqlplus project332/1234@localhost/XEPDB1
-- Or: @c:\path\to\init-manual.sql
-- ============================================================

-- Clean up existing objects
DROP TABLE Payments CASCADE CONSTRAINTS PURGE;
DROP TABLE Lab_Tests CASCADE CONSTRAINTS PURGE;
DROP TABLE Prescriptions CASCADE CONSTRAINTS PURGE;
DROP TABLE Medical_Records CASCADE CONSTRAINTS PURGE;
DROP TABLE Appointments CASCADE CONSTRAINTS PURGE;
DROP TABLE Insurance CASCADE CONSTRAINTS PURGE;
DROP TABLE Users CASCADE CONSTRAINTS PURGE;

DROP SEQUENCE user_seq;
DROP SEQUENCE appointment_seq;
DROP SEQUENCE medical_record_seq;
DROP SEQUENCE insurance_seq;
DROP SEQUENCE payment_seq;
DROP SEQUENCE lab_test_seq;
DROP SEQUENCE prescription_seq;

-- Create Sequences
CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE appointment_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE medical_record_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE insurance_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE lab_test_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE prescription_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- Create Users Table
CREATE TABLE Users (
  user_id         NUMBER PRIMARY KEY,
  full_name       VARCHAR2(100) NOT NULL,
  email           VARCHAR2(100) UNIQUE NOT NULL,
  password_hash   VARCHAR2(255) NOT NULL,
  role            VARCHAR2(20) NOT NULL CHECK (role IN ('Admin', 'Doctor', 'Patient', 'Lab Technician')),
  phone_number    VARCHAR2(20),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active       CHAR(1) DEFAULT '1' CHECK (is_active IN ('0', '1')),
  date_of_birth   DATE,
  department      VARCHAR2(50),
  CONSTRAINT email_format_check CHECK (REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'))
);

CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_role ON Users(role);

-- Create Appointments Table
CREATE TABLE Appointments (
  appointment_id  NUMBER PRIMARY KEY,
  patient_id      NUMBER NOT NULL,
  doctor_id       NUMBER NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR2(10) NOT NULL,
  status          VARCHAR2(20) DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed', 'Cancelled')),
  department      VARCHAR2(50),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_appointments_patient ON Appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON Appointments(doctor_id);
CREATE INDEX idx_appointments_date ON Appointments(appointment_date);

-- Create Medical_Records Table
CREATE TABLE Medical_Records (
  record_id       NUMBER PRIMARY KEY,
  patient_id      NUMBER NOT NULL,
  doctor_id       NUMBER NOT NULL,
  appointment_id  NUMBER,
  visit_date      DATE NOT NULL,
  diagnosis       CLOB NOT NULL,
  treatment       CLOB NOT NULL,
  prescription    CLOB,
  notes           CLOB,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_medical_record_patient FOREIGN KEY (patient_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_medical_record_doctor FOREIGN KEY (doctor_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_medical_record_appointment FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE SET NULL
);

CREATE INDEX idx_medical_records_patient ON Medical_Records(patient_id);
CREATE INDEX idx_medical_records_doctor ON Medical_Records(doctor_id);

-- Create Insurance Table
CREATE TABLE Insurance (
  insurance_id      NUMBER PRIMARY KEY,
  patient_id        NUMBER NOT NULL,
  provider_name     VARCHAR2(100) NOT NULL,
  policy_number     VARCHAR2(50) NOT NULL,
  expiration_date   DATE NOT NULL,
  is_valid          CHAR(1) DEFAULT '1' CHECK (is_valid IN ('0', '1')),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_insurance_patient FOREIGN KEY (patient_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  CONSTRAINT unique_policy UNIQUE (patient_id, policy_number)
);

CREATE INDEX idx_insurance_patient ON Insurance(patient_id);

-- Create Payments Table
CREATE TABLE Payments (
  payment_id      NUMBER PRIMARY KEY,
  patient_id      NUMBER NOT NULL,
  amount          NUMBER(10,2) NOT NULL,
  payment_method  VARCHAR2(20) DEFAULT 'Card',
  payment_status  VARCHAR2(20) DEFAULT 'Success' CHECK (payment_status IN ('Success', 'Failed')),
  transaction_id  VARCHAR2(100),
  payment_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_patient FOREIGN KEY (patient_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_patient ON Payments(patient_id);

-- Create Lab_Tests Table
CREATE TABLE Lab_Tests (
  test_id         NUMBER PRIMARY KEY,
  patient_id      NUMBER NOT NULL,
  doctor_id       NUMBER NOT NULL,
  test_name       VARCHAR2(100) NOT NULL,
  test_status     VARCHAR2(20) DEFAULT 'Ordered' CHECK (test_status IN ('Ordered', 'InProgress', 'Completed')),
  ordered_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_date  TIMESTAMP,
  result          CLOB,
  notes           VARCHAR2(500),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lab_test_patient FOREIGN KEY (patient_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_lab_test_doctor FOREIGN KEY (doctor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_lab_tests_patient ON Lab_Tests(patient_id);
CREATE INDEX idx_lab_tests_doctor ON Lab_Tests(doctor_id);

-- Create Prescriptions Table
CREATE TABLE Prescriptions (
  prescription_id NUMBER PRIMARY KEY,
  patient_id      NUMBER NOT NULL,
  doctor_id       NUMBER NOT NULL,
  medication_name VARCHAR2(200) NOT NULL,
  dosage          VARCHAR2(100) NOT NULL,
  frequency       VARCHAR2(100),
  duration        VARCHAR2(100),
  prescribed_date DATE DEFAULT SYSDATE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prescription_patient FOREIGN KEY (patient_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_prescription_doctor FOREIGN KEY (doctor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_prescriptions_patient ON Prescriptions(patient_id);

-- Insert Sample Data
-- Admin User
INSERT INTO Users (user_id, full_name, email, password_hash, role, department, phone_number, is_active)
VALUES (user_seq.NEXTVAL, 'System Administrator', 'bushramug9@gmail.com', '12345678Bb@', 'Admin', 'IT Administration', '0501234567', '1');

-- Doctor
INSERT INTO Users (user_id, full_name, email, password_hash, role, department, phone_number, is_active)
VALUES (user_seq.NEXTVAL, 'Dr. Sarah Smith', 'doctor@hospital.com', 'Doctor123!', 'Doctor', 'General Medicine', '0501234569', '1');

-- Lab Technician
INSERT INTO Users (user_id, full_name, email, password_hash, role, department, phone_number, is_active)
VALUES (user_seq.NEXTVAL, 'Sarah Johnson', 'lab.tech@hospital.com', 'LabTech123!', 'Lab Technician', 'Laboratory', '0501234568', '1');

-- Patient
INSERT INTO Users (user_id, full_name, email, password_hash, role, date_of_birth, phone_number, is_active)
VALUES (user_seq.NEXTVAL, 'John Doe', 'john.doe@example.com', 'Password1!', 'Patient', TO_DATE('1990-01-15', 'YYYY-MM-DD'), '123-456-7890', '1');

-- Sample Lab Tests
INSERT INTO Lab_Tests (test_id, patient_id, doctor_id, test_name, test_status, result, completed_date, notes)
VALUES (
  lab_test_seq.NEXTVAL,
  (SELECT user_id FROM Users WHERE email = 'john.doe@example.com'),
  (SELECT user_id FROM Users WHERE email = 'doctor@hospital.com'),
  'Complete Blood Count (CBC)',
  'Completed',
  'All values within normal range. WBC: 7.5 K/uL, RBC: 5.2 M/uL, Hemoglobin: 15.2 g/dL, Platelets: 250 K/uL',
  CURRENT_TIMESTAMP - 1,
  'Routine annual checkup'
);

INSERT INTO Lab_Tests (test_id, patient_id, doctor_id, test_name, test_status, notes)
VALUES (
  lab_test_seq.NEXTVAL,
  (SELECT user_id FROM Users WHERE email = 'john.doe@example.com'),
  (SELECT user_id FROM Users WHERE email = 'doctor@hospital.com'),
  'Lipid Panel',
  'InProgress',
  'Fasting required - Patient fasted for 12 hours'
);

INSERT INTO Lab_Tests (test_id, patient_id, doctor_id, test_name, test_status, notes)
VALUES (
  lab_test_seq.NEXTVAL,
  (SELECT user_id FROM Users WHERE email = 'john.doe@example.com'),
  (SELECT user_id FROM Users WHERE email = 'doctor@hospital.com'),
  'Thyroid Function Test (TSH, T3, T4)',
  'Ordered',
  'Follow-up test requested due to patient symptoms'
);

COMMIT;

SELECT 'Database initialized successfully!' AS STATUS FROM DUAL;
SELECT 'Total users: ' || COUNT(*) AS INFO FROM Users;
SELECT 'Total lab tests: ' || COUNT(*) AS INFO FROM Lab_Tests;
