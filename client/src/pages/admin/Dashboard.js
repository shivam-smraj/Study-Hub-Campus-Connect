// client/src/pages/admin/Dashboard.js
import React from 'react';
import { fetchAdminStats } from '../../api';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../components/Spinner';
import './Dashboard.css';

const Dashboard = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: () => fetchAdminStats().then(res => res.data)
    });

    if (isLoading) return <Spinner />;
    if (error) return <p className="error-message">Failed to load dashboard stats.</p>;

    return (
        <div className="admin-page">
            <h2>Admin Dashboard</h2>
            
            <div className="stats-section">
                <h3>Site Analytics</h3>
                <div className="stats-grid analytics-grid">
                    <div className="stat-card analytics-card">
                        <h3>Active Now</h3>
                        <p className="stat-number highlight">{stats.analytics?.activeUsers || 0}</p>
                        <span className="stat-label">Users online (5m)</span>
                    </div>
                    <div className="stat-card analytics-card">
                        <h3>Today</h3>
                        <div className="dual-stat">
                            <div>
                                <p className="stat-number">{stats.analytics?.dailyVisitors || 0}</p>
                                <span className="stat-label">Visitors</span>
                            </div>
                            <div className="divider"></div>
                            <div>
                                <p className="stat-number">{stats.analytics?.dailyViews || 0}</p>
                                <span className="stat-label">Views</span>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card analytics-card">
                        <h3>This Month</h3>
                        <div className="dual-stat">
                            <div>
                                <p className="stat-number">{stats.analytics?.monthlyVisitors || 0}</p>
                                <span className="stat-label">Visitors</span>
                            </div>
                            <div className="divider"></div>
                            <div>
                                <p className="stat-number">{stats.analytics?.monthlyViews || 0}</p>
                                <span className="stat-label">Views</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <h3>Content Overview</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.users}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Files</h3>
                        <p className="stat-number">{stats.files}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Subjects</h3>
                        <p className="stat-number">{stats.subjects}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Branches</h3>
                        <p className="stat-number">{stats.branches}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;