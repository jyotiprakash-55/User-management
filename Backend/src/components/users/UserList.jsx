import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';
import { Dialog } from 'primereact/dialog';
import UserForm from './UserForm';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-success p-button-text" 
          onClick={() => {
            setSelectedUser(rowData);
            setShowDialog(true);
          }}
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger p-button-text" 
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex justify-content-between mb-3">
        <h2>Users</h2>
        <Button 
          label="Add User" 
          icon="pi pi-plus" 
          onClick={() => {
            setSelectedUser(null);
            setShowDialog(true);
          }}
        />
      </div>

      <DataTable 
        value={users} 
        loading={loading}
        paginator 
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
      >
        <Column field="username" header="Username" sortable />
        <Column field="email" header="Email" sortable />
        <Column body={actionTemplate} header="Actions" />
      </DataTable>

      <Dialog 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        header={selectedUser ? 'Edit User' : 'Add User'}
        style={{ width: '450px' }}
      >
        <UserForm 
          user={selectedUser} 
          onSave={() => {
            setShowDialog(false);
            dispatch(fetchUsers());
          }}
        />
      </Dialog>
    </div>
  );
};

export default UserList; 