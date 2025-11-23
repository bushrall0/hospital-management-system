import React, { useState, useEffect } from 'react';

interface SupportedInsurance {
    id: number;
    providerName: string;
    isActive: boolean;
}

export const InsuranceManagement = () => {
    const [insuranceProviders, setInsuranceProviders] = useState<SupportedInsurance[]>([]);
    const [newProvider, setNewProvider] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInsuranceProviders();
    }, []);

    const fetchInsuranceProviders = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/insurance/supported');
            const data = await response.json();
            setInsuranceProviders(data.providers || []);
        } catch (error) {
            console.error('Error fetching insurance providers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProvider = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProvider.trim()) return;

        try {
            const response = await fetch('http://localhost:3001/api/insurance/supported', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ providerName: newProvider })
            });

            if (response.ok) {
                setMessage('Insurance provider added successfully!');
                setNewProvider('');
                fetchInsuranceProviders();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error adding provider:', error);
            setMessage('Failed to add provider');
        }
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:3001/api/insurance/supported/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (response.ok) {
                fetchInsuranceProviders();
                setMessage('Insurance provider updated!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error updating provider:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this insurance provider?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/insurance/supported/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchInsuranceProviders();
                setMessage('Insurance provider deleted!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting provider:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Insurance Management</h2>

            {message && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {message}
                </div>
            )}

            {/* Add New Provider Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Supported Insurance Provider</h3>
                <form onSubmit={handleAddProvider} className="flex gap-3">
                    <input
                        type="text"
                        value={newProvider}
                        onChange={(e) => setNewProvider(e.target.value)}
                        placeholder="Enter insurance provider name..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                        Add Provider
                    </button>
                </form>
            </div>

            {/* Providers List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Provider Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {insuranceProviders.map((provider) => (
                            <tr key={provider.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {provider.providerName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            provider.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {provider.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    <button
                                        onClick={() => handleToggleActive(provider.id, provider.isActive)}
                                        className={`${
                                            provider.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                                        }`}
                                    >
                                        {provider.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(provider.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
