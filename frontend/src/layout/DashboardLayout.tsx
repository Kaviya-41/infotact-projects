/**
 * DashboardLayout.tsx
 * Shared layout wrapper: Sidebar + Header + scrollable page content.
 * Week 1 – Static layout. Ready for context providers / socket wrappers.
 */

import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// ── Types ──────────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
}) => {
  return (
    <div className="dashboard-shell">
      {/* Left navigation sidebar */}
      <Sidebar />

      {/* Right: header + page content */}
      <div className="main-content">
        <Header title={pageTitle} subtitle={pageSubtitle} />

        {/* Scrollable page body */}
        <main className="page-content" id="main-page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
