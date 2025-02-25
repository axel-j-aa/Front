import React from 'react';
import { Button, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <Title level={1}  className="landing-title">Bienvenido!!!</Title>

      <div className="cards-container">
        <Card title="Organización" bordered={false} className="custom-card">
          <Paragraph>Administra tus tareas en un solo lugar.</Paragraph>
        </Card>
        <Card title="Seguimiento" bordered={false} className="custom-card">
          <Paragraph>Revisa el progreso de tus actividades.</Paragraph>
        </Card>
        <Card title="Eficiencia" bordered={false} className="custom-card">
          <Paragraph>Optimiza tu flujo de trabajo.</Paragraph>
        </Card>
      </div>

      <div className="buttons-container">
        <Button type="default" size="large" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
