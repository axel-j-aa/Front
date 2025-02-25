import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Form, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

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
        const response = await axios.get('http://localhost:3000/api/usuarios'); // Cambia la URL si tu backend está en otro puerto
        console.log("Usuarios obtenidos del backend:", response.data);
        setUsuarios(response.data);  // Guardamos los usuarios en el estado
      } catch (error) {
        message.error("Error al obtener la lista de usuarios");
        console.error("Error:", error);
      }
      setLoading(false);
    };

    const userData = JSON.parse(localStorage.getItem('user')); // Obtener el correo desde localStorage
    if (userData && userData.email) {
      setUserEmail(userData.email); // Guardamos el correo del usuario logueado
    }

    fetchUsuarios(); // Ejecuta la función al cargar el componente
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

        // Datos a enviar al backend
        const groupData = {
          created_by: userEmail,  // Asegúrate de que este campo esté correctamente seteado
          description: values.descripcion,
          members: values.miembros, // Array con los correos de los miembros
          name: values.nombreGrupo,  // Nombre del grupo
        };

        try {
          // Realizamos la solicitud POST para crear el grupo
          const response = await axios.post('http://localhost:3000/api/groups', groupData);
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
            rules={[{ required: true, message: 'Por favor, ingresa un nombre' }]}
          >
            <Input placeholder="Ingrese el nombre del grupo" />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: 'Por favor, ingresa una descripción' }]}
          >
            <TextArea rows={3} placeholder="Ingrese una descripción" />
          </Form.Item>

          <Form.Item
            label="Seleccionar Miembros"
            name="miembros"
            rules={[{ required: true, message: 'Seleccione al menos un usuario' }]}
          >
            <Select
              mode="multiple"
              placeholder="Seleccione los usuarios"
              loading={loading}
            >
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
