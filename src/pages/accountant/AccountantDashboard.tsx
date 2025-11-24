import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { LogoutIcon } from '../../components/icons';
import { PaymentInfo } from '../../types';

interface PaymentStats {
    totalRevenue: number;
    successfulPayments: number;
    failedPayments: number;
    totalTransactions: number;
    averagePayment: number;
}

export const AccountantDashboard = () => {
    const { currentUser, logout } = useAppContext();
    const [payments, setPayments] = useState<PaymentInfo[]>([]);
    const [stats, setStats] = useState<PaymentStats>({
        totalRevenue: 0,
        successfulPayments: 0,
        failedPayments: 0,
        totalTransactions: 0,
        averagePayment: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);

            // Demo data for UI display
            const demoPayments: PaymentInfo[] = [
                {
                    id: 'payment_1',
                    patientId: 'user_1',
                    cardNumber: '****3456',
                    cardHolderName: 'John Doe',
                    expiryDate: '12/25',
                    cvv: '',
                    amount: 150.00,
                    paymentDate: '2024-11-20',
                    status: 'Success'
                },
                {
                    id: 'payment_2',
                    patientId: 'user_2',
                    cardNumber: '****7890',
                    cardHolderName: 'Jane Smith',
                    expiryDate: '01/26',
                    cvv: '',
                    amount: 200.00,
                    paymentDate: '2024-11-21',
                    status: 'Success'
                },
                {
                    id: 'payment_3',
                    patientId: 'user_3',
                    cardNumber: '****1234',
                    cardHolderName: 'Mike Johnson',
                    expiryDate: '03/25',
                    cvv: '',
                    amount: 75.50,
                    paymentDate: '2024-11-22',
                    status: 'Failed'
                },
                {
                    id: 'payment_4',
                    patientId: 'user_4',
                    cardNumber: '****5678',
                    cardHolderName: 'Sarah Williams',
                    expiryDate: '06/26',
                    cvv: '',
                    amount: 300.00,
                    paymentDate: '2024-11-23',
                    status: 'Success'
                },
                {
                    id: 'payment_5',
                    patientId: 'user_5',
                    cardNumber: '****9012',
                    cardHolderName: 'David Brown',
                    expiryDate: '09/25',
                    cvv: '',
                    amount: 125.00,
                    paymentDate: '2024-11-24',
                    status: 'Success'
                }
            ];

            setPayments(demoPayments);
            calculateStats(demoPayments);
        } catch (err) {
            setError('Error loading payment data');
            console.error('Error fetching payments:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (paymentsData: PaymentInfo[]) => {
        const successful = paymentsData.filter(p => p.status === 'Success');
        const failed = paymentsData.filter(p => p.status === 'Failed');
        const totalRevenue = successful.reduce((sum, p) => sum + p.amount, 0);
        const averagePayment = successful.length > 0 ? totalRevenue / successful.length : 0;

        setStats({
            totalRevenue,
            successfulPayments: successful.length,
            failedPayments: failed.length,
            totalTransactions: paymentsData.length,
            averagePayment
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl sm:text-2xl font-bold text-primary-dark">
                            Accountant Dashboard
                        </h1>
                        <div className="flex items-center">
                            <span className="hidden sm:inline text-gray-700 mr-4">Welcome, <strong>{currentUser?.fullName}</strong>!</span>
                            <button
                                onClick={logout}
                                className="flex items-center text-gray-600 hover:text-primary-dark transition-colors duration-300"
                                aria-label="Logout"
                            >
                                <LogoutIcon className="w-6 h-6" />
                                <span className="ml-2 hidden md:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">Loading payment data...</p>
                    </div>
                ) : (
                    <>
                        {/* Payment Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                        <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Successful Payments</p>
                                        <p className="text-2xl font-bold text-blue-600">{stats.successfulPayments}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Failed Payments</p>
                                        <p className="text-2xl font-bold text-red-600">{stats.failedPayments}</p>
                                    </div>
                                    <div className="bg-red-100 p-3 rounded-full">
                                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Average Payment</p>
                                        <p className="text-2xl font-bold text-purple-600">${stats.averagePayment.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Transactions Table */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Transactions</h2>

                            {payments.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No payment transactions found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Transaction ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Patient ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {payments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {payment.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {payment.patientId}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        ${payment.amount.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {payment.paymentDate}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            payment.status === 'Success'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Summary Report */}
                        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="text-blue-800 font-semibold mb-1">Financial Summary</h3>
                                    <p className="text-blue-700 text-sm">
                                        Total of {stats.totalTransactions} transactions processed with a success rate of {' '}
                                        {stats.totalTransactions > 0
                                            ? ((stats.successfulPayments / stats.totalTransactions) * 100).toFixed(1)
                                            : 0}%.
                                        Total revenue generated: ${stats.totalRevenue.toFixed(2)}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
