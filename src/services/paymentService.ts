/**
 * Payment Service - Database operations for Payments table
 * HealSmart Hospital Management System
 */

import { executeQuery } from '../database/connection';
import { PaymentInfo } from '../types';
import oracledb from 'oracledb';

interface DbPayment {
    PAYMENT_ID: number;
    PATIENT_ID: number;
    AMOUNT: number;
    PAYMENT_STATUS: string;
    PAYMENT_DATE: Date;
    TRANSACTION_ID: string | null;
}

/**
 * Get all payments
 */
export async function getAllPayments(): Promise<PaymentInfo[]> {
    try {
        const sql = `
            SELECT
                payment_id, patient_id, amount, payment_status,
                payment_date, transaction_id
            FROM Payments
            ORDER BY payment_date DESC
        `;

        const result = await executeQuery<DbPayment>(sql);

        if (!result.rows) {
            return [];
        }

        return result.rows.map(payment => ({
            id: `payment_${payment.PAYMENT_ID}`,
            patientId: `user_${payment.PATIENT_ID}`,
            cardNumber: '', // Redacted for security
            cardHolderName: '',
            expiryDate: '',
            cvv: '',
            amount: payment.AMOUNT,
            paymentDate: payment.PAYMENT_DATE.toISOString().split('T')[0],
            status: payment.PAYMENT_STATUS as 'Success' | 'Failed'
        }));
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }
}

/**
 * Create a new payment record
 */
export async function createPayment(payment: Omit<PaymentInfo, 'id'>): Promise<PaymentInfo> {
    try {
        const patientId = parseInt(payment.patientId.replace('user_', ''));

        const sql = `
            INSERT INTO Payments (
                payment_id, patient_id, amount, payment_method,
                payment_status, transaction_id, payment_date, created_at
            )
            VALUES (
                payment_seq.NEXTVAL, :patientId, :amount, 'Card',
                :status, :transactionId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            RETURNING payment_id INTO :id
        `;

        const binds = {
            patientId,
            amount: payment.amount,
            status: payment.status,
            transactionId: `TXN_${Date.now()}`,
            id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        };

        const result = await executeQuery(sql, binds);
        const paymentId = result.outBinds?.id;

        return {
            id: `payment_${paymentId}`,
            ...payment,
            paymentDate: new Date().toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
}

/**
 * Get payments by patient ID
 */
export async function getPaymentsByPatient(patientId: string): Promise<PaymentInfo[]> {
    try {
        const id = parseInt(patientId.replace('user_', ''));

        const sql = `
            SELECT
                payment_id, patient_id, amount, payment_status,
                payment_date, transaction_id
            FROM Payments
            WHERE patient_id = :id
            ORDER BY payment_date DESC
        `;

        const result = await executeQuery<DbPayment>(sql, { id });

        if (!result.rows) {
            return [];
        }

        return result.rows.map(payment => ({
            id: `payment_${payment.PAYMENT_ID}`,
            patientId: `user_${payment.PATIENT_ID}`,
            cardNumber: '', // Redacted for security
            cardHolderName: '',
            expiryDate: '',
            cvv: '',
            amount: payment.AMOUNT,
            paymentDate: payment.PAYMENT_DATE.toISOString().split('T')[0],
            status: payment.PAYMENT_STATUS as 'Success' | 'Failed'
        }));
    } catch (error) {
        console.error('Error fetching patient payments:', error);
        throw error;
    }
}

export default {
    getAllPayments,
    createPayment,
    getPaymentsByPatient
};
