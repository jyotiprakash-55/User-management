import React from 'react';
import { Card } from 'primereact/card';

const UnderConstruction = ({ pageName }) => {
  return (
    <Card>
      <div className="flex flex-column align-items-center">
        <i className="pi pi-cog text-6xl mb-4"></i>
        <h2>{pageName}</h2>
        <p>This page is under construction.</p>
      </div>
    </Card>
  );
};

export default UnderConstruction; 