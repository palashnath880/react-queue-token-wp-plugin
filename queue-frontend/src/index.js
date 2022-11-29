import React from 'react';
import './index.css';
import App from './App';
import QueueContextProvider from './contexts/QueueContextProvider';
import { render } from '@wordpress/element';
import { Toaster } from 'react-hot-toast';

render(
  <React.StrictMode>
    <QueueContextProvider>
      <App />
      <Toaster
        position="top-center"
      />
    </QueueContextProvider>
  </React.StrictMode>, document.getElementById('queue_app')
);
