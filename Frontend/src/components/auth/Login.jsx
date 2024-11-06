import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { login } from '../../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ username, password })).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
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
          <Button type="submit" label="Login" className="mt-2" />
        </form>
      </Card>
    </div>
  );
};

export default Login; 