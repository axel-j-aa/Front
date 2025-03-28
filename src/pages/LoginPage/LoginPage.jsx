import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig'; 
import './LoginPage.css';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Limpiar localStorage cuando se monte el componente
  useEffect(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const response = await axiosInstance.post('login', { email, password });

      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        message.success('Ingreso exitoso');
        navigate('/dashboard');
      } else {
        message.error(response.data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.error('Error en la conexión');
    }

    setLoading(false);
  };

  return (
    <div className="page-background">
      <div className="form-container">
        <Title level={2} style={{ textAlign: 'center', color: 'white' }}>Iniciar Sesión</Title>
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
        <Button style={{ color: 'white' }} type="link" block onClick={() => navigate('/register')}>
          ¿No tienes cuenta? Regístrate aquí
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
