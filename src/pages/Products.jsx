import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Filter, X, Save, Trash2, PieChart, Tag, DollarSign, Box } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = { 
      ...newProduct, 
      id: Date.now(), 
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) > 0 ? 'In Stock' : 'Out of Stock' 
    };
    setProducts([product, ...products]);
    setShowAddForm(false);
    setNewProduct({ name: '', category: '', price: '', stock: '' });
  };

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Simple Analytics
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const outOfStock = products.filter(p => p.stock === 0).length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: '#3b82f6' },
    { label: 'Total Stock', value: totalStock, icon: Box, color: '#10b981' },
    { label: 'Inventory Value', value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: '#f59e0b' },
    { label: 'Out of Stock', value: outOfStock, icon: X, color: '#ef4444' },
  ];

  return (
    <div className="products-page">
      <header className="page-header animate-in">
        <div className="header-content">
          <h1>Inventory Management</h1>
          <p className="subtitle">Track and manage your product catalog.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </header>

      {/* Analytics Summary */}
      <div className="stats-grid animate-in delay-1" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, index) => (
          <div key={index} className="glass-panel stat-card">
            <div className="stat-icon-wrapper" style={{ background: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label text-muted" style={{ fontSize: '0.8rem' }}>{stat.label}</span>
              <div className="stat-value" style={{ fontSize: '1.4rem', fontWeight: '700' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel table-section animate-in delay-2">
        <div className="toolbar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="form-input search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-wrapper">
            <Filter size={18} className="filter-icon" />
            <select 
              className="form-input filter-input"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-info-cell">
                      <div className="product-avatar">{product.name.charAt(0)}</div>
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td><span className="badge">{product.category}</span></td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.stock > 0 ? 'success' : 'danger'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon-sm danger" onClick={() => deleteProduct(product.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-table-state">
            <div className="empty-icon-circle">
              <Package size={32} />
            </div>
            <h3>{searchTerm || filterCategory !== 'All' ? 'No Matching Products' : 'No Products Yet'}</h3>
            <p>
              {searchTerm || filterCategory !== 'All' 
                ? 'Try adjusting your search or filters.' 
                : 'Start by adding your first product to the inventory.'}
            </p>
            {!searchTerm && filterCategory === 'All' && (
              <button className="add-btn-link" onClick={() => setShowAddForm(true)}>Create new product</button>
            )}
          </div>
        )}
      </div>

      {/* Add Product Modal Overlay */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Product</h2>
              <button className="btn-icon-sm" onClick={() => setShowAddForm(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Wireless Headphones"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Category</label>
                  <select 
                    className="form-input"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group half">
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-text" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Save size={18} /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .table-section {
          padding: 1.5rem;
          min-height: 450px;
        }

        .toolbar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
        }

        .filter-wrapper {
          position: relative;
          width: 200px;
        }

        .search-icon, .filter-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input, .filter-input {
          padding-left: 3rem;
        }

        .product-info-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .product-avatar {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--primary);
        }

        .product-name {
          font-weight: 500;
        }

        .badge {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
          border: 1px solid var(--glass-border);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-badge.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-content {
          max-width: 500px;
          width: 100%;
          padding: 2.5rem;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .form-row { display: flex; gap: 1rem; }
        .form-group.half { flex: 1; }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-text {
          color: var(--text-muted);
          transition: 0.2s;
        }
        .btn-text:hover { color: white; }

        .btn-icon-sm.danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default Products;
