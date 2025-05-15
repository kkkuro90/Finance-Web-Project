import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar/MobileSidebar';

const SidebarSwitcher = ({ activeTab, setActiveTab }) => {
  const isMobile = useMediaQuery({ maxWidth: 991 });

  return isMobile ? (
    <MobileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
  ) : (
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
  );
};

export default SidebarSwitcher;