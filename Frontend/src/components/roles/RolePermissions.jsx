import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { permissionApi } from '../../api/permissionApi';
import { roleApi } from '../../api/roleApi';

const RolePermissions = ({ role, onSave }) => {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get all permissions and role's current permissions
      const [allPermissionsRes, rolePermissionsRes] = await Promise.all([
        permissionApi.getAll(),
        roleApi.getRolePermissions(role.id)
      ]);

      // Ensure we have arrays
      const allPermissions = Array.isArray(allPermissionsRes.data) ? allPermissionsRes.data : [];
      const rolePermissions = Array.isArray(rolePermissionsRes.data.data) ? rolePermissionsRes.data.data : [];

      setPermissions(allPermissions);
      
      // Find and set selected permissions by matching IDs
      const selectedPerms = allPermissions.filter(p => 
        rolePermissions.some(rp => rp.id === p.id)
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

  // Load data when component mounts or role changes
  useEffect(() => {
    if (role?.id) {
      loadData();
    }
  }, [role]);

  const handleSelectionChange = (e) => {
    const newSelection = Array.isArray(e.value) ? e.value : [];
    setSelectedPermissions(newSelection);
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      // Get current permissions to compare
      const rolePermissionsRes = await roleApi.getRolePermissions(role.id);
      const currentPermissions = Array.isArray(rolePermissionsRes.data.data) ? rolePermissionsRes.data.data : [];
      
      // Find permissions to add and remove
      const currentIds = currentPermissions.map(p => p.id);
      const newIds = selectedPermissions.map(p => p.id);

      const toAdd = selectedPermissions.filter(p => !currentIds.includes(p.id));
      const toRemove = currentPermissions.filter(p => !newIds.includes(p.id));

      // Handle additions
      for (const permission of toAdd) {
        await roleApi.assignPermission(role.id, permission.id);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: `Added permission: ${permission.permission_name}`
        });
      }

      // Handle removals
      for (const permission of toRemove) {
        await roleApi.removePermission(role.id, permission.id);
        toast.current.show({
          severity: 'info',
          summary: 'Success',
          detail: `Removed permission: ${permission.permission_name}`
        });
      }

      // Refresh the data after all changes
      await loadData();
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
        value={permissions || []}
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

export default RolePermissions; 