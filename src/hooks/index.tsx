import React from 'react';

import { AuthProvider } from './auth';

export const HooksProvider: React.FC = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export * from './auth';
