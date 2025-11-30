// client/src/pages/admin/AdminDashboardPage.js
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
    const location = useLocation();

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <h2>Admin Panel</h2>
                <nav>
                    <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                        Dashboard
                    </Link>
                    <Link to="/admin/users" className={location.pathname.includes('/admin/users') ? 'active' : ''}>
                        Manage Users
                    </Link>
                    <Link to="/admin/branches" className={location.pathname.includes('/admin/branches') ? 'active' : ''}>
                        Manage Branches
                    </Link>
                    <Link to="/admin/subjects" className={location.pathname.includes('/admin/subjects') ? 'active' : ''}>
                        Manage Subjects
                    </Link>
                    <Link to="/admin/upload" className={location.pathname.includes('/admin/upload') ? 'active' : ''}>
                        Manage Files
                    </Link>
                </nav>
            </aside>
            <main className="admin-content">
                {/* The Outlet component will render the nested child route */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboardPage;