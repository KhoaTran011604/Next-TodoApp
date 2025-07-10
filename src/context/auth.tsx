import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiLogin, AuthVertify, SignUp } from 'api/authService';
import { getDataFromToken } from 'hooks/useLocalStore';

type AuthPayload = {
  email: string;
  password: string;
};
type SignUpPayload = {
  fullName: string;
  email: string;
  password: string;
};
type LoginResponse = {
  success: boolean;
  data: any;
};
type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  login: (data: AuthPayload) => LoginResponse;
  register: (data: SignUpPayload) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: {},
  login: (data) => ({ success: false, data: {} }),
  register: (data) => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const login = async (data: AuthPayload) => {
    const res = await apiLogin(data);

    if (res.success) {
      const dataToken = getDataFromToken(res.data.accessToken);
      if (dataToken) {
        setUser(dataToken);
      }
      localStorage.setItem('@accessToken', res.data.accessToken);
      console.log('getDataFromToken', dataToken);

      setIsAuthenticated(true);
      router.push('/table-tasks');
      return { success: true, data: dataToken };
    } else {
      return { success: false, data: {} };
    }
  };
  const register = async (data: SignUpPayload) => {
    const res = await SignUp(data);
    return res.success ? true : false;
  };
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('#todoList');
    localStorage.removeItem('#todoList_Completed');
    localStorage.removeItem('@accessToken');
    router.push('/login-2');
  };

  const vertifyToken = async () => {
    const response = await AuthVertify({});
    console.log('response', response);

    if (response.success) {
      setIsAuthenticated(true);
      setUser(response.data);
      router.push('/table-tasks');
    }
  };

  useEffect(() => {
    vertifyToken();
  }, []);
  console.log(user);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
export const useAuth = () => useContext(AuthContext);
