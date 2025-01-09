import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import axios from 'axios';

const RoleContext = createContext();

export const RoleContextProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, authLoading] = useAuthState(auth);

    useEffect(() => {
        const fetchRole = async () => {
            if (authLoading) return;
            if (role) return;

            if (user) {
                try {
                    const token = await user.getIdToken(true);
                    const res = await axios.get(`http://localhost:8000/api/users/oauth/${user.uid}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setRole(res.data.user.role);
                } catch (error) {
                    console.error('Error fetching role:', error.message);
                    setRole(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setRole(null);
                setLoading(false);
            }
        };

        fetchRole();
    }, [user, authLoading]);

    return <RoleContext.Provider value={{ role, setRole, loading }}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
    return useContext(RoleContext);
};
