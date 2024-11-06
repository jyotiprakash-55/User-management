import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { roleApi } from '../../api/roleApi';
import { userApi } from '../../api/userApi';

const UserRoles = ({ user, onSave }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, userRolesResponse] = await Promise.all([
        roleApi.getAll(),
        userApi.getUserRoles(user.id)
      ]);

      const allRoles = Array.isArray(rolesResponse.data) ? rolesResponse.data : [];
      const userRoles = Array.isArray(userRolesResponse.data.data) ? userRolesResponse.data.data : [];

      setRoles(allRoles);
      
      // Find and set selected roles by matching IDs
      const selectedRoles = allRoles.filter(r => 
        userRoles.some(ur => ur.id === r.id)
      );
      setSelectedRoles(selectedRoles);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load roles'
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
    setSelectedRoles(newSelection);
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      // Get the IDs of selected roles
      const roleIds = selectedRoles.map(r => r.id);
      
      // Use batch operation to update roles
      await userApi.assignRoles(user.id, roleIds);
      
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Roles updated successfully'
      });

      await loadData(); // Refresh to show current state
      onSave();
    } catch (error) {
      console.error('Error updating roles:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to update roles'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <DataTable
        value={roles}
        selection={selectedRoles}
        onSelectionChange={handleSelectionChange}
        dataKey="id"
        loading={loading}
        className="p-datatable-sm"
        emptyMessage="No roles available"
      >
        <Column selectionMode="multiple" style={{ width: '3rem' }} />
        <Column field="role_name" header="Role Name" sortable />
      </DataTable>

      <div className="flex justify-content-end mt-4">
        <Button label="Done" onClick={handleDone} />
      </div>
    </div>
  );
};

export default UserRoles;