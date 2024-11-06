import React from 'react';
import { Card } from 'primereact/card';

const UnderDevelopment = ({ pageName }) => {
  return (
    <Card>
      <div className="flex flex-column align-items-center">
        <i className="pi pi-cog pi-spin" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
        <h2>{pageName}</h2>
        <p>This page is currently under development. Please check back later.</p>
      </div>
    </Card>
  );
};

export default UnderDevelopment; 