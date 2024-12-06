import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/index.scss';
import { BrowserRouter } from 'react-router-dom';
import { RoleContextProvider } from './contexts/RoleContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <RoleContextProvider>
                <App />
            </RoleContextProvider>
        </BrowserRouter>
    </StrictMode>
);
