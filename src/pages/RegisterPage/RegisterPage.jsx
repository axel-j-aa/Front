import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/register', values);
      message.success(response.data.message);
      navigate('/login'); 
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message || 'Error registrando usuario.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: 'auto',
      marginTop: '10%',
      padding: 24,
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: 4,
    }}>
      <Title level={2} style={{ textAlign: 'center' }}>Registro</Title>
      <Form name="register" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: 'Ingrese un usuario' }]}
        >
          <Input placeholder="Usuario" />
        </Form.Item>
        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[
            { required: true, message: 'Ingrese un correo electrónico' },
            { type: 'email', message: 'Ingrese un correo válido' }
          ]}
        >
          <Input placeholder="Correo Electrónico" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Ingrese una contraseña' }]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Registrarse
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" block onClick={() => navigate('/login')}>
        ¿Ya tienes cuenta? Inicia sesión aquí
      </Button>
    </div>
  );
};

export default RegisterPage;
