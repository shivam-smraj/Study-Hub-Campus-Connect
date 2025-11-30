import React from 'react';
import { fetchAllUsers } from '../../api';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../components/Spinner';
import './ManageUsers.css';

const ManageUsers = () => {
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => fetchAllUsers().then(res => res.data)
    });

    if (isLoading) return <Spinner />;
    if (error) return <p className="error-message">Failed to load users.</p>;

    return (
        <div className="admin-page">
            <h2>Manage Users</h2>
            <div className="list-section">
                <h3>Total Users: {users?.length}</h3>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined</th>
                                <th>Collections</th>
                                <th>Bookmarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            {user.image && <img src={user.image} alt="avatar" className="user-avatar-small" />}
                                            <span>{user.displayName}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>{user.collections?.length || 0}</td>
                                    <td>{user.bookmarkedFiles?.length || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
