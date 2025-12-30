import React, { useState } from 'react';
import { Plus, Search, User, Filter, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { pendingUsers, approveUser, rejectUser, signup } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // all | pending
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });

  // Get approved users from context
  const approvedUsers = pendingUsers.filter(u => u.status === 'approved');
  
  // Filter based on search
  const filteredUsers = approvedUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-page">
      <header className="page-header animate-in">
        <div className="header-content">
          <h1>User Management</h1>
          <p className="subtitle">Manage user access and permissions.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
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
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="form-input search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="btn-icon">
                    <Filter size={18} />
                  </button>
                </div>

                {filteredUsers.length > 0 ? (
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
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info-cell">
                              <div className="user-avatar-sm">{user.name.charAt(0)}</div>
                              {user.name}
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td><span className="role-badge">User</span></td>
                          <td><span className="status-badge success">Active</span></td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon-sm danger" 
                                title="Remove User"
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
                  <div className="empty-table-state">
                    <div className="empty-icon-circle">
                      <User size={32} />
                    </div>
                    <h3>{searchTerm ? 'No matching users' : 'No Users Found'}</h3>
                    <p>{searchTerm ? 'Try a different search term.' : 'Get started by adding a new user to the system.'}</p>
                    {!searchTerm && <button className="add-btn-link">Add your first user</button>}
                  </div>
                )}
            </>
        )}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form className="modal-form" onSubmit={(e) => {
              e.preventDefault();
              const res = signup(newUser.name, newUser.email, newUser.password);
              if (res.success) {
                // Find and approve the user immediately
                const saved = localStorage.getItem('pendingUsers');
                const usersList = saved ? JSON.parse(saved) : [];
                const addedUser = usersList.find(u => u.email === newUser.email);
                if (addedUser) approveUser(addedUser.id);
                
                setIsModalOpen(false);
                setNewUser({ name: '', email: '', password: '' });
              } else {
                alert(res.message);
              }
            }}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  required
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        .status-badge.success {
           color: #10b981;
           background: rgba(16, 185, 129, 0.1);
           padding: 0.25rem 0.75rem;
           border-radius: 12px;
           font-size: 0.85rem;
        }

        .role-badge {
           color: var(--text-muted);
           background: rgba(255, 255, 255, 0.05);
           padding: 0.2rem 0.5rem;
           border-radius: 4px;
           font-size: 0.8rem;
           border: 1px solid var(--glass-border);
        }

        .user-info-cell {
           display: flex;
           align-items: center;
           gap: 0.75rem;
        }

        .user-avatar-sm {
           width: 32px;
           height: 32px;
           background: var(--primary);
           color: white;
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           font-weight: 600;
           font-size: 0.8rem;
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fade-in 0.3s ease;
        }

        .modal-content {
          width: 100%;
          max-width: 450px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-btn {
          background: transparent;
          color: var(--text-muted);
          transition: 0.2s;
        }

        .close-btn:hover { color: white; }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Users;
