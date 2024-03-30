import React, { useContext, useEffect, useState } from "react";
import { UserDetails } from "../types/User";

interface AppContextProps {
  userDetails: UserDetails | undefined;
  isLoggedIn: boolean;
  setUserDetails: (details: UserDetails | undefined) => void;
}

const AppContext = React.createContext<AppContextProps | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>(
    () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      return storedUserDetails ? JSON.parse(storedUserDetails) : undefined;
    }
  );

  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    } else {
      localStorage.removeItem("userDetails");
    }
  }, [userDetails]);

  const handleSetUserDetails = (details: UserDetails | undefined) => {
    setUserDetails(details);
  };

  const isLoggedIn = !!userDetails;

  return (
    <AppContext.Provider
      value={{
        userDetails,
        setUserDetails: handleSetUserDetails,
        isLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
