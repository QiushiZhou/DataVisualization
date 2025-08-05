'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { password: string }) => {
    setLoading(true);
    
    // Simple password validation
    if (values.password === '3603') {
      // Store login status to localStorage
      localStorage.setItem('isAuthenticated', 'true');
      message.success('Login successful!');
      onLogin();
    } else {
      message.error('Wrong password!');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        title={
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#7546C9' }}>
            Data Visualization App
          </div>
        }
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ 
                width: '100%', 
                backgroundColor: '#7546C9', 
                borderColor: '#7546C9',
                height: '40px'
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 