import { DollarSign, Users, TrendingUp, Activity, Plus, Package, Box, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Dashboard = () => {
  const { user, pendingUsers } = useAuth();
  const navigate = useNavigate();
  
  const [products] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });
  
  const approvedCount = pendingUsers.filter(u => u.status === 'approved').length;
  const isAdmin = user?.role === 'admin';

  const stats = isAdmin ? [
    { label: 'Total Revenue', value: '$0.00', change: '0%', icon: DollarSign, color: '#10b981' },
    { label: 'Active Users', value: approvedCount.toString(), change: '0%', icon: Users, color: '#3b82f6' },
    { label: 'Sales', value: '0', change: '0%', icon: TrendingUp, color: '#f59e0b' },
    { label: 'Active Now', value: '0', change: '0%', icon: Activity, color: '#ec4899' },
  ] : [
    { label: 'My Products', value: products.length.toString(), change: 'Total items', icon: Package, color: '#3b82f6' },
    { label: 'Low Stock', value: products.filter(p => p.stock < 5 && p.stock > 0).length.toString(), change: 'Items < 5', icon: Box, color: '#f59e0b' },
    { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length.toString(), change: 'Immediate action', icon: X, color: '#ef4444' },
    { label: 'Total Value', value: `$${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}`, change: 'Inventory value', icon: DollarSign, color: '#10b981' },
  ];

  return (
    <div className="dashboard">
      <header className="page-header animate-in">
        <div className="header-content">
          <h1>Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="subtitle">
            {isAdmin 
              ? "System Overview and Management" 
              : "Here's an overview of your inventory."}
          </p>
        </div>
        {isAdmin && (
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
              <div className="stat-change">
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid animate-in delay-2">
        <div className="glass-panel large-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            {!isAdmin && products.length === 0 && <button className="btn-text" onClick={() => navigate('/products')}>Add Products</button>}
          </div>
          
          {products.length > 0 && !isAdmin ? (
            <div className="recent-list">
               <table className="data-table">
                 <thead>
                   <tr>
                     <th>Recent Products</th>
                     <th>Stock</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {products.slice(0, 5).map(p => (
                     <tr key={p.id}>
                       <td>{p.name}</td>
                       <td>{p.stock}</td>
                       <td>
                         <span className={`status-badge ${p.stock > 0 ? 'success' : 'danger'}`}>
                           {p.stock > 0 ? 'In Stock' : 'Out'}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-content">
                <Activity size={48} className="empty-icon" />
                <h3>No Activity Yet</h3>
                <p>Your recent dashboard activity will show up here.</p>
                {!isAdmin && <button className="btn-primary mt-4" onClick={() => navigate('/products')}>Create Product</button>}
              </div>
            </div>
          )}
        </div>
        
        <div className="glass-panel small-card">
          <h3>Top Categories</h3>
          {products.length > 0 ? (
             <div className="category-stats">
                {['Electronics', 'Clothing', 'Home', 'Other'].map(cat => {
                  const count = products.filter(p => p.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <div key={cat} className="category-item">
                      <span>{cat}</span>
                      <span className="badge">{count}</span>
                    </div>
                  );
                })}
             </div>
          ) : (
            <div className="empty-list">
               <p>No categories found.</p>
            </div>
          )}
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

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
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
          height: 300px;
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

        .category-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
        }

        .badge {
          background: var(--primary);
          color: white;
          padding: 0.1rem 0.5rem;
          border-radius: 99px;
          font-size: 0.8rem;
        }

        .empty-list {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-style: italic;
        }

        .status-badge {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 8px;
        }
        .status-badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-badge.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      `}</style>
    </div>
  );
};

export default Dashboard;
