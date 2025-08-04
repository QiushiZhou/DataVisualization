'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, DatePicker, Select, InputNumber } from 'antd';
import { getDataEntries, updateDataEntry, deleteDataEntry } from '@/services/api';
import dayjs from 'dayjs';

const { Option } = Select;

interface DataEntry {
  id: number;
  date: string;
  type: string;
  value: number;
}

interface DataType {
  id: number;
  name: string;
}

interface DataManagerProps {
  onDataChange: () => void;
  dataTypes: DataType[];
}

const DataManager: React.FC<DataManagerProps> = ({ onDataChange, dataTypes }) => {
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [form] = Form.useForm();

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await getDataEntries();
      setEntries(data);
    } catch (error) {
      message.error('Failed to fetch data entries');
      console.error('Failed to fetch data entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEdit = (record: DataEntry) => {
    setEditingEntry(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDataEntry(id);
      message.success('Entry deleted successfully');
      fetchEntries();
      onDataChange();
    } catch (error) {
      message.error('Failed to delete entry');
      console.error('Failed to delete entry:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingEntry) {
        const formattedValues = {
          ...values,
          date: values.date.format('YYYY-MM-DD'),
        };
        await updateDataEntry(editingEntry.id, formattedValues);
        message.success('Entry updated successfully');
        setModalVisible(false);
        fetchEntries();
        onDataChange();
      }
    } catch (error) {
      message.error('Failed to save entry');
      console.error('Failed to save entry:', error);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: DataEntry, b: DataEntry) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: dataTypes.map(type => ({ text: type.name, value: type.name })),
      onFilter: (value: any, record: DataEntry) => record.type === value,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      sorter: (a: DataEntry, b: DataEntry) => a.value - b.value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DataEntry) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this entry?"
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
      <Table
        columns={columns}
        dataSource={entries}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title="Edit Data Entry"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select a type!' }]}
          >
            <Select>
              {dataTypes.map(type => (
                <Option key={type.id} value={type.name}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true, message: 'Please input the value!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataManager;