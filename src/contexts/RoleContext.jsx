import { createContext, useState, useContext } from 'react';

const RoleContext = createContext();

export const RoleContextProvider = ({ children }) => {
    const [role, setRole] = useState('admin');

    return <RoleContext.Provider value={[role, setRole]}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleContextProvider');
    }
    return context;
};
