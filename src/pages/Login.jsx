import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isLogin) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } else {
      const result = signup(formData.name, formData.email, formData.password);
      if (result.success) {
        setSuccessMsg(result.message);
        setIsLogin(true); // Switch back to login
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="bg-orb one" />
      <div className="bg-orb two" />
      
      <div className="glass-panel login-card animate-in">
        <div className="login-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to access your dashboard' : 'Join the system and wait for approval'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="msg error">{error}</div>}
          {successMsg && <div className="msg success">{successMsg}</div>}
          
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  className="form-input with-icon"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            </div>
          )}
          
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                className="form-input with-icon"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                className="form-input with-icon"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary full-width">
            {isLogin ? 'Sign In' : 'Sign Up'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="card-footer">
          <button className="link-btn" onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 3rem;
          position: relative;
          z-index: 10;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
           background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-header p {
          color: var(--text-muted);
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .form-input.with-icon {
          padding-left: 2.8rem;
        }

        .full-width {
          width: 100%;
          margin-top: 1rem;
          justify-content: center;
        }

        .msg {
          padding: 0.8rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          text-align: center;
        }
        
        .msg.error {
           background: rgba(248, 113, 113, 0.2);
           color: #fca5a5;
           border: 1px solid rgba(248, 113, 113, 0.3);
        }
        
        .msg.success {
           background: rgba(16, 185, 129, 0.2);
           color: #6ee7b7;
           border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .card-footer {
          margin-top: 2rem;
          text-align: center;
          border-top: 1px solid var(--glass-border);
          padding-top: 1.5rem;
        }

        .link-btn {
          background: transparent;
          color: var(--primary);
          font-size: 0.9rem;
          transition: 0.2s;
        }
        
        .link-btn:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
