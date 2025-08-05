'use client';

import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { BarChartOutlined, SettingOutlined, DatabaseOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const { Header, Content, Sider } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title = 'Data Visualization App', showBackButton = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'dashboard') {
      router.push('/');
    } else if (key === 'types') {
      router.push('/types');
    } else if (key === 'entries') {
      router.push('/entries');
    } else if (key === 'logout') {
      logout();
      router.push('/');
    }
  };

  const getSelectedKey = () => {
    if (pathname === '/') return 'dashboard';
    if (pathname === '/types') return 'types';
    if (pathname === '/entries') return 'entries';
    return 'dashboard';
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <BarChartOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'types',
      icon: <SettingOutlined />,
      label: 'Manage Types',
    },
    {
      key: 'entries',
      icon: <DatabaseOutlined />,
      label: 'All Entries',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#7546C9', padding: '0 20px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{title}</div>
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={() => handleMenuClick({ key: 'logout' })}
          style={{ color: '#fff', border: 'none' }}
        >
          Logout
        </Button>
      </Header>
      <Layout>
        <Sider width={250} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '20px' }}>
          <Content style={{ background: '#fff', padding: '20px', margin: 0, minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 