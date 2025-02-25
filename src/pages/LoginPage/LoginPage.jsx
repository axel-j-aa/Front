import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));  

        message.success('Ingreso exitoso');
        navigate('/dashboard');
      } else {
        message.error(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.error('Error en la conexión');
    }

    setLoading(false);
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
      <Title level={2} style={{ textAlign: 'center' }}>Iniciar Sesión</Title>
      <Form name="login" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[{ required: true, message: 'Ingrese su correo electrónico' }]}
        >
          <Input placeholder="Correo Electrónico" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Ingrese su contraseña' }]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Ingresar
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" block onClick={() => navigate('/register')}>
        ¿No tienes cuenta? Regístrate aquí
      </Button>
    </div>
  );
};

export default LoginPage;
