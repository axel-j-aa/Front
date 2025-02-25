import React, { useState } from "react"; 
import { Modal, Button, Form, Input, Select, message } from "antd";
import moment from "moment";
import "./Task-Group.css";

const TaskGroup = ({ fetchTareas, grupoNombre }) => { // Asegúrate de recibir la prop correctamente
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const deadline = moment().add(3, "days").toISOString();
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.docId) {
        message.error("Error: No se pudo obtener el ID del usuario.");
        return;
      }

      const newTask = { 
        ...values, 
        deadline, 
        userId: user.docId, 
        groupName: grupoNombre // Añadimos el nombre del grupo
      };

      const response = await fetch("http://localhost:3000/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la tarea.");
      }

      message.success("Tarea creada exitosamente.");
      console.log("Respuesta del servidor:", data);
      form.resetFields();
      setVisible(false);
      fetchTareas(); // Llamada a fetchTareas después de crear la tarea
    } catch (error) {
      console.error("Error al crear tarea:", error);
      message.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        size="large"
        onClick={showModal}
        className="boton-flotante"
      >
        +
      </Button>
      <Modal
        title="Crear Nueva Tarea"
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre de la Tarea"
            name="nameTask"
            rules={[{ required: true, message: "Por favor ingresa el nombre de la tarea" }]}
          >
            <Input placeholder="Ingresa el nombre de la tarea" />
          </Form.Item>
          <Form.Item
            label="Categoría"
            name="category"
            rules={[{ required: true, message: "Por favor selecciona la categoría" }]}
          >
            <Select placeholder="Selecciona la categoría">
              <Select.Option value="Urgente">Urgente</Select.Option>
              <Select.Option value="Importante">Importante</Select.Option>
              <Select.Option value="Pequeña">Pequeña</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Descripción"
            name="description"
            rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
          >
            <Input placeholder="Ingresa la descripción" />
          </Form.Item>
          <Form.Item
            label="Estado"
            name="status"
            rules={[{ required: true, message: "Por favor selecciona el estado" }]}
          >
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
