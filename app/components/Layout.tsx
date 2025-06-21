import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import AnimatedBlobs from './AnimatedBlobs';

type LayoutProps = {
  children: React.ReactNode;
  hideStaticBackground?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, hideStaticBackground = false }) => {
  return (
    <div className="bg-black text-white min-h-screen">
      {!hideStaticBackground && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/images/hero.jpg)' }} 
        />
      )}
      <div className="fixed inset-0 z-10">
        <AnimatedBlobs />
      </div>
      <div className="relative z-20">
        <NavBar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 