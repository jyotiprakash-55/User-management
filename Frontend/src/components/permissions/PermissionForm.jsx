import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { createPermission, updatePermission } from '../../store/slices/permissionSlice';
import { Toast } from 'primereact/toast';

const PermissionForm = ({ permission, onSave }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = React.useRef(null);

  useEffect(() => {
    if (permission) {
      setName(permission.permission_name);
    } else {
      setName('');
    }
  }, [permission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (permission) {
        await dispatch(updatePermission({ 
          id: permission.id, 
          data: { name } 
        })).unwrap();
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Permission updated successfully'
        });
      } else {
        await dispatch(createPermission({ name })).unwrap();
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Permission created successfully'
        });
      }
      onSave();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'An error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <Toast ref={toast} />
      
      <div className="field">
        <label htmlFor="name">Permission Name</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        label={permission ? 'Update' : 'Create'}
        loading={loading}
        className="mt-4"
      />
    </form>
  );
};

export default PermissionForm;