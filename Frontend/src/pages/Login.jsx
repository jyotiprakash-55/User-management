import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { login, setUserRoles, setUserPermissions } from '../store/slices/authSlice';
import { fetchUserRoles } from '../api/roleApi';
import { fetchUserPermissions } from '../api/permissionApi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/welcome');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await dispatch(login({ username, password })).unwrap();
      
      if (loginResponse.token) {
        localStorage.setItem('token', loginResponse.token);
        
        try {
          // Fetch both roles and direct permissions
          const [rolesResponse, permissionsResponse] = await Promise.all([
            fetchUserRoles(),
            fetchUserPermissions()
          ]);
          
          dispatch(setUserRoles(rolesResponse.data));
          dispatch(setUserPermissions(permissionsResponse.data));
          
          navigate('/dashboard');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Card title="Login" className="w-full md:w-6 lg:w-4">
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
            <label htmlFor="password">Password</label>
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              required
            />
          </div>
          {error && (
            <Message severity="error" text={error} className="mb-3" />
          )}
          <Button 
            type="submit" 
            label="Login" 
            loading={loading}
            className="mb-3"
          />
        </form>
      </Card>
    </div>
  );
};

export default Login;