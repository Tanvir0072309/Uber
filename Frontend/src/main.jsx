import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import UserContextProvider from './context/UserContext.jsx';
import CaptainContextProvider from './context/CaptainContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <CaptainContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CaptainContextProvider>
    </UserContextProvider>
  </StrictMode>,
);