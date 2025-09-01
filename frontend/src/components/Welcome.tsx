import React from 'react';

interface User {
    name: string;
    email: string;
}

const Welcome: React.FC = () => {
    const user: User | null = JSON.parse(localStorage.getItem('user') || 'null');

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">{user?.email}</p>
        </div>
    );
};

export default Welcome;