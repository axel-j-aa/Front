import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, message } from "antd";
import moment from "moment";
import "./BotonFlotante.css";
import axiosInstance from '../../axiosConfig'; 

const BotonFlotante = ({ fetchTasks }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setVisible(true);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const deadline = moment().add(3, "days").toISOString();
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.docId) {
        message.error("Error: No se pudo obtener el ID del usuario.");
        return;
      }

      const newTask = { ...values, deadline, userId: user.docId };

      // Usamos axiosInstance para hacer la solicitud
      const response = await axiosInstance.post('task', newTask);

      if (response.status === 200) {
        message.success("Tarea creada exitosamente.");
        form.resetFields();
        setVisible(false);
        fetchTasks();
      } else {
        throw new Error(response.data.message || "Error al crear la tarea.");
      }
    } catch (error) {
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
              <Select.Option value="Hecho">Hecho</Select.Option>
              <Select.Option value="En proceso">En proceso</Select.Option>
              <Select.Option value="Por hacer">Por hacer</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BotonFlotante;
