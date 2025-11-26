import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Page, InsuranceInfo } from '../../types';

export const InsuranceVerification = () => {
    const { navigate, currentUser, insuranceRecords, setInsuranceRecords } = useAppContext();
    const [formData, setFormData] = useState({
        provider: '',
        policyNumber: '',
        expirationDate: ''
    });
    const [errors, setErrors] = useState({
        provider: '',
        policyNumber: '',
        expirationDate: ''
    });
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [insuranceSupported, setInsuranceSupported] = useState<boolean | null>(null);

    const validateProvider = (provider: string): string => {
        if (!provider.trim()) {
            return 'Insurance provider is required';
        }
        if (provider.trim().length < 3) {
            return 'Provider name must be at least 3 characters';
        }
        return '';
    };

    const validatePolicyNumber = (policyNumber: string): string => {
        if (!policyNumber.trim()) {
            return 'Policy number is required';
        }
        // Policy number format: letters and numbers, 6-20 characters
        const policyRegex = /^[A-Z0-9]{6,20}$/i;
        if (!policyRegex.test(policyNumber.trim())) {
            return 'Policy number must be 6-20 alphanumeric characters';
        }
        return '';
    };

    const validateExpirationDate = (expirationDate: string): string => {
        if (!expirationDate) {
            return 'Expiration date is required';
        }

        const selectedDate = new Date(expirationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return 'Insurance policy has already expired';
        }

        return '';
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error for this field when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const providerError = validateProvider(formData.provider);
        const policyError = validatePolicyNumber(formData.policyNumber);
        const dateError = validateExpirationDate(formData.expirationDate);

        setErrors({
            provider: providerError,
            policyNumber: policyError,
            expirationDate: dateError
        });

        // If any errors exist, set submission status to error
        if (providerError || policyError || dateError) {
            setSubmissionStatus('error');
            return;
        }

        // Check if insurance is supported
        try {
            const response = await fetch('http://localhost:3001/api/insurance/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: formData.provider })
            });
            const data = await response.json();
            const isSupported = data.isSupported;
            setInsuranceSupported(isSupported);

            // Only save insurance if it's supported
            if (!isSupported) {
                setErrors(prev => ({
                    ...prev,
                    provider: `${formData.provider} is not supported. Please use a supported insurance provider.`
                }));
                setSubmissionStatus('error');
                return;
            }
        } catch (error) {
            console.error('Error checking insurance support:', error);
            setErrors(prev => ({
                ...prev,
                provider: 'Unable to verify insurance. Please try again.'
            }));
            setSubmissionStatus('error');
            return;
        }

        // Insurance is supported - save insurance info
        if (currentUser) {
            const newInsurance: InsuranceInfo = {
                id: `ins_${Date.now()}`,
                patientId: currentUser.id,
                provider: formData.provider,
                policyNumber: formData.policyNumber,
                expirationDate: formData.expirationDate,
                isActive: true,
                createdAt: new Date().toISOString()
            };

            // Remove any previous insurance for this patient and add new one
            const updatedRecords = insuranceRecords.filter(ins => ins.patientId !== currentUser.id);
            setInsuranceRecords([...updatedRecords, newInsurance]);
        }

        setSubmissionStatus('success');
    };

    const handleReset = () => {
        setFormData({
            provider: '',
            policyNumber: '',
            expirationDate: ''
        });
        setErrors({
            provider: '',
            policyNumber: '',
            expirationDate: ''
        });
        setSubmissionStatus('idle');
        setInsuranceSupported(null);
    };

    if (submissionStatus === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Insurance Saved!</h2>
                        <p className="text-gray-600 mb-4">Your insurance information has been saved successfully.</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-left">
                        <h3 className="font-semibold text-gray-800 mb-3">Insurance Details:</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Provider:</span>
                                <span className="font-medium text-gray-800">{formData.provider}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Policy Number:</span>
                                <span className="font-medium text-gray-800">{formData.policyNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Expiration Date:</span>
                                <span className="font-medium text-gray-800">{formData.expirationDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Support Status */}
                    {insuranceSupported !== null && (
                        <div className={`border rounded-lg p-4 mb-6 text-left ${
                            insuranceSupported
                                ? 'bg-green-50 border-green-300'
                                : 'bg-orange-50 border-orange-300'
                        }`}>
                            <div className="flex items-start">
                                {insuranceSupported ? (
                                    <>
                                        <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h4 className="font-semibold text-green-800 mb-1">Insurance Supported</h4>
                                            <p className="text-sm text-green-700">
                                                Great news! <strong>{formData.provider}</strong> is accepted at our hospital.
                                                You can proceed with appointments using this insurance.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <div>
                                            <h4 className="font-semibold text-orange-800 mb-1">Insurance Not Supported</h4>
                                            <p className="text-sm text-orange-700">
                                                Unfortunately, <strong>{formData.provider}</strong> is not currently accepted at our hospital.
                                                Please contact our billing department for alternative payment options.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Ready to book!</span> You can now book appointments with your saved payment method and insurance.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(Page.PatientDashboard)}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Go to Dashboard & Book Appointment
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Update Insurance
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Get existing insurance for current user
    const existingInsurance = currentUser
        ? insuranceRecords.find(ins => ins.patientId === currentUser.id && ins.isActive)
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex gap-6">
                {/* Existing Insurance Card (shown on the left if exists) */}
                {existingInsurance && (
                    <div className="w-72 bg-white rounded-xl shadow-2xl p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Active Insurance</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Provider</p>
                                <p className="text-sm font-semibold text-gray-800">{existingInsurance.provider}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Policy Number</p>
                                <p className="text-sm font-semibold text-gray-800">{existingInsurance.policyNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Expiration Date</p>
                                <p className="text-sm font-semibold text-gray-800">{existingInsurance.expirationDate}</p>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">Added on {new Date(existingInsurance.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Insurance Form */}
                <div className="flex-1 bg-white rounded-xl shadow-2xl p-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(Page.PatientDashboard)}
                        className="text-primary hover:text-primary-dark font-medium mb-4 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">Insurance Verification</h2>
                    <p className="text-gray-500 mt-2">Verify your insurance coverage</p>
                </div>

                {submissionStatus === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                        <p className="font-medium">Validation Error</p>
                        <p className="text-sm">Please correct the errors below and try again.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                            Insurance Provider *
                        </label>
                        <input
                            id="provider"
                            type="text"
                            value={formData.provider}
                            onChange={(e) => handleInputChange('provider', e.target.value)}
                            className={`w-full px-4 py-2 border ${errors.provider ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                            placeholder="e.g., Bupa, Tawuniya, Medgulf"
                        />
                        {errors.provider && (
                            <p className="text-red-500 text-sm mt-1">{errors.provider}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Policy Number *
                        </label>
                        <input
                            id="policyNumber"
                            type="text"
                            value={formData.policyNumber}
                            onChange={(e) => handleInputChange('policyNumber', e.target.value.toUpperCase())}
                            className={`w-full px-4 py-2 border ${errors.policyNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                            placeholder="e.g., POL123456789"
                            maxLength={20}
                        />
                        {errors.policyNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.policyNumber}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">6-20 alphanumeric characters</p>
                    </div>

                    <div>
                        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date *
                        </label>
                        <input
                            id="expirationDate"
                            type="date"
                            value={formData.expirationDate}
                            onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                            className={`w-full px-4 py-2 border ${errors.expirationDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        />
                        {errors.expirationDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        >
                            Verify Insurance
                        </button>
                    </div>
                </form>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Note:</span> This is a UI validation demo. No actual insurance verification is performed.
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
};
