import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, message, Col, Row, Input, List } from 'antd';
import axios from 'axios';
import BotonGrupo from './BotonGrupo';

const GruposPage = () => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [grupoEdit, setGrupoEdit] = useState({ id: '', name: '', description: '', members: [] });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Obtener los grupos del usuario
  useEffect(() => {
    const fetchGrupos = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.email) {
          console.error('No se pudo obtener el email del usuario');
          message.error('No se pudo obtener la información del usuario');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/groups?userId=${userData.email}`);
        if (Array.isArray(response.data)) {
          setGrupos(response.data);
        } else {
          console.error('Respuesta inesperada', response.data);
          message.error('Error al obtener los grupos');
        }
      } catch (error) {
        message.error('Error al obtener los grupos');
        console.error('Error al obtener los grupos:', error);
      }
      setLoading(false);
    };

    fetchGrupos();
  }, []);

  const handleDelete = (groupId) => {
    Modal.confirm({
      title: 'Confirmar eliminación',
      content: '¿Estás seguro de que quieres eliminar este grupo?',
      onOk: async () => {
        try {
          const userData = JSON.parse(localStorage.getItem('user'));
          if (!userData || !userData.email) {
            message.error('No se pudo obtener la información del usuario');
            return;
          }
  
          const response = await axios.delete(`http://localhost:3000/api/groups/${groupId}?userId=${userData.email}`);
          
          if (response.status === 200) {
            setGrupos((prevGrupos) => prevGrupos.filter((grupo) => grupo.id !== groupId));
            message.success('Grupo eliminado exitosamente');
          } else {
            message.error('Error al eliminar el grupo');
          }
        } catch (error) {
          message.error('Error al eliminar el grupo');
          console.error('Error al eliminar el grupo:', error);
        }
      },
    });
  };
  
  

  // Abrir modal para editar grupo
  const handleEdit = (grupo) => {
    setGrupoEdit(grupo);
    setIsModalVisible(true);
  };

  // Guardar los cambios editados
  const handleOk = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/groups/${grupoEdit.id}`, grupoEdit);
      setGrupos((prevGrupos) =>
        prevGrupos.map((grupo) =>
          grupo.id === grupoEdit.id ? { ...grupo, name: grupoEdit.name, description: grupoEdit.description, members: grupoEdit.members } : grupo
        )
      );
      message.success('Grupo editado exitosamente');
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error al editar el grupo');
      console.error('Error al editar el grupo:', error);
    }
  };

  // Cerrar modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Agregar miembro
  const handleAddMember = () => {
    if (newMemberEmail && !grupoEdit.members.includes(newMemberEmail)) {
      setGrupoEdit({ ...grupoEdit, members: [...grupoEdit.members, newMemberEmail] });
      setNewMemberEmail('');
    } else {
      message.error('Este miembro ya está en el grupo o el correo está vacío.');
    }
  };

  const handleRemoveMember = (member) => {
    setGrupoEdit({
      ...grupoEdit,
      members: grupoEdit.members.filter((m) => m !== member),
    });
  };

  return (
    <Card title="Grupos" loading={loading}>
      <p>Aquí puedes gestionar los grupos.</p>
      <BotonGrupo />

      <div style={{ marginTop: 20 }}>
        {grupos.length === 0 ? (
          <p>No tienes grupos disponibles.</p>
        ) : (
          <Row gutter={[16, 16]}>
            {grupos.map((grupo) => (
              <Col span={8} key={grupo.id}>
                <Card
                  title={grupo.name}
                  style={{ width: '100%' }}
                  hoverable
                  actions={[
                    <Button type="link" onClick={() => handleEdit(grupo)}>
                      Editar
                    </Button>,
                    <Button type="link" danger onClick={() => handleDelete(grupo.id)}>
                      Eliminar
                    </Button>,
                  ]}
                >
                  <p><strong>Descripción:</strong> {grupo.description}</p>
                  {grupo.createdAt && (
                    <p><strong>Creado el:</strong> {new Date(grupo.createdAt).toLocaleString()}</p>
                  )}
                  <p><strong>Miembros:</strong> {grupo.members.length}</p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Modal
        title="Editar Grupo"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <div>
          <div style={{ marginBottom: 10 }}>
            <Input
              placeholder="Nombre del grupo"
              value={grupoEdit.name}
              onChange={(e) => setGrupoEdit({ ...grupoEdit, name: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <Input.TextArea
              placeholder="Descripción del grupo"
              value={grupoEdit.description}
              onChange={(e) => setGrupoEdit({ ...grupoEdit, description: e.target.value })}
            />
          </div>

          <div>
            <Input
              placeholder="Correo electrónico del miembro"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Button onClick={handleAddMember} type="primary" block>
              Agregar Miembro
            </Button>
            <List
              header={<div>Miembros actuales</div>}
              bordered
              dataSource={grupoEdit.members}
              renderItem={(item) => (
                <List.Item
                  actions={[<Button type="link" danger onClick={() => handleRemoveMember(item)}>Eliminar</Button>]}
                >
                  {item}
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default GruposPage;
