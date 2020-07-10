import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import localStorage from '@react-native-community/async-storage';
import { api } from '../../services';

export interface AuthDataProps {
  token: string;
  user: object;
}

export interface AuthCredentialsProps {
  email: string;
  password: string;
}

export interface AuthContextProps {
  user: object;
  loading: boolean;
  signIn(credentials: AuthCredentialsProps): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({ children }) => {
  // const history = useHistory();
  const [data, setData] = useState<AuthDataProps>({} as AuthDataProps);
  const [loading, setLoading] = useState(true);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;
    await localStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    // await localStorage.setItem('@GoBarber:token', token);
    // await localStorage.setItem('@GoBarber:user', JSON.stringify(user));
    setData({ token, user });
    // history.push('/');
  }, []);

  const signOut = useCallback(async () => {
    await localStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    // await localStorage.removeItem('@GoBarber:token');
    // await localStorage.removeItem('@GoBarber:user');
    setData({} as AuthDataProps);
  }, []);

  useEffect(() => {
    async function loadInitialData(): Promise<void> {
      const [token, user] = await localStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadInitialData();
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
};

export default AuthContext;
