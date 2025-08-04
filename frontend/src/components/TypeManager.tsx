'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { getDataTypes, createDataType, updateDataType, deleteDataType } from '@/services/api';

interface DataType {
  id: number;
  name: string;
}

interface TypeManagerProps {
  onTypeChange: () => void;
}

const TypeManager: React.FC<TypeManagerProps> = ({ onTypeChange }) => {
  const [types, setTypes] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingType, setEditingType] = useState<DataType | null>(null);
  const [form] = Form.useForm();

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const data = await getDataTypes();
      setTypes(data);
    } catch (error) {
      message.error('Failed to fetch data types');
      console.error('Failed to fetch data types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAdd = () => {
    setEditingType(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: DataType) => {
    setEditingType(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDataType(id);
      message.success('Type deleted successfully');
      fetchTypes();
      onTypeChange();
    } catch (error) {
      message.error('Failed to delete type');
      console.error('Failed to delete type:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingType) {
        await updateDataType(editingType.id, values);
        message.success('Type updated successfully');
      } else {
        await createDataType(values);
        message.success('Type added successfully');
      }
      setModalVisible(false);
      fetchTypes();
      onTypeChange();
    } catch (error) {
      message.error('Failed to save type');
      console.error('Failed to save type:', error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DataType) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this type?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={handleAdd}
        style={{ marginBottom: 16, backgroundColor: '#7546C9', borderColor: '#7546C9' }}
      >
        Add New Type
      </Button>
      <Table
        columns={columns}
        dataSource={types}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={editingType ? 'Edit Type' : 'Add New Type'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Type Name"
            rules={[{ required: true, message: 'Please input the type name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TypeManager;