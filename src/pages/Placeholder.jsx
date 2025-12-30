import React from 'react';
import { Construction } from 'lucide-react';

const Placeholder = ({ title }) => {
  return (
    <div className="placeholder-page">
      <div className="glass-panel p-container">
        <Construction size={48} className="icon" />
        <h1>{title}</h1>
        <p>This module is currently under development.</p>
      </div>
      <style>{`
        .placeholder-page {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-container {
          padding: 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .icon {
          color: var(--primary);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Placeholder;
