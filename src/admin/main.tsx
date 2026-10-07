import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';

const container = document.getElementById('admin-root');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
} else {
  console.error('Could not find #admin-root container to mount AdminApp');
}
