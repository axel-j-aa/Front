import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, Select } from 'antd';
import axiosInstance from '../../axiosConfig';  // Usamos la instancia de Axios configurada
import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axiosInstance.get('usuarios'); // Usamos la instancia de Axios
      if (response.data && Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        message.error('No se encontraron usuarios');
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      message.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (user) => {
    setUserToEdit(user); // Establecemos el usuario que se va a editar
    setIsModalVisible(true); // Mostramos el modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Cerramos el modal
    setUserToEdit(null); // Limpiamos el usuario seleccionado
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.put(`usuarios/${userToEdit.id}`, values); // Usamos la instancia de Axios
      if (response.status === 200) {
        message.success('Usuario actualizado');
        fetchUsuarios(); // Recargamos la lista de usuarios
        handleCancel(); // Cerramos el modal
      } else {
        message.error('Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      message.error('Error al actualizar usuario');
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>Editar</Button>
      ),
    },
  ];

  return (
    <div className="UsuariosPage">
      <h1 className="titulo">Gestión de Usuarios</h1>
      <Table dataSource={usuarios} columns={columns} loading={loading} rowKey="id" />

      {/* Modal para editar usuario */}
      <Modal
        title="Editar Usuario"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {userToEdit && (
          <Form
            initialValues={{
              email: userToEdit.email,
              username: userToEdit.username,
              rol: userToEdit.rol,
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Por favor ingresa el email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label="Usuario"
              rules={[{ required: true, message: 'Por favor ingresa el nombre de usuario' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="rol"
              label="Rol"
              rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
            >
              <Select>
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="Master">Master</Select.Option>
                <Select.Option value="Empleado">Empleado</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Guardar Cambios</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Usuarios;
