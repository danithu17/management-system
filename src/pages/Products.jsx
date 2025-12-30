import React, { useState } from 'react';
import { Package, Search, Plus, Filter, X, Save } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '' });

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts([...products, { ...newProduct, id: products.length + 1, status: 'In Stock' }]);
    setShowAddForm(false);
    setNewProduct({ name: '', category: '', price: '', stock: '' });
  };

  return (
    <div className="page-container">
      <header className="page-header animate-in">
        <div className="header-content">
          <h1>Products</h1>
          <p className="subtitle">Manage your inventory and catalog.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </header>

      {/* Add Product Modal Overlay */}
      {showAddForm && (
        <div className="modal-overlay animate-in">
          <div className="glass-panel modal-content">
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
                  </select>
                </div>
                <div className="form-group half">
                  <label>Price ($)</label>
                  <input 
                    type="number" 
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

      <div className="glass-panel table-section animate-in delay-1">
        <div className="toolbar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search products..." className="form-input search-input" />
          </div>
          <button className="btn-icon">
            <Filter size={18} />
          </button>
        </div>

        {products.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <span className="product-name-cell">{product.name}</span>
                  </td>
                  <td><span className="badge">{product.category}</span></td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td><span className="status-badge success">{product.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-table-state">
            <div className="empty-icon-circle">
              <Package size={32} />
            </div>
            <h3>No Products Yet</h3>
            <p>Start by adding your first product to the inventory.</p>
            <button className="add-btn-link" onClick={() => setShowAddForm(true)}>Create new product</button>
          </div>
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          background: #1e293b; /* Fallback */
          background: rgba(30, 41, 59, 0.9);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .btn-icon-sm {
          background: transparent;
          color: var(--text-muted);
          padding: 0.5rem;
          border-radius: 8px;
          transition: 0.2s;
        }

        .btn-icon-sm:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-group.half {
          flex: 1;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-text {
          background: transparent;
          color: var(--text-muted);
          padding: 0.8rem 1.5rem;
        }

        .btn-text:hover {
          color: white;
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
        
        .product-name-cell {
          font-weight: 500;
          color: white;
        }
        
        .badge {
          background: rgba(255,255,255,0.05);
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
      `}</style>
    </div>
  );
};

export default Products;
