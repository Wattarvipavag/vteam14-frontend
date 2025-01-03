import { createContext, useState, useContext } from 'react';

const DataRefreshContext = createContext();

export const DataRefreshProvider = ({ children }) => {
    const [refresh, setRefresh] = useState(false);
    const [startSim, setStartSim] = useState(false);

    const triggerRefresh = () => setRefresh((prev) => !prev);

    return <DataRefreshContext.Provider value={{ refresh, triggerRefresh, startSim, setStartSim }}>{children}</DataRefreshContext.Provider>;
};

export const useDataRefresh = () => useContext(DataRefreshContext);
export const useStartSim = () => useContext(DataRefreshContext);
