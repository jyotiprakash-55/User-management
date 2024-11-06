import React from 'react';
import { Card } from 'primereact/card';

const Welcome = () => {
  return (
    <div>
      <Card title="Welcome to User Management System">
        <div className="p-4">
          <h2>Features:</h2>
          <ul className="list-disc pl-6 mt-3">
            <li>User Management</li>
            <li>Role Management</li>
            <li>Permission Management</li>
            <li>Role-based Access Control</li>
          </ul>
          
          <h3 className="mt-4">Quick Links:</h3>
          <ul className="list-disc pl-6 mt-2">
            <li>Manage Users - Add, edit, delete users and assign roles/permissions</li>
            <li>Manage Roles - Create roles and assign permissions</li>
            <li>Manage Permissions - Create and manage permissions</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Welcome; 