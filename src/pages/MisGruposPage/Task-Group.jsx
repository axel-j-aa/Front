import React, { useState } from "react"; 
import { Modal, Button, Form, Input, Select, message } from "antd";
import axiosInstance from "../../axiosConfig";  // Importando la instancia de axios
import "./Task-Group.css";

const TaskGroup = ({ fetchTareas, grupoNombre }) => { 
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      // Validar los campos del formulario
      const values = await form.validateFields();
      
      // Definir la fecha límite de la tarea sin usar moment
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 3); // Sumar 3 días a la fecha actual
      const deadlineISO = deadline.toISOString(); // Convertir la fecha a formato ISO

      // Obtener el usuario del localStorage
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (!user || !user.docId) {
        message.error("Error: No se pudo obtener el ID del usuario.");
        return;
      }
  
      // Crear el objeto de la nueva tarea
      const newTask = { 
        ...values, 
        deadline: deadlineISO, 
        userId: user.docId, 
        groupName: grupoNombre 
      };
  
      // Enviar la solicitud al servidor usando axiosInstance
      const response = await axiosInstance.post("task", newTask); // Usamos la instancia de axios

      // Imprimir la respuesta para depuración
      console.log("Respuesta del servidor:", response.data);

      // Comprobamos la respuesta de la API
      if (response.status === 201) {  // Verifica que el código de estado sea 201 (creado)
        message.success(response.data.message); // Mostrar el mensaje de éxito que devuelve el backend
        form.resetFields();
        setVisible(false); // Cerrar el modal
        fetchTareas(); // Actualizar la lista de tareas
      } else {
        // Si el servidor devuelve otro código de estado
        message.error(`🚨 Error: ${response.data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error("Error al crear tarea:", error);

      // Manejo de errores específicos
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || "Error desconocido.";
        
        // Verificar si el error tiene que ver con una tarea duplicada
        if (errorMessage.includes("Ya existe una tarea con este nombre")) {
          message.error("🚨 Ya existe una tarea con este nombre.");
        } else {
          message.error(`🚨 ${errorMessage}`);
        }
      } else {
        message.error(`🚨 Error: ${error.message || 'Error desconocido'}`);
      }
    }
  };
  
  return (
    <>
      {/* Botón para abrir el modal */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        onClick={showModal}
        className="boton-flotante"
      >
        +
      </Button>
      
      {/* Modal para crear nueva tarea */}
      <Modal
        title="Crear Nueva Tarea"
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          {/* Campo de nombre de la tarea */}
          <Form.Item
            label="Nombre de la Tarea"
            name="nameTask"
            rules={[{ required: true, message: "Por favor ingresa el nombre de la tarea" }]} >
            <Input placeholder="Ingresa el nombre de la tarea" />
          </Form.Item>
          
          {/* Campo de categoría */}
          <Form.Item
            label="Categoría"
            name="category"
            rules={[{ required: true, message: "Por favor selecciona la categoría" }]} >
            <Select placeholder="Selecciona la categoría">
              <Select.Option value="Urgente">Urgente</Select.Option>
              <Select.Option value="Importante">Importante</Select.Option>
              <Select.Option value="Pequeña">Pequeña</Select.Option>
            </Select>
          </Form.Item>
          
          {/* Campo de descripción */}
          <Form.Item
            label="Descripción"
            name="description"
            rules={[{ required: true, message: "Por favor ingresa la descripción" }]} >
            <Input placeholder="Ingresa la descripción" />
          </Form.Item>
          
          {/* Campo de estado */}
          <Form.Item
            label="Estado"
            name="status"
            rules={[{ required: true, message: "Por favor selecciona el estado" }]} >
            <Select placeholder="Selecciona el estado">
              <Select.Option value="Hecho">
                <span style={{ color: "green" }}>Hecho</span>
              </Select.Option>
              <Select.Option value="En proceso">
                <span style={{ color: "orange" }}>En proceso</span>
              </Select.Option>
              <Select.Option value="Por hacer">
                <span style={{ color: "red" }}>Por hacer</span>
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TaskGroup;
