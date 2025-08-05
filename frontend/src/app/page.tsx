'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Card, Space } from 'antd';
import dynamic from 'next/dynamic';
import { getDataEntries, getDataTypes } from '@/services/api';
import AppLayout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';

// Dynamically import client components
const DataForm = dynamic(() => import('@/components/DataForm'), { ssr: false, loading: () => <Spin /> });
const DataChart = dynamic(() => import('@/components/DataChart'), { ssr: false, loading: () => <Spin /> });

export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const [dataEntries, setDataEntries] = useState<any[]>([]);
  const [dataTypes, setDataTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [entriesRes, typesRes] = await Promise.all([
        getDataEntries().catch(() => []),
        getDataTypes().catch(() => [])
      ]);
      setDataEntries(entriesRes);
      setDataTypes(typesRes);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setDataEntries([]);
      setDataTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [fetchData, isAuthenticated]);

  const refreshData = () => {
    fetchData();
  };

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <AppLayout title="Dashboard">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Add New Data" bordered={false}>
          <DataForm onDataAdded={refreshData} dataTypes={dataTypes} />
        </Card>
        <Card title="Data Visualization" bordered={false}>
          <DataChart data={dataEntries} dataTypes={dataTypes} />
        </Card>
      </Space>
    </AppLayout>
  );
}