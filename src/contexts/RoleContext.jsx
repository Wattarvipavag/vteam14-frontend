import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';

const RoleContext = createContext();

export const RoleContextProvider = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const [role, setRole] = useState(null);
    const [isLoadingRole, setIsLoadingRole] = useState(true);

    const getUserRole = async (id) => {
        const res = await axios.get(`http://localhost:8000/api/users/oauth/${id}`);
        return res.data.user.role;
    };

    useEffect(() => {
        const fetchRole = async () => {
            if (loading) return;
            if (user) {
                try {
                    const role = await getUserRole(user.uid);
                    setRole(role);
                } catch (error) {
                    console.error('Error fetching role:', error.message);
                }
            } else {
                setRole(null);
            }
            setIsLoadingRole(false);
        };

        fetchRole();
    }, [user, loading]);

    return <RoleContext.Provider value={{ role, isLoadingRole, setRole }}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleContextProvider');
    }
    return context;
};
