import { DollarSign, Users, TrendingUp, Activity, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, pendingUsers } = useAuth();
  const navigate = useNavigate();
  
  const approvedCount = pendingUsers.filter(u => u.status === 'approved').length;

  // Empty data state for "fresh" look as requested
  const stats = [
    { label: 'Total Revenue', value: '$0.00', change: '0%', icon: DollarSign, color: '#10b981' },
    { label: 'Active Users', value: approvedCount.toString(), change: '0%', icon: Users, color: '#3b82f6' },
    { label: 'Sales', value: '0', change: '0%', icon: TrendingUp, color: '#f59e0b' },
    { label: 'Active Now', value: '0', change: '0%', icon: Activity, color: '#ec4899' },
  ];

  return (
    <div className="dashboard">
      <header className="page-header animate-in">
        <div className="header-content">
          <h1>Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="subtitle">
            {user?.role === 'admin' 
              ? "System Overview and Management" 
              : "Welcome back to your workspace."}
          </p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => navigate('/reports')}>
            <Plus size={18} />
            <span>New Report</span>
          </button>
        )}
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
              <div className="stat-change neutral">
                No recent activity
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid animate-in delay-2">
        <div className="glass-panel large-card empty-state">
          <div className="empty-content">
            <Activity size={48} className="empty-icon" />
            <h3>No Activity Yet</h3>
            <p>Your recent dashboard activity will show up here.</p>
            <button className="btn-primary mt-4">Start Tracking</button>
          </div>
        </div>
        
        <div className="glass-panel small-card">
          <h3>Top Products</h3>
          <div className="empty-list">
             <p>No products found.</p>
          </div>
        </div>
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
        }

        .header-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.75rem;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .stat-icon-wrapper {
          padding: 12px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.4rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 0.4rem;
        }

        .stat-change {
          font-size: 0.85rem;
          color: var(--text-muted);
          opacity: 0.8;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        .large-card, .small-card {
          padding: 2rem;
          min-height: 400px;
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          max-width: 300px;
        }

        .empty-icon {
          color: var(--glass-border);
          opacity: 0.5;
        }

        .empty-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .empty-content p {
          color: var(--text-muted);
        }

        .mt-4 { margin-top: 1.5rem; }

        .empty-list {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
