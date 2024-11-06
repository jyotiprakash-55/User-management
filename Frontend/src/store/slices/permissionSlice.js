import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionApi } from '../../api/permissionApi';

export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching permissions');
    }
  }
);

export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async (data, { rejectWithValue }) => {
    try {
      const response = await permissionApi.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating permission');
    }
  }
);

export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await permissionApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating permission');
    }
  }
);

export const deletePermission = createAsyncThunk(
  'permissions/deletePermission',
  async (id, { rejectWithValue }) => {
    try {
      await permissionApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete permission'
      );
    }
  }
);

const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
        state.error = null;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.permissions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.permissions[index] = action.payload;
        }
      })
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = state.permissions.filter(
          permission => permission.id !== action.payload
        );
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default permissionSlice.reducer; 