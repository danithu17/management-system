import React, { useState } from 'react';
import { FileText, Download, Users, UserCheck, UserPlus, ArrowLeft, Package, Box, DollarSign, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const { pendingUsers } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'users'

  const [products] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  // User Stats
  const approvedUsers = pendingUsers.filter(u => u.status === 'approved');
  const actualPending = pendingUsers.filter(u => u.status === 'pending');

  // Product Stats
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const lowStockItems = products.filter(p => p.stock < 5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      <header className="page-header animate-in no-print">
        <div className="header-content">
          <div className="breadcrumb" onClick={() => navigate(-1)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </div>
          <h1>System Reports</h1>
          <p className="subtitle">Comprehensive analysis of your system data.</p>
        </div>
        <button className="btn-primary" onClick={handlePrint}>
          <Download size={18} />
          <span>Print Report</span>
        </button>
      </header>

      <div className="report-tabs no-print animate-in delay-1">
        <button 
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={18} />
          Inventory Report
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          User Report
        </button>
      </div>

      {/* Print-only Header */}
      <div className="print-header only-print">
        <h1>{activeTab === 'inventory' ? 'Inventory Management Report' : 'User Management Report'}</h1>
        <p>Generated on {new Date().toLocaleString()}</p>
        <hr />
      </div>

      {activeTab === 'inventory' ? (
        <div className="report-content animate-in delay-2">
          <div className="stats-grid">
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#3b82f620', color: '#3b82f6' }}>
                <Package size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label text-muted">Total Products</span>
                <div className="stat-value text-gradient">{products.length}</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#10b98120', color: '#10b981' }}>
                <Box size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label text-muted">Total Stock</span>
                <div className="stat-value text-gradient">{totalStock}</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
                <DollarSign size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label text-muted">Inventory Value</span>
                <div className="stat-value text-gradient">${totalValue.toLocaleString()}</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#ef444420', color: '#ef4444' }}>
                <AlertTriangle size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label text-muted">Low Stock</span>
                <div className="stat-value text-gradient">{lowStockItems.length}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel report-section">
            <div className="section-header">
              <h3>Detailed Product List</h3>
              <span className="text-muted no-print">{products.length} Total Items</span>
            </div>
            <div className="report-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${parseFloat(product.price).toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={`status-badge ${product.stock > 0 ? 'success' : 'danger'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No product data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="report-content animate-in delay-2">
          <div className="stats-grid">
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#3b82f620', color: '#3b82f6' }}>
                <Users size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label text-muted">Total Users</span>
                <div className="stat-value text-gradient">{pendingUsers.length}</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#10b98120', color: '#10b981' }}>
                <UserCheck size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label text-muted">Active Users</span>
                <div className="stat-value text-gradient">{approvedUsers.length}</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
                <UserPlus size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label text-muted">Pending</span>
                <div className="stat-value text-gradient">{actualPending.length}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel report-section">
            <div className="section-header">
              <h3>User Registration Summary</h3>
              <span className="text-muted no-print">{pendingUsers.length} Total Registered</span>
            </div>
            <div className="report-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reg. Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.length > 0 ? (
                    [...pendingUsers].reverse().map(user => (
                      <tr key={user.id}>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role || 'User'}</td>
                        <td>
                          <span className={`status-badge ${user.status === 'approved' ? 'success' : 'warning'}`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No user data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .reports-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .report-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem;
          border-radius: 12px;
          width: fit-content;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          color: var(--text-muted);
          transition: 0.3s;
          font-weight: 500;
        }

        .tab-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
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
          margin-top: 1rem;
        }

        .only-print {
          display: none;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .only-print {
            display: block !important;
          }
          .reports-page {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .glass-panel {
            border: 1px solid #eee !important;
            background: white !important;
            box-shadow: none !important;
            color: black !important;
            margin-bottom: 2rem;
          }
          .text-gradient {
            background: none !important;
            -webkit-text-fill-color: black !important;
            color: black !important;
          }
          .status-badge {
            border: 1px solid #ccc !important;
            color: black !important;
          }
          .data-table th {
            background: #f5f5f5 !important;
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
