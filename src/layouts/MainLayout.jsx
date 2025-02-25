import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUserRole(userData.rol);
      setUserEmail(userData.email);
    }
  }, []);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'usuarios',
      icon: <UserOutlined />,
      label: 'Usuarios',
      onClick: () => navigate('/dashboard/usuarios'),
    },
    userRole === 'Master' && {
      key: 'grupos',
      icon: <TeamOutlined />,
      label: 'Grupos',
      onClick: () => navigate('/dashboard/grupos'),
    },
    {
      key: 'mis-grupos',
      icon: <TeamOutlined />,
      label: 'Mis Grupos',
      onClick: () => navigate('/dashboard/mis-grupos'),
    },
    {
      key: 'buzon',
      icon: <MailOutlined />,
      label: 'Buzón',
      onClick: () => navigate('/dashboard/buzon'),
    },
    {
      key: 'configuracion',
      icon: <SettingOutlined />,
      label: 'Configuración',
      onClick: () => navigate('/dashboard/configuracion'),
    },
  ].filter(Boolean);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
      <Sider collapsible collapsed={collapsed} onCollapse={handleToggle} theme="dark" style={{ padding: 0, margin: 0 }}>
        <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', color: '#fff' }}>
          Task Manager
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
        <div style={{ marginTop: 'auto', padding: '16px' }}>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            style={{ marginTop: 'auto' }}
          >
            {collapsed ? null : 'Cerrar sesión'}
          </Button>
        </div>
      </Sider>
      <Layout style={{ margin: 0, padding: 0 }}>
        <Content style={{ margin: 0, padding: 0 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
