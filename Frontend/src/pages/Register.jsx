import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { register } from '../store/slices/authSlice';
import { fetchRoles } from '../store/slices/roleSlice';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const toast = React.useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector(state => state.auth);
  const { roles } = useSelector(state => state.roles);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register({ 
        username, 
        email, 
        password,
        roles: selectedRoles.map(role => role.id)
      })).unwrap();
      
      setRegistrationSuccess(true);
      toast.current.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Registration successful! Please login.' 
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err.message || 'Registration failed' 
      });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // If registration is successful, don't allow navigation away until timeout completes
  if (registrationSuccess) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <Toast ref={toast} />
        <Card title="Registration Successful" className="w-full md:w-6 lg:w-4">
          <div className="text-center">
            <p>Redirecting to login page...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Toast ref={toast} />
      <Card title="Register" className="w-full md:w-6 lg:w-4">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <label htmlFor="username">Username</label>
            <InputText 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText 
              id="email" 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="roles">Roles</label>
            <MultiSelect
              id="roles"
              value={selectedRoles}
              options={roles}
              onChange={(e) => setSelectedRoles(e.value)}
              optionLabel="role_name"
              placeholder="Select Roles"
              display="chip"
              className="w-full"
            />
          </div>
          {error && (
            <Message severity="error" text={error.message} className="mb-3" />
          )}
          <Button 
            type="submit" 
            label="Register" 
            loading={loading}
            className="mb-3"
          />
          <div className="text-center">
            <Button
              label="Already have an account? Login"
              link
              onClick={handleLoginClick}
              className="p-0"
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register; 