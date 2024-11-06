import React, { useState } from 'react';
import { Card } from 'primereact/card';
import PermissionList from '../components/permissions/PermissionList';
import PermissionForm from '../components/permissions/PermissionForm';
import { Dialog } from 'primereact/dialog';
import { useDispatch } from 'react-redux';
import { fetchPermissions } from '../store/slices/permissionSlice';

const Permissions = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const dispatch = useDispatch();

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setShowForm(true);
  };

  const handleSave = async () => {
    setShowForm(false);
    await dispatch(fetchPermissions());
  };

  return (
    <div>
      <Card title="Permission Management">
        <PermissionList 
          onEdit={handleEdit}
          onAddNew={() => {
            setSelectedPermission(null);
            setShowForm(true);
          }}
        />
      </Card>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header={selectedPermission ? 'Edit Permission' : 'Create Permission'}
        style={{ width: '450px' }}
      >
        <PermissionForm
          permission={selectedPermission}
          onSave={handleSave}
        />
      </Dialog>
    </div>
  );
};

export default Permissions;