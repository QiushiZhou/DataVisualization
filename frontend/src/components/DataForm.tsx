'use client';

import React, { useEffect } from 'react';
import { Form, InputNumber, DatePicker, Select, Button, message } from 'antd';
import dayjs from 'dayjs';
import { createDataEntry } from '@/services/api';

const { Option } = Select;

interface DataFormProps {
  onDataAdded: () => void;
  dataTypes: { id: number; name: string }[];
}

const DataForm: React.FC<DataFormProps> = ({ onDataAdded, dataTypes }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ date: dayjs() });
  }, [form]);

  const onFinish = async (values: any) => {
    try {
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };
      await createDataEntry(formattedValues);
      message.success('Data added successfully!');
      form.resetFields(['type', 'value']); // Keep date as current
      form.setFieldsValue({ date: dayjs() }); // Reset date to today after submission
      onDataAdded();
    } catch (error) {
      message.error('Failed to add data.');
      console.error('Failed to add data:', error);
    }
  };

  return (
    <Form
      form={form}
      name="data_entry"
      onFinish={onFinish}
      layout="vertical"
      initialValues={{ date: dayjs() }}
    >
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
        <Select placeholder="Select a type">
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

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#7546C9', borderColor: '#7546C9' }}>
          Add Data
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DataForm;