import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Monitor, Smartphone, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // Also update in pendingUsers if exists to keep consistency
    const savedPending = localStorage.getItem('pendingUsers');
    if (savedPending) {
      const pending = JSON.parse(savedPending);
      const updatedPending = pending.map(u => u.email === user.email ? { ...u, name } : u);
      localStorage.setItem('pendingUsers', JSON.stringify(updatedPending));
    }
    window.location.reload(); // Simple way to refresh context
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ];

  return (
    <div className="settings-page">
      <header className="page-header animate-in">
        <div className="header-content">
          <h1>Settings</h1>
          <p className="subtitle">Manage your account and preferences.</p>
        </div>
      </header>

      <div className="settings-layout animate-in delay-1">
        <div className="glass-panel sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="glass-panel content-area">
          {activeTab === 'profile' && (
            <div className="settings-content animate-in">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Update your photo and personal details.</p>
              </div>

              <div className="profile-card">
                <div className="avatar-large">{user?.name.charAt(0)}</div>
                <div className="profile-actions">
                  <button className="btn-secondary">Change Photo</button>
                  <button className="btn-text">Remove</button>
                </div>
              </div>

              <form className="settings-form" onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-input" defaultValue={user?.email} disabled />
                  <span className="input-hint">Email cannot be changed.</span>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
             <div className="settings-content animate-in">
                <div className="section-header">
                  <h2>Appearance</h2>
                  <p>Customize how the dashboard looks on your device.</p>
                </div>
                
                <div className="theme-options">
                   <div className="theme-card active">
                      <Monitor size={24} />
                      <span>System</span>
                   </div>
                   <div className="theme-card">
                      <Moon size={24} />
                      <span>Dark</span>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-content animate-in">
              <div className="section-header">
                <h2>Notifications</h2>
                <p>Manage how we communicate with you.</p>
              </div>

              <div className="notification-list">
                {[
                  { id: 1, title: 'Email Alerts', desc: 'Receive emails about your account activity.', default: true },
                  { id: 2, title: 'Push Notifications', desc: 'Receive push notifications on your device.', default: true },
                  { id: 3, title: 'Marketing Emails', desc: 'Receive emails about new products and features.', default: false },
                ].map(item => (
                   <div key={item.id} className="notification-item">
                     <div className="notification-info">
                       <h4>{item.title}</h4>
                       <p>{item.desc}</p>
                     </div>
                     <label className="toggle-switch">
                       <input type="checkbox" defaultChecked={item.default} />
                       <span className="slider round"></span>
                     </label>
                   </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-content animate-in">
              <div className="section-header">
                <h2>Security</h2>
                <p>Keep your account secure.</p>
              </div>

              <div className="security-section">
                <h3>Change Password</h3>
                <form className="settings-form">
                   <div className="form-group">
                     <label>Current Password</label>
                     <input type="password" class="form-input" placeholder="••••••••" />
                   </div>
                   <div className="form-group">
                     <label>New Password</label>
                     <input type="password" class="form-input" placeholder="••••••••" />
                   </div>
                   <button className="btn-primary mt-2">Update Password</button>
                </form>
              </div>
              
              <div className="security-section border-top">
                 <div className="flex-between">
                    <div>
                      <h3>Two-Factor Authentication</h3>
                      <p className="text-muted-sm">Add an extra layer of security to your account.</p>
                    </div>
                    <label className="toggle-switch">
                       <input type="checkbox" />
                       <span className="slider round"></span>
                    </label>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .page-header {
          margin-bottom: 2rem;
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
        }

        .subtitle {
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }
        }

        .sidebar-nav {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          background: transparent;
          color: var(--text-muted);
          border-radius: 8px;
          transition: all 0.2s;
          text-align: left;
        }

        .nav-tab:hover, .nav-tab.active {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-tab.active {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
        }

        .content-area {
          padding: 2rem;
          min-height: 500px;
        }

        .section-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: var(--text-muted);
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-secondary {
          padding: 0.6rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          color: white;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-text {
          background: transparent;
          color: #fca5a5;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }

        .input-hint {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.4rem;
        }

        .form-actions {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
        }

        .theme-options {
          display: flex;
          gap: 1rem;
        }

        .theme-card {
           padding: 1.5rem;
           border: 1px solid var(--glass-border);
           border-radius: 12px;
           background: rgba(0,0,0,0.2);
           width: 120px;
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 0.8rem;
           cursor: pointer;
           transition: all 0.2s;
        }
        
        .theme-card.active {
           border-color: var(--primary);
           background: rgba(99, 102, 241, 0.1);
        }
        
        .empty-tab {
           text-align: center;
           padding: 4rem 0;
           color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Settings;
