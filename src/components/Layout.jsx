import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app-container">
      <div className="bg-orb one" />
      <div className="bg-orb two" />
      <Sidebar />
      <main className="main-content animate-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
