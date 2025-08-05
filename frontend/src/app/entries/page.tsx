'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import dynamic from 'next/dynamic';
import { getDataTypes } from '@/services/api';
import AppLayout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';

// Dynamically import DataManager component
const DataManager = dynamic(() => import('@/components/DataManager'), { ssr: false });

export default function EntriesPage() {
  const { isAuthenticated, login } = useAuth();
  const [dataTypes, setDataTypes] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTypes = async () => {
        try {
          const types = await getDataTypes();
          setDataTypes(types);
        } catch (error) {
          console.error('Failed to fetch data types:', error);
          setDataTypes([]);
        }
      };
      fetchTypes();
    }
  }, [isAuthenticated]);

  const handleDataChange = () => {
    // Refresh data if needed
  };

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <AppLayout title="All Data Entries">
      <Card title="Data Entries Management" bordered={false} style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <DataManager onDataChange={handleDataChange} dataTypes={dataTypes} />
      </Card>
    </AppLayout>
  );
} 