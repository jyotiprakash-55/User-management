import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, deleteRole } from '../../store/slices/roleSlice';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const RoleList = ({ onEdit, onManagePermissions, onAddNew }) => {
  const dispatch = useDispatch();
  const { roles = [], loading } = useSelector(state => state.roles);
  const toast = React.useRef(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      await dispatch(fetchRoles()).unwrap();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load roles'
      });
    }
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: 'Are you sure you want to delete this role?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await dispatch(deleteRole(id)).unwrap();
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Role deleted successfully'
          });
          await loadRoles();
        } catch (error) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to delete role'
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
          tooltip="Edit Role"
        />
        <Button
          icon="pi pi-key"
          className="p-button-rounded p-button-warning p-button-text"
          onClick={() => onManagePermissions(rowData)}
          tooltip="Manage Permissions"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Delete Role"
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex justify-content-between mb-4">
        <h2>Roles</h2>
        <Button
          label="Add Role"
          icon="pi pi-plus"
          onClick={onAddNew}
        />
      </div>

      <DataTable
        value={roles}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        className="p-datatable-sm"
        emptyMessage="No roles found"
      >
        <Column field="role_name" header="Role Name" sortable />
        <Column body={actionTemplate} header="Actions" style={{ width: '200px' }} />
      </DataTable>
    </div>
  );
};

export default RoleList; 