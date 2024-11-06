import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import permissionReducer from './slices/permissionSlice';
import authReducer from './slices/authSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    roles: roleReducer,
    permissions: permissionReducer,
  },
}); 