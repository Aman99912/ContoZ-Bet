import React from 'react';
import Navigation from './Navigation';
import RootProvider from './RootProvider';

export default function App() {
  return (
    <RootProvider>
      <Navigation />
    </RootProvider>
  );
}
