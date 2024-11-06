import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { createRole, updateRole } from '../../store/slices/roleSlice';
import { Toast } from 'primereact/toast';

const RoleForm = ({ role, onSave }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = React.useRef(null);

  useEffect(() => {
    if (role) {
      setName(role.role_name);
    } else {
      setName('');
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role) {
        await dispatch(updateRole({ 
          id: role.id, 
          data: { name } 
        })).unwrap();
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Role updated successfully'
        });
      } else {
        await dispatch(createRole({ name })).unwrap();
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Role created successfully'
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
        <label htmlFor="name">Role Name</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        label={role ? 'Update' : 'Create'}
        loading={loading}
        className="mt-4"
      />
    </form>
  );
};

export default RoleForm; 