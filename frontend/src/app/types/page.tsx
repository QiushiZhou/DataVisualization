'use client';

import React from 'react';
import { Card } from 'antd';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';

// Dynamically import TypeManager component
const TypeManager = dynamic(() => import('@/components/TypeManager'), { ssr: false });

export default function TypesPage() {
  const { isAuthenticated, login } = useAuth();

  const handleTypeChange = () => {
    // Refresh data if needed
  };

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <AppLayout title="Manage Data Types">
      <Card title="Data Types Management" bordered={false} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <TypeManager onTypeChange={handleTypeChange} />
      </Card>
    </AppLayout>
  );
} 