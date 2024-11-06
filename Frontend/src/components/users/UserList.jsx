import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../store/slices/userSlice';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const UserList = ({ onEdit, onManagePermissions, onManageRoles, onAddNew }) => {
  const dispatch = useDispatch();
  const { users = [], loading } = useSelector(state => state.users);
  const toast = React.useRef(null);

  const loadUsers = async () => {
    try {
      await dispatch(fetchUsers()).unwrap();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load users'
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (id) => {
    confirmDialog({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await dispatch(deleteUser(id)).unwrap();
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully'
          });
          await loadUsers(); // Refresh after deletion
        } catch (error) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to delete user'
          });
        }
      }
    });
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-text"
          onClick={() => onEdit(rowData)}
          tooltip="Edit User"
        />
        <Button
          icon="pi pi-key"
          className="p-button-rounded p-button-warning p-button-text"
          onClick={() => onManagePermissions(rowData)}
          tooltip="Manage Permissions"
        />
        <Button
          icon="pi pi-users"
          className="p-button-rounded p-button-info p-button-text"
          onClick={() => onManageRoles(rowData)}
          tooltip="Manage Roles"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Delete User"
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex justify-content-between mb-4">
        <h2>Users</h2>
        <Button
          label="Add User"
          icon="pi pi-plus"
          onClick={onAddNew}
        />
      </div>

      <DataTable
        value={users}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        className="p-datatable-sm"
        emptyMessage="No users found"
      >
        <Column field="username" header="Username" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="created_at" header="Created At" sortable />
        <Column body={actionTemplate} header="Actions" style={{ width: '250px' }} />
      </DataTable>
    </div>
  );
};

export default UserList; 