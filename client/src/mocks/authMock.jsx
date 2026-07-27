import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthMockContext = createContext(null);

export const Auth0Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("demo_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const loginWithRedirect = () => {
    const email = prompt("Enter a demo email to log in:", "demo@example.com");
    if (email) {
      const demoUser = {
        email,
        name: email.split('@')[0],
        nickname: email.split('@')[0],
        picture: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      };
      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem("demo_user", JSON.stringify(demoUser));
    }
  };

  const loginWithPopup = loginWithRedirect;

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("demo_user");
  };

  const getAccessTokenWithPopup = async () => {
    return "demo_access_token";
  };

  const getAccessTokenSilently = async () => {
    return "demo_access_token";
  };

  return (
    <AuthMockContext.Provider
      value={{
        isAuthenticated,
        user,
        loginWithRedirect,
        loginWithPopup,
        logout,
        getAccessTokenWithPopup,
        getAccessTokenSilently
      }}
    >
      {children}
    </AuthMockContext.Provider>
  );
};

export const useAuth0 = () => {
  const context = useContext(AuthMockContext);
  if (!context) {
    return {
      isAuthenticated: false,
      user: null,
      loginWithRedirect: () => {},
      loginWithPopup: () => {},
      logout: () => {},
      getAccessTokenWithPopup: async () => "demo_access_token",
      getAccessTokenSilently: async () => "demo_access_token"
    };
  }
  return context;
};
