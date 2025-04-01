import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Select, Row, Col, Space } from 'antd';
import { TeamOutlined, ArrowRightOutlined, ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../axiosConfig';
import TaskGroup from './Task-Group';
import './MisGruposPage.css';

const { Content } = Layout;
const { Option } = Select;

const MisGruposPage = () => {
  const [grupos, setGrupos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [usuarioEmail, setUsuarioEmail] = useState('');
  const [usuarioRol, setUsuarioRol] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.email) {
      setUsuarioEmail(userData.email);
      setUsuarioRol(userData.rol);
    }
  }, []);

  const fetchTareas = async () => {
    try {
      const response = await axiosInstance.get('tareas');
      const tareasConFechas = response.data.map(tarea => ({
        ...tarea,
        createdAt: new Date(tarea.createdAt).toLocaleString()
      }));
      setTareas(tareasConFechas);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await axiosInstance.get(`misgrupos?userId=${usuarioEmail}`);
        const gruposFiltrados = response.data.filter(grupo => grupo.members.includes(usuarioEmail));
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

  // Si filtro está vacío (Todos los grupos), no mostramos ninguna tarea
  const tareasFiltradas = filtro === '' ? [] : tareas.filter(tarea => tarea.groupName === filtro);

  const estados = ['Por hacer', 'En proceso', 'Hecho'];

  const puedeMoverEstado = () => {
    return usuarioRol === 'Admin';
  };

  const moverEstado = async (tareaId, nuevoEstado) => {
    if (!puedeMoverEstado()) return;

    try {
      await axiosInstance.put(`tareas/${tareaId}`, { status: nuevoEstado });
      setTareas(tareas.map(tarea =>
        tarea.id === tareaId ? { ...tarea, status: nuevoEstado } : tarea
      ));
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  return (
    <div className="MisGruposPage">
      <Layout style={{ minHeight: '100vh', margin: 0, padding: 0, backgroundColor: 'transparent' }}>
        <Content style={{ padding: '20px' }}>
          <div className='titulo'>
            <h2><TeamOutlined /> Mis Grupos</h2>
          </div>
          <Space style={{ marginBottom: '20px' }}>
            <Select
              defaultValue=""
              style={{ width: 200 }}
              onChange={filtrarTareas}
              placeholder="Selecciona un grupo"
            >
              <Option value="">Selecciona un grupo</Option>
              {grupos.map(grupo => (
                <Option key={grupo.name} value={grupo.name}>
                  {grupo.name}
                </Option>
              ))}
            </Select>
          </Space>

          <Row gutter={16} className='kanban-board'>
            {estados.map(estado => (
              <Col span={8} key={estado}>
                <h3 className='estados'>{estado}</h3>
                <div
                  style={{
                    backgroundColor: 'transparent',
                    padding: '10px',
                    minHeight: '300px',
                    borderRadius: '4px',
                  }}
                >
                  {tareasFiltradas.filter(tarea => tarea.status === estado).map((tarea, index) => (
                    <Card
                      key={tarea.id}
                      title={tarea.nameTask}
                      bordered={false}
                      style={{ marginBottom: '16px', backgroundColor: '#f5f5dc', border: '2px solid rgb(255, 255, 255)' }}
                    >
                      <p>{`Estado: ${tarea.status}`}</p>
                      <p>{`Descripción: ${tarea.description}`}</p>
                      <p>{`Creada el: ${new Date(tarea.createdAt).toLocaleDateString()}`}</p>
                      <Space>
                        {puedeMoverEstado() && (
                          <>
                            <Button
                              ghost
                              icon={<ArrowLeftOutlined style={{ color: 'black' }} />}
                              onClick={() => moverEstado(tarea.id, 'Por hacer')}
                              disabled={tarea.status === 'Por hacer'}
                            />
                            <Button
                              ghost
                              icon={<ArrowRightOutlined style={{ color: 'black' }} />}
                              onClick={() => moverEstado(tarea.id, 'En proceso')}
                              disabled={tarea.status === 'En proceso'}
                            />
                            <Button
                              ghost
                              icon={<CheckCircleOutlined style={{ color: 'green' }} />}
                              onClick={() => moverEstado(tarea.id, 'Hecho')}
                              disabled={tarea.status === 'Hecho'}
                            />
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
    </div>
  );
};

export default MisGruposPage;