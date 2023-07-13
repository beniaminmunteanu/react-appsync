import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import './tailwind.css'; // Import the Tailwind CSS file
import App from './App';




import config from './aws-exports'
import { Amplify } from 'aws-amplify';

import {AmplifyProvider} from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

Amplify.configure(config)
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AmplifyProvider>
    <App />
    </AmplifyProvider>
  </React.StrictMode>
);

