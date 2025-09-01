import React from 'react';

interface User {
    name: string;
    email: string;
}

const Welcome: React.FC = () => {
    const user: User | null = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) return null;

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}!</h2>
            <p className="text-sm text-gray-500 mt-1">Email: {user.email}</p>
        </div>
    );
};

export default Welcome;