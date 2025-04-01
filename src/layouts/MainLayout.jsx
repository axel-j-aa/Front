import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authToken'); 

    if (userData && token) {
      setUserRole(userData.rol);
    } else {
      navigate('/login'); 
    }

    const logoutAfterTimeout = setTimeout(() => {
      handleLogout(); 
    }, 10 * 60 * 1000); 

    return () => {
      clearTimeout(logoutAfterTimeout);
    };
  }, [navigate, handleLogout]);

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
    (userRole === 'Master' || userRole === 'Admin') && {
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
    
  ].filter(Boolean);

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