import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Layout from './components/common/Layout';
import Welcome from './pages/Welcome';
import Permissions from './pages/Permissions';
import Roles from './pages/Roles';
import Users from './pages/Users';
import Company from './pages/Company';
import Contacts from './pages/Contacts';
import Audit from './pages/Audit';

// PrimeReact imports
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Welcome /></Layout>} />
          <Route path="/users" element={<Layout><Users /></Layout>} />
          <Route path="/permissions" element={<Layout><Permissions /></Layout>} />
          <Route path="/roles" element={<Layout><Roles /></Layout>} />
          <Route path="/company" element={<Layout><Company /></Layout>} />
          <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
          <Route path="/audit" element={<Layout><Audit /></Layout>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;