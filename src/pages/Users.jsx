import React, { useState } from 'react';
import { Plus, Search, User, Filter, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { pendingUsers, approveUser, rejectUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // all | pending
  // Placeholder for approved users
  const users = [];

  return (
    <div className="users-page">
      <header className="page-header animate-in">
        <div className="header-content">
          <h1>User Management</h1>
          <p className="subtitle">Manage user access and permissions.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </header>
      
      <div className="page-tabs animate-in delay-1">
         <button 
           className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
           onClick={() => setActiveTab('all')}
         >
           All Users
         </button>
         <button 
           className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
           onClick={() => setActiveTab('pending')}
         >
           Pending Requests
           {pendingUsers.filter(u => u.status === 'pending').length > 0 && (
             <span className="badge-count">
               {pendingUsers.filter(u => u.status === 'pending').length}
             </span>
           )}
         </button>
      </div>

      <div className="glass-panel table-section animate-in delay-2">
        {activeTab === 'pending' ? (
           <div className="pending-list">
              {pendingUsers.filter(u => u.status === 'pending').length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date Requested</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.filter(u => u.status === 'pending').map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td><span className="status-badge warning">Pending</span></td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon-sm success" 
                              title="Approve"
                              onClick={() => approveUser(user.id)}
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              className="btn-icon-sm danger" 
                              title="Reject"
                              onClick={() => rejectUser(user.id)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state-small">
                   <p>No pending sign-up requests.</p>
                </div>
              )}
           </div>
        ) : (
            <>
                <div className="toolbar">
                  <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search users..." className="form-input search-input" />
                  </div>
                  <button className="btn-icon">
                    <Filter size={18} />
                  </button>
                </div>

                {users.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* User rows */}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-table-state">
                    <div className="empty-icon-circle">
                      <User size={32} />
                    </div>
                    <h3>No Users Found</h3>
                    <p>Get started by adding a new user to the system.</p>
                    <button className="add-btn-link">Add your first user</button>
                  </div>
                )}
            </>
        )}
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        
        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .subtitle {
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
        
        .page-tabs {
           display: flex;
           gap: 1rem;
           margin-bottom: 1rem;
        }
        
        .tab-btn {
           background: transparent;
           color: var(--text-muted);
           padding: 0.5rem 1rem;
           font-weight: 500;
           border-bottom: 2px solid transparent;
           transition: 0.2s;
           display: flex;
           align-items: center;
           gap: 0.5rem;
        }
        
        .tab-btn:hover { color: white; }
        
        .tab-btn.active {
           color: var(--primary);
           border-color: var(--primary);
        }
        
        .badge-count {
           background: #ef4444;
           color: white;
           font-size: 0.75rem;
           padding: 0.1rem 0.4rem;
           border-radius: 99px;
        }

        .table-section {
          padding: 1.5rem;
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }

        .toolbar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          padding-left: 3rem;
        }

        .empty-table-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem;
        }
        
        .empty-state-small {
           text-align: center;
           padding: 3rem;
           color: var(--text-muted);
           font-style: italic;
        }

        .empty-icon-circle {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }

        .empty-table-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .empty-table-state p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          max-width: 300px;
        }

        .add-btn-link {
          background: transparent;
          color: var(--primary);
          font-weight: 500;
          border-bottom: 1px solid transparent;
          padding-bottom: 2px;
          transition: 0.2s;
        }
        
        .add-btn-link:hover {
          border-color: var(--primary);
        }
        
        /* Table Styles */
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th {
          text-align: left;
          padding: 1rem;
          color: var(--text-muted);
          font-weight: 500;
          border-bottom: 1px solid var(--glass-border);
        }
        
        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }
        
        .status-badge.warning {
           color: #f59e0b;
           background: rgba(245, 158, 11, 0.1);
           padding: 0.25rem 0.75rem;
           border-radius: 12px;
           font-size: 0.85rem;
        }
        
        .action-buttons {
           display: flex;
           gap: 0.5rem;
        }
        
        .btn-icon-sm {
           background: rgba(255,255,255,0.05);
           border-radius: 6px;
           padding: 0.35rem;
           color: var(--text-muted);
           transition: 0.2s;
        }
        
        .btn-icon-sm:hover { color: white; background: rgba(255,255,255,0.1); }
        .btn-icon-sm.success:hover { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .btn-icon-sm.danger:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
      `}</style>
    </div>
  );
};

export default Users;
