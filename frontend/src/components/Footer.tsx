/**
 * Footer.tsx – Dashboard footer for DisasterIQ
 */

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer" id="dashboard-footer" role="contentinfo">
      <span className="footer__brand">
        Disaster<span>IQ</span> Intelligence Platform
      </span>
      <div className="footer__links">
        <a href="#" className="footer__link">Documentation</a>
        <a href="#" className="footer__link">Support</a>
        <a href="#" className="footer__link">Status</a>
      </div>
      <span>© {new Date().getFullYear()} DisasterIQ. All rights reserved.</span>
    </footer>
  );
};

export default Footer;
