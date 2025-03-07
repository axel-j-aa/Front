import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Form, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../axiosConfig'; // Importa la instancia de axios configurada

const { Option } = Select;
const { TextArea } = Input;

const BotonGrupo = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);  
  const [userEmail, setUserEmail] = useState(''); 
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('usuarios');  // Usando la instancia de axios configurada
        console.log("Usuarios obtenidos del backend:", response.data);
        setUsuarios(response.data);  
      } catch (error) {
        message.error("Error al obtener la lista de usuarios");
        console.error("Error:", error);
      }
      setLoading(false);
    };

    const userData = JSON.parse(localStorage.getItem('user')); 
    if (userData && userData.email) {
      setUserEmail(userData.email); 
    }

    fetchUsuarios();
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    form.validateFields()
      .then(async (values) => {
        if (!userEmail) {
          message.error("No se encontró el correo del usuario.");
          return;
        }

        const groupData = {
          created_by: userEmail,  
          description: values.descripcion,
          members: values.miembros, 
          name: values.nombreGrupo,  
        };

        try {
          const response = await axiosInstance.post('groups', groupData);  // Usando la instancia de axios configurada
          console.log("Grupo creado:", response.data);
          message.success("Grupo creado exitosamente");
          setVisible(false);
          form.resetFields();
        } catch (error) {
          console.error("Error al crear el grupo:", error);
          message.error("Error al crear el grupo");
        }
      })
      .catch(error => {
        console.error("Error al validar el formulario:", error);
      });
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={showModal}
      />

      <Modal
        title="Crear Nuevo Grupo"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre del Grupo"
            name="nombreGrupo"
            rules={[{ required: true, message: 'Por favor, ingresa un nombre' }]}>
            <Input placeholder="Ingrese el nombre del grupo" />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: 'Por favor, ingresa una descripción' }]}>
            <TextArea rows={3} placeholder="Ingrese una descripción" />
          </Form.Item>

          <Form.Item
            label="Seleccionar Miembros"
            name="miembros"
            rules={[{ required: true, message: 'Seleccione al menos un usuario' }]}>
            <Select
              mode="multiple"
              placeholder="Seleccione los usuarios"
              loading={loading}>
              {usuarios && usuarios.length > 0 ? (
                usuarios.map(user => (
                  <Option key={user.email} value={user.email}>
                    {user.email}
                  </Option>
                ))
              ) : (
                <Option disabled>No hay usuarios disponibles</Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BotonGrupo;
