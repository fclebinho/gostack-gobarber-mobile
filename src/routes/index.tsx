import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../hooks';
import { AuthRoutes } from './auth';
import { AppRoutes } from './app';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
