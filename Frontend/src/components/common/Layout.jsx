import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/')
    },
    {
      label: 'User Management',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Users',
          icon: 'pi pi-fw pi-user',
          command: () => navigate('/users')
        },
        {
          label: 'Roles',
          icon: 'pi pi-fw pi-id-card',
          command: () => navigate('/roles')
        },
        {
          label: 'Permissions',
          icon: 'pi pi-fw pi-key',
          command: () => navigate('/permissions')
        }
      ]
    },
    {
      label: 'Company',
      icon: 'pi pi-fw pi-building',
      command: () => navigate('/company')
    },
    {
      label: 'Contacts',
      icon: 'pi pi-fw pi-phone',
      command: () => navigate('/contacts')
    },
    {
      label: 'Audit',
      icon: 'pi pi-fw pi-history',
      command: () => navigate('/audit')
    }
  ];

  return (
    <div className="min-h-screen">
      <Menubar model={menuItems} className="mb-4" />
      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout; 