import React, { useState } from 'react';
import { Card } from 'primereact/card';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import UserPermissions from '../components/users/UserPermissions';
import UserRoles from '../components/users/UserRoles';
import { Dialog } from 'primereact/dialog';

const Users = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showRolesDialog, setShowRolesDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleManagePermissions = (user) => {
    setSelectedUser(user);
    setShowPermissionsDialog(true);
  };

  const handleManageRoles = (user) => {
    setSelectedUser(user);
    setShowRolesDialog(true);
  };

  return (
    <div>
      <Card title="User Management">
        <UserList 
          onEdit={handleEdit}
          onManagePermissions={handleManagePermissions}
          onManageRoles={handleManageRoles}
          onAddNew={() => {
            setSelectedUser(null);
            setShowUserForm(true);
          }}
        />
      </Card>

      <Dialog
        visible={showUserForm}
        onHide={() => setShowUserForm(false)}
        header={selectedUser ? 'Edit User' : 'Create User'}
        style={{ width: '450px' }}
      >
        <UserForm
          user={selectedUser}
          onSave={() => setShowUserForm(false)}
        />
      </Dialog>

      <Dialog
        visible={showPermissionsDialog}
        onHide={() => setShowPermissionsDialog(false)}
        header="Manage User Permissions"
        style={{ width: '600px' }}
      >
        <UserPermissions
          user={selectedUser}
          onSave={() => setShowPermissionsDialog(false)}
        />
      </Dialog>

      <Dialog
        visible={showRolesDialog}
        onHide={() => setShowRolesDialog(false)}
        header="Manage User Roles"
        style={{ width: '600px' }}
      >
        <UserRoles
          user={selectedUser}
          onSave={() => setShowRolesDialog(false)}
        />
      </Dialog>
    </div>
  );
};

export default Users;