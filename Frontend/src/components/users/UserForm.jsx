import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../../store/slices/userSlice';
import { Toast } from 'primereact/toast';

const UserForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = React.useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        
        await dispatch(updateUser({ 
          id: user.id, 
          userData: updateData 
        })).unwrap();
        
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully'
        });
      } else {
        await dispatch(createUser(formData)).unwrap();
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully'
        });
      }
      onSave();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <Toast ref={toast} />
      
      <div className="field">
        <label htmlFor="username">Username</label>
        <InputText
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <InputText
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="password">
          {user ? 'Password (leave blank to keep current)' : 'Password'}
        </label>
        <Password
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!user}
          feedback={!user}
        />
      </div>

      <Button
        type="submit"
        label={user ? 'Update' : 'Create'}
        loading={loading}
        className="mt-4"
      />
    </form>
  );
};

export default UserForm; 