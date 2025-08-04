'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Layout, Tabs, Spin, Alert, Card, Space } from 'antd';
import dynamic from 'next/dynamic';

const { Header, Content } = Layout;

// Dynamically import client components
const DataForm = dynamic(() => import('@/components/DataForm'), { ssr: false, loading: () => <Spin /> });
const DataChart = dynamic(() => import('@/components/DataChart'), { ssr: false, loading: () => <Spin /> });
const TypeManager = dynamic(() => import('@/components/TypeManager'), { ssr: false, loading: () => <Spin /> });
const DataManager = dynamic(() => import('@/components/DataManager'), { ssr: false, loading: () => <Spin /> });

export default function Home() {
  const [dataEntries, setDataEntries] = useState<any[]>([]);
  const [dataTypes, setDataTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [entriesRes, typesRes] = await Promise.all([
        fetch('/api/data-entries').then(res => res.json()),
        fetch('/api/data-types').then(res => res.json()),
      ]);
      setDataEntries(entriesRes);
      setDataTypes(typesRes);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = () => {
    fetchData();
  };

  const items = [
    {
      key: '1',
      label: 'Data Management',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="Add New Data" bordered={false} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <DataForm onDataAdded={refreshData} dataTypes={dataTypes} />
          </Card>
          <Card title="Data Chart" bordered={false} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <DataChart data={dataEntries} dataTypes={dataTypes} />
          </Card>
        </Space>
      ),
    },
    {
      key: '2',
      label: 'Type Management',
      children: (
        <Card title="Manage Data Types" bordered={false} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <TypeManager onTypeChange={refreshData} />
        </Card>
      ),
    },
    {
      key: '3',
      label: 'All Data Entries',
      children: (
        <Card title="Manage All Data Entries" bordered={false} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <DataManager onDataChange={refreshData} dataTypes={dataTypes} />
        </Card>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ background: '#7546C9', padding: '0 20px', color: '#fff', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Data Visualization App</div>
      </Header>
      <Content style={{ padding: '20px 50px' }}>
        {loading && <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />}
        {error && <Alert message="Error" description={error} type="error" showIcon />}
        {!loading && !error && (
          <Suspense fallback={<Spin size="large" style={{ display: 'block', margin: '50px auto' }} />}>
            <Tabs defaultActiveKey="1" items={items} size="large" centered style={{ marginTop: '20px' }} />
          </Suspense>
        )}
      </Content>
    </Layout>
  );
}