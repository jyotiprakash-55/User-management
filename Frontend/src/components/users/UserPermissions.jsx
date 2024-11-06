import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { permissionApi } from '../../api/permissionApi';
import { userApi } from '../../api/userApi';

const UserPermissions = ({ user, onSave }) => {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get all permissions and user's current permissions
      const [allPermissionsRes, userPermissionsRes] = await Promise.all([
        permissionApi.getAll(),
        userApi.getUserPermissions(user.id)
      ]);

      // Ensure we have arrays
      const allPermissions = Array.isArray(allPermissionsRes.data) ? allPermissionsRes.data : [];
      const userPermissions = Array.isArray(userPermissionsRes.data.data) ? userPermissionsRes.data.data : [];

      setPermissions(allPermissions);
      
      // Find and set selected permissions by matching IDs
      const selectedPerms = allPermissions.filter(p => 
        userPermissions.some(up => up.id === p.id)
      );
      setSelectedPermissions(selectedPerms);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load permissions'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const handleSelectionChange = (e) => {
    const newSelection = Array.isArray(e.value) ? e.value : [];
    setSelectedPermissions(newSelection);
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      // Get the IDs of selected permissions
      const permissionIds = selectedPermissions.map(p => p.id);
      
      // Use batch operation to update permissions
      await userApi.assignPermission(user.id, permissionIds);
      
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Permissions updated successfully'
      });

      await loadData(); // Refresh to show current state
      onSave();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to update permissions'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <DataTable
        value={permissions}
        selection={selectedPermissions}
        onSelectionChange={handleSelectionChange}
        dataKey="id"
        loading={loading}
        className="p-datatable-sm"
        emptyMessage="No permissions available"
      >
        <Column selectionMode="multiple" style={{ width: '3rem' }} />
        <Column field="permission_name" header="Permission Name" sortable />
      </DataTable>

      <div className="flex justify-content-end mt-4">
        <Button label="Done" onClick={handleDone} />
      </div>
    </div>
  );
};

export default UserPermissions; 