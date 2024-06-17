import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GlobalContextProps {
  isLogged: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      setIsLogged(true);
    }
    setLoading(false);
  };

  const login = (token: string) => {
    AsyncStorage.setItem("token", token);
    setIsLogged(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLogged(false);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
