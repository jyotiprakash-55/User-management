import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPermissions, deletePermission } from '../../store/slices/permissionSlice';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const PermissionList = ({ onEdit, onAddNew }) => {
  const dispatch = useDispatch();
  const { permissions = [], loading } = useSelector(state => state.permissions);
  const toast = React.useRef(null);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      await dispatch(fetchPermissions()).unwrap();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load permissions'
      });
    }
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: 'Are you sure you want to delete this permission?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await dispatch(deletePermission(id)).unwrap();
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Permission deleted successfully'
          });
          await loadPermissions();
        } catch (error) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to delete permission'
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
          tooltip="Edit Permission"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Delete Permission"
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex justify-content-between mb-4">
        <h2>Permissions</h2>
        <Button
          label="Add Permission"
          icon="pi pi-plus"
          onClick={() => {
            onAddNew();
            loadPermissions();
          }}
        />
      </div>

      <DataTable
        value={permissions}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        className="p-datatable-sm"
        emptyMessage="No permissions found"
      >
        <Column field="permission_name" header="Permission Name" sortable />
        <Column body={actionTemplate} header="Actions" style={{ width: '150px' }} />
      </DataTable>
    </div>
  );
};

export default PermissionList;