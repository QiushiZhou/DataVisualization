'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Layout, Spin, Card, Space } from 'antd';
import dynamic from 'next/dynamic';
import { getDataEntries, getDataTypes } from '../services/api';

const { Header, Content, Sider } = Layout;

// Dynamically import client components
const DataForm = dynamic(() => import('../components/DataForm'), { ssr: false, loading: () => <Spin /> });
const DataChart = dynamic(() => import('../components/DataChart'), { ssr: false, loading: () => <Spin /> });
const TypeManager = dynamic(() => import('../components/TypeManager'), { ssr: false, loading: () => <Spin /> });
const DataManager = dynamic(() => import('../components/DataManager'), { ssr: false, loading: () => <Spin /> });

export default function Home() {
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
    fetchData();
  }, [fetchData]);

  const refreshData = () => {
    fetchData();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#7546C9', padding: '0 20px', color: '#fff', display: 'flex', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Data Visualization App</div>
      </Header>
      <Layout>
        <Sider width={400} style={{ background: '#fff', padding: '20px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="Add New Data" bordered={false}>
              <DataForm onDataAdded={refreshData} dataTypes={dataTypes} />
            </Card>
            <Card title="Manage Data Types" bordered={false}>
              <TypeManager onTypeChange={refreshData} />
            </Card>
          </Space>
        </Sider>
        <Content style={{ padding: '20px', background: '#fff', margin: '0 20px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="Data Visualization" bordered={false}>
              <DataChart data={dataEntries} dataTypes={dataTypes} />
            </Card>
            <Card title="All Data Entries" bordered={false}>
              <DataManager onDataChange={refreshData} dataTypes={dataTypes} />
            </Card>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
}