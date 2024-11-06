import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roleApi } from '../../api/roleApi';

// Async thunks
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching roles');
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (data, { rejectWithValue }) => {
    try {
      const response = await roleApi.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating role');
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await roleApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await roleApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting role');
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create role
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      // Update role
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      // Delete role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter(role => role.id !== action.payload);
      });
  },
});

export default roleSlice.reducer; 