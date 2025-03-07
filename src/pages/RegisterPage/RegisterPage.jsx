import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axiosInstance from "../../axiosConfig";  // Importando la instancia de axios
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Usamos axiosInstance para realizar la solicitud
      const response = await axiosInstance.post("register", values); // Usamos la instancia de axios

      message.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message || "Error registrando usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-background">
      <div className="form-container">
        <Title level={2} style={{ textAlign: "center", color: 'white' }}>
          Registro
        </Title>
        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Ingrese un usuario" }]}
          >
            <Input placeholder="Usuario" />
          </Form.Item>
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[
              { required: true, message: "Ingrese un correo electrónico" },
              { type: "email", message: "Ingrese un correo válido" },
            ]}
          >
            <Input placeholder="Correo Electrónico" />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Ingrese una contraseña" }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Registrarse
            </Button>
          </Form.Item>
        </Form>
        <Button
          style={{ color: "white" }}
          type="link"
          block
          onClick={() => navigate("/login")}
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </Button>
      </div>
    </div>
  );
};

export default RegisterPage;
