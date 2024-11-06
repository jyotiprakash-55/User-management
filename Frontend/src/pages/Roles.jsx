import React, { useState } from 'react';
import { Card } from 'primereact/card';
import RoleList from '../components/roles/RoleList';
import RoleForm from '../components/roles/RoleForm';
import RolePermissions from '../components/roles/RolePermissions';
import { Dialog } from 'primereact/dialog';
import { useDispatch } from 'react-redux';
import { fetchRoles } from '../store/slices/roleSlice';

const Roles = () => {
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const dispatch = useDispatch();

  const handleEdit = (role) => {
    setSelectedRole(role);
    setShowRoleForm(true);
  };

  const handleManagePermissions = (role) => {
    setSelectedRole(role);
    setShowPermissionsDialog(true);
  };

  const handleSave = async () => {
    setShowRoleForm(false);
    await dispatch(fetchRoles());
  };

  const handlePermissionsSave = async () => {
    setShowPermissionsDialog(false);
    await dispatch(fetchRoles());
  };

  return (
    <div>
      <Card title="Role Management">
        <RoleList 
          onEdit={handleEdit}
          onManagePermissions={handleManagePermissions}
          onAddNew={() => {
            setSelectedRole(null);
            setShowRoleForm(true);
          }}
        />
      </Card>

      <Dialog
        visible={showRoleForm}
        onHide={() => setShowRoleForm(false)}
        header={selectedRole ? 'Edit Role' : 'Create Role'}
        style={{ width: '450px' }}
      >
        <RoleForm
          role={selectedRole}
          onSave={handleSave}
        />
      </Dialog>

      <Dialog
        visible={showPermissionsDialog}
        onHide={() => setShowPermissionsDialog(false)}
        header="Manage Role Permissions"
        style={{ width: '600px' }}
      >
        <RolePermissions
          role={selectedRole}
          onSave={handlePermissionsSave}
        />
      </Dialog>
    </div>
  );
};

export default Roles; 