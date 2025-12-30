import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, pendingUsers } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'User Management', path: '/users', badge: pendingUsers?.filter(u => u.status === 'pending').length },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="sidebar">
      <div className="glass-bg-layer" />
      <div className="sidebar-content">
        <div className="logo-container">
          <h2>AdminSystem</h2>
        </div>
      
      
      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-item-content">
               <item.icon size={20} />
               <span>{item.label}</span>
            </div>
            {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="user-profile">
        <button onClick={logout} className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      </div> {/* End sidebar-content */}

      <style>{`
        .sidebar {
          width: 260px;
          height: 95vh;
          position: fixed;
          top: 2.5vh;
          left: 1rem;
          z-index: 100;
          border-radius: var(--radius);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          overflow: hidden; /* For the glass layer */
        }

        /* Distinct glass layer for sidebar to avoid opacity inheritance issues */
        .glass-bg-layer {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.6); /* Darker semi-transparent base */
          backdrop-filter: blur(24px); /* Stronger blur */
          z-index: 0;
        }

        .sidebar-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius);
        }

        .logo-container {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }


        .logo-container h2 {
          font-weight: 700;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between; /* Space for badge */
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          color: var(--text-muted);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .nav-item-content {
           display: flex;
           align-items: center;
           gap: 0.75rem;
        }

        .sidebar-badge {
           background: #ef4444;
           color: white;
           font-size: 0.75rem;
           font-weight: 600;
           padding: 0.15rem 0.5rem;
           border-radius: 12px;
           min-width: 20px;
           text-align: center;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: var(--primary);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          background: transparent;
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(248, 113, 113, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
