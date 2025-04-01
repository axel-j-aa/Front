import React, { useState, useEffect } from "react";
import { Card, Button, Modal, message, Col, Row, Input, List } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BotonGrupo from "./BotonGrupo";
import axiosInstance from '../../axiosConfig';
import "./GruposPage.css";

const GruposPage = () => {
  const [grupos, setGrupos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [grupoEdit, setGrupoEdit] = useState({
    id: "",
    name: "",
    description: "",
    members: [],
  });
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const fetchGrupos = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.email) {
        message.error("No se pudo obtener la información del usuario");
        return;
      }

      const response = await axiosInstance.get(`/groups?userId=${userData.email}`);
      if (Array.isArray(response.data)) {
        setGrupos(response.data);
      } else {
        message.error("Error al obtener los grupos");
      }
    } catch (error) {
      message.error("Error al obtener los grupos");
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleDelete = (groupId) => {
    Modal.confirm({
      title: "Confirmar eliminación",
      content: "¿Estás seguro de que quieres eliminar este grupo?",
      onOk: async () => {
        try {
          const userData = JSON.parse(localStorage.getItem("user"));
          if (!userData || !userData.email) {
            message.error("No se pudo obtener la información del usuario");
            return;
          }

          const response = await axiosInstance.delete(`/groups/${groupId}?userId=${userData.email}`);
          if (response.status === 200) {
            setGrupos((prevGrupos) => prevGrupos.filter((grupo) => grupo.id !== groupId));
            message.success("Grupo eliminado exitosamente");
          } else {
            message.error("Error al eliminar el grupo");
          }
        } catch (error) {
          message.error("Error al eliminar el grupo");
        }
      },
    });
  };

  const handleEdit = (grupo) => {
    setGrupoEdit(grupo);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const response = await axiosInstance.put(`/groups/${grupoEdit.id}`, grupoEdit);
      if (response.status === 200) {
        setGrupos((prevGrupos) =>
          prevGrupos.map((grupo) =>
            grupo.id === grupoEdit.id
              ? { ...grupo, name: grupoEdit.name, description: grupoEdit.description, members: grupoEdit.members }
              : grupo
          )
        );
        message.success("Grupo editado exitosamente");
        fetchGrupos();
        setIsModalVisible(false);
      }
    } catch (error) {
      message.error("Error al editar el grupo");
    }
  };

  const handleAddMember = () => {
    if (newMemberEmail && !grupoEdit.members.includes(newMemberEmail)) {
      setGrupoEdit({ ...grupoEdit, members: [...grupoEdit.members, newMemberEmail] });
      setNewMemberEmail("");
    } else {
      message.error("Este miembro ya está en el grupo o el correo está vacío.");
    }
  };

  const handleRemoveMember = (member) => {
    Modal.confirm({
      title: "Confirmar eliminación de miembro",
      content: `¿Estás seguro de que quieres eliminar a ${member} del grupo?`,
      onOk: () => {
        setGrupoEdit({
          ...grupoEdit,
          members: grupoEdit.members.filter((m) => m !== member),
        });
      },
    });
  };

  return (
    <div className="grupos-container">
      <div className="Titulo">
        <h2>Grupos</h2>
        <p>Aquí puedes gestionar los grupos.</p>
      </div>
      <BotonGrupo fetchGrupos={fetchGrupos} /> {/* Cambio aquí */}

      <div style={{ marginTop: 20 }}>
        {grupos.length === 0 ? (
          <p>No tienes grupos disponibles.</p>
        ) : (
          <Row gutter={[16, 16]}>
            {grupos.map((grupo) => (
              <Col span={8} key={grupo.id}>
                <Card
                  title={<span className="card-title">{grupo.name}</span>}
                  className="grupo-card"
                  hoverable
                  actions={[
                    <EditOutlined key="edit" onClick={() => handleEdit(grupo)} className="icono-editar" />,
                    <DeleteOutlined key="delete" onClick={() => handleDelete(grupo.id)} className="icono-eliminar" />,
                  ]}
                >
                  <p className="card-description">
                    <strong>Descripción:</strong> {grupo.description}
                  </p>
                  {grupo.createdAt && (
                    <p>
                      <strong>Creado el:</strong> {new Date(grupo.createdAt).toLocaleString()}
                    </p>
                  )}
                  <p>
                    <strong>Miembros:</strong> {grupo.members.length}
                  </p>
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
        onCancel={() => setIsModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <div>
          <Input
            placeholder="Nombre del grupo"
            value={grupoEdit.name}
            onChange={(e) => setGrupoEdit({ ...grupoEdit, name: e.target.value })}
            style={{ marginBottom: 10 }}
          />
          <Input.TextArea
            placeholder="Descripción del grupo"
            value={grupoEdit.description}
            onChange={(e) => setGrupoEdit({ ...grupoEdit, description: e.target.value })}
            style={{ marginBottom: 10 }}
          />
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
                actions={[
                  <Button type="link" danger onClick={() => handleRemoveMember(item)}>
                    Eliminar
                  </Button>,
                ]}
              >
                {item}
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

export default GruposPage;