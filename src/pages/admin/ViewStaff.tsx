
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { TrashIcon } from '../../components/icons';
import { Role } from '../../types';
import api from '../../api/client';

export const ViewStaff = () => {
    const { staff, refreshData } = useAppContext();
    // Show all staff members (excluding Admin) - sorted by role
    const allStaff = staff.filter(s => s.role !== Role.Admin).sort((a, b) => a.role.localeCompare(b.role));

    const handleDelete = async (staffId: string) => {
        try {
            await api.staff.delete(staffId);
            // Refresh data from database
            await refreshData();
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert('Failed to delete staff member. Please try again.');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case Role.Doctor:
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case Role.LabTechnician:
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Staff Members</h2>
            <div className="min-w-full">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Department</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Contact</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allStaff.map((staffMember, index) => (
                            <tr key={staffMember.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{staffMember.fullName}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(staffMember.role)}`}>
                                        {staffMember.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{staffMember.department}</td>
                                <td className="px-6 py-4">{staffMember.email}</td>
                                <td className="px-6 py-4">{staffMember.contactNumber}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDelete(staffMember.id)} className="text-red-600 hover:text-red-900">
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {allStaff.length === 0 && <p className="text-center text-gray-500 py-8">No staff members have been added yet.</p>}
            </div>
        </div>
    );
};
