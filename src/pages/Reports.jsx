import React from 'react';
import { FileText, Download, Users, UserCheck, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const { pendingUsers } = useAuth();
  const navigate = useNavigate();

  const approvedUsers = pendingUsers.filter(u => u.status === 'approved');
  const actualPending = pendingUsers.filter(u => u.status === 'pending');

  const stats = [
    { label: 'Total Registrations', value: pendingUsers.length, icon: Users, color: '#3b82f6' },
    { label: 'Active Users', value: approvedUsers.length, icon: UserCheck, color: '#10b981' },
    { label: 'Pending Approval', value: actualPending.length, icon: UserPlus, color: '#f59e0b' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      <header className="page-header animate-in">
        <div className="header-content">
          <div className="breadcrumb" onClick={() => navigate(-1)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </div>
          <h1>System Reports</h1>
          <p className="subtitle">General overview and user statistics.</p>
        </div>
        <button className="btn-primary no-print" onClick={handlePrint}>
          <Download size={18} />
          <span>Download PDF</span>
        </button>
      </header>

      <div className="stats-grid animate-in delay-1">
        {stats.map((stat, index) => (
          <div key={index} className="glass-panel stat-card">
            <div className="stat-icon-wrapper" style={{ background: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label text-muted">{stat.label}</span>
              <div className="stat-value text-gradient">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel report-section animate-in delay-2">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText className="text-primary" />
            <h3>User Summary Report</h3>
          </div>
          <span className="text-muted">Generated on {new Date().toLocaleDateString()}</span>
        </div>

        <div className="report-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Registration Date</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length > 0 ? (
                // Sort by latest
                [...pendingUsers].reverse().map(user => (
                  <tr key={user.id}>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge ${user.status === 'approved' ? 'success' : 'warning'}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No user data available to generate report.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .reports-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .report-section {
          padding: 2rem;
          margin-top: 2rem;
        }

        .report-table-wrapper {
          overflow-x: auto;
        }

        @media print {
          .no-print, .sidebar, .breadcrumb {
            display: none !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding: 0 !important;
          }
          .glass-panel {
            border: 1px solid #ddd !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .text-gradient {
            background: none !important;
            -webkit-text-fill-color: black !important;
            color: black !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
