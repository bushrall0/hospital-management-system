import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { AddStaff } from './AddStaff';
import { ViewStaff } from './ViewStaff';
import { InsuranceManagement } from './InsuranceManagement';
import { HomeIcon, PlusIcon, UsersIcon, LogoutIcon, CalendarIcon, TrashIcon } from '../../components/icons';

type AdminView = 'dashboard' | 'addStaff' | 'viewStaff' | 'manageAppointments' | 'insuranceManagement';

const SidebarLink = ({ icon, label, onClick, isActive }: { icon: React.ReactNode, label: string, onClick: () => void, isActive: boolean }) => (
    <button onClick={onClick} className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${isActive ? 'bg-primary-dark text-white' : 'text-gray-200 hover:bg-primary-dark/50 hover:text-white'}`}>
        {icon}
        <span className="mx-4 font-medium">{label}</span>
    </button>
);

const ManageAppointmentsView = () => {
    const { appointments, setAppointments } = useAppContext();

    const handleDelete = (appointmentId: string) => {
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage All Appointments</h2>
            <div className="min-w-full">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Patient</th>
                            <th scope="col" className="px-6 py-3">Doctor</th>
                            <th scope="col" className="px-6 py-3">Date & Time</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((apt, index) => (
                            <tr key={apt.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="px-6 py-4 font-medium text-gray-900">{apt.patientName}</td>
                                <td className="px-6 py-4">{apt.doctorName}</td>
                                <td className="px-6 py-4">{apt.date} at {apt.time}</td>
                                <td className="px-6 py-4">{apt.status}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDelete(apt.id)} className="text-red-600 hover:text-red-900">
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {appointments.length === 0 && <p className="text-center text-gray-500 py-8">No appointments found.</p>}
            </div>
        </div>
    );
};

export const AdminDashboard = () => {
    const { currentUser, logout } = useAppContext();
    const [activeView, setActiveView] = useState<AdminView>('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'addStaff': return <AddStaff />;
            case 'viewStaff': return <ViewStaff />;
            case 'manageAppointments': return <ManageAppointmentsView />;
            case 'insuranceManagement': return <InsuranceManagement />;
            case 'dashboard':
            default:
                return (
                    <div className="p-8 bg-white rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome, {currentUser?.fullName}!</h2>
                        <p className="mt-2 text-gray-600">Select an option from the sidebar to manage the hospital.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="hidden md:flex flex-col w-64 bg-primary-dark/90 backdrop-blur-sm text-white">
                <div className="flex items-center justify-center h-20 shadow-md bg-primary-dark">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <SidebarLink icon={<HomeIcon />} label="Dashboard" onClick={() => setActiveView('dashboard')} isActive={activeView === 'dashboard'}/>
                    <SidebarLink icon={<PlusIcon />} label="Add Staff" onClick={() => setActiveView('addStaff')} isActive={activeView === 'addStaff'}/>
                    <SidebarLink icon={<UsersIcon />} label="View Staff" onClick={() => setActiveView('viewStaff')} isActive={activeView === 'viewStaff'}/>
                    <SidebarLink icon={<CalendarIcon />} label="Manage Appointments" onClick={() => setActiveView('manageAppointments')} isActive={activeView === 'manageAppointments'}/>
                    <SidebarLink
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                        label="Insurance Management"
                        onClick={() => setActiveView('insuranceManagement')}
                        isActive={activeView === 'insuranceManagement'}
                    />
                    <SidebarLink icon={<LogoutIcon />} label="Logout" onClick={logout} isActive={false}/>
                </nav>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-6 bg-white border-b">
                    <h1 className="text-2xl font-semibold text-gray-700">Administrator Dashboard</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};