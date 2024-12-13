import { createContext, useState, useContext } from 'react';

const ShowFormContext = createContext();

export const ShowFormContextProvider = ({ children }) => {
    const [showForm, setShowForm] = useState(false);
    return <ShowFormContext.Provider value={{ showForm, setShowForm }}>{children}</ShowFormContext.Provider>;
};

export const useShowForm = () => {
    return useContext(ShowFormContext);
};
