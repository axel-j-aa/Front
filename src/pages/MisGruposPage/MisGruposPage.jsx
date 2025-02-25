import React, { useState, useEffect } from 'react'; 
import { Layout, Card, Button, Select, Row, Col, Space } from 'antd';
import { TeamOutlined, ArrowRightOutlined, ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import TaskGroup from './Task-Group';

const { Content } = Layout;
const { Option } = Select;

const MisGruposPage = () => {
  const [grupos, setGrupos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [usuarioEmail, setUsuarioEmail] = useState('');
  const [usuarioRol, setUsuarioRol] = useState(''); // Estado para almacenar el rol del usuario

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.email) {
      setUsuarioEmail(userData.email);
      setUsuarioRol(userData.rol); // Establecer el rol del usuario
    }
  }, []);

  const fetchTareas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tareas');
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/misgrupos?userId=${usuarioEmail}`);
        const data = await response.json();
        const gruposFiltrados = data.filter(grupo => grupo.members.includes(usuarioEmail));
        setGrupos(gruposFiltrados);
      } catch (error) {
        console.error('Error al obtener los grupos:', error);
      }
    };

    if (usuarioEmail) {
      fetchGrupos();
    }
  }, [usuarioEmail]);

  useEffect(() => {
    fetchTareas();
  }, []);

  const filtrarTareas = (groupName) => {
    setFiltro(groupName);
  };

  // Filtrar tareas por grupo seleccionado
  const tareasFiltradas = filtro ? tareas.filter(tarea => tarea.groupName === filtro) : tareas;

  // Estados de las tareas en Kanban
  const estados = ['Por hacer', 'En proceso', 'Hecho'];

  // Función para verificar si el usuario puede mover las tareas de estado (solo Admin)
  const puedeMoverEstado = () => {
    return usuarioRol === 'Admin'; // Solo el rol Admin puede mover las tareas
  };

  // Funciones para mover las tareas de estado
  const moverEstado = (tareaId, nuevoEstado) => {
    if (!puedeMoverEstado()) return; // Si no es Admin, no se puede mover el estado

    // Actualizar el estado de la tarea en la base de datos
    setTareas(tareas.map(tarea =>
      tarea.id === tareaId ? { ...tarea, status: nuevoEstado } : tarea
    ));
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
      <Content style={{ padding: '20px' }}>
        <h2><TeamOutlined /> Mis Grupos</h2>

        <Space style={{ marginBottom: '20px' }}>
          <Select
            defaultValue=""
            style={{ width: 200 }}
            onChange={filtrarTareas}
            placeholder="Selecciona un grupo"
          >
            <Option value="">Todos los grupos</Option>
            {grupos.map(grupo => (
              <Option key={grupo.name} value={grupo.name}>
                {grupo.name}
              </Option>
            ))}
          </Select>
        </Space>

        {/* Tablero Kanban */}
        <Row gutter={16}>
          {estados.map(estado => (
            <Col span={8} key={estado}>
              <h3>{estado}</h3>
              <div
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '10px',
                  minHeight: '300px',
                  borderRadius: '4px',
                }}
              >
                {tareasFiltradas.filter(tarea => tarea.status === estado).map(tarea => (
                  <Card key={tarea.id} title={tarea.nameTask} bordered={false}>
                    <p>{`Estado: ${tarea.status}`}</p>
                    <p>{`Descripción: ${tarea.description}`}</p>
                    <Space>
                      {puedeMoverEstado() && (
                        <>
                          <Button
                            type="primary"
                            icon={<ArrowRightOutlined />}
                            onClick={() => moverEstado(tarea.id, 'En proceso')}
                            disabled={tarea.status === 'En proceso'}
                          >
                          </Button>
                          <Button
                            type="primary"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => moverEstado(tarea.id, 'Por hacer')}
                            disabled={tarea.status === 'Por hacer'}
                          >
                          </Button>
                          <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => moverEstado(tarea.id, 'Hecho')}
                            disabled={tarea.status === 'Hecho'}
                          >
                          </Button>
                        </>
                      )}
                      {!puedeMoverEstado() && (
                        <Button
                          type="default"
                          icon={<CloseCircleOutlined />}
                          disabled
                        >
                          No tienes permisos
                        </Button>
                      )}
                    </Space>
                  </Card>
                ))}
              </div>
            </Col>
          ))}
        </Row>
      </Content>
      <TaskGroup fetchTareas={fetchTareas} grupoNombre={filtro} />
    </Layout>
  );
};

export default MisGruposPage;
