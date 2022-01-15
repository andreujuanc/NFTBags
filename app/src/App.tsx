import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Nav } from './layout/nav';
import { DashboardPage } from './pages/dashboard';
import { Layout } from './layout';

function App() {
  return (
    <Layout >
      <DashboardPage/>
    </Layout>
  );
}

export default App;

