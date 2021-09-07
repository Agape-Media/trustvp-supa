import { createContext, useContext, useState } from "react";

const AppContext = createContext();
const AppUpdateContext = createContext();

export function ContextProvider({ children }) {
  const [sharedState, setSharedState] = useState(null);

  const updateContext = (payload) => {
    setSharedState(payload);
  };

  return (
    <AppContext.Provider value={sharedState}>
      <AppUpdateContext.Provider value={updateContext}>
        {children}
      </AppUpdateContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

export function useAppUpdateContext() {
  return useContext(AppUpdateContext);
}
