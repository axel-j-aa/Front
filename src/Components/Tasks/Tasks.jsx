import React, { useState, useEffect, useCallback } from "react";
import { Card, Col, Row, Button } from "antd";
import { CheckOutlined, ClockCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "./Tasks.css";
import axiosInstance from "../../axiosConfig";

const Tasks = ({ userId, fetchTasks }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Usamos useCallback para memorizar la función y evitar que se redefina en cada renderizado
  const fetchTasksData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get(`/tasks?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchTasksData(); // Llamamos a fetchTasks
  }, [userId, fetchTasksData]);

  const updateTaskStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const endpoint = status === "Hecho" ? "/complete" : "/pending";
      await axiosInstance.post(`/task${endpoint}`, { taskId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchTasks(); // Actualizamos las tareas después de cambiar el estado
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.delete(`/task/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { taskId },
      });
      fetchTasks(); // Recargamos las tareas después de eliminar
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tasks-container">
      <h2 style={{ color: "white" }}>Tus Tareas</h2>
      {tasks.length === 0 ? (
        <p>No tienes tareas asignadas.</p>
      ) : (
        <Row gutter={16}>
          {tasks.map(({ id, nameTask, description, category, deadline, status }) => (
            <Col span={8} key={id}>
              <Card title={nameTask} className="task-card">
                <p><strong>Descripción:</strong> {description}</p>
                <p><strong>Categoría:</strong> {category}</p>
                <p><strong>Fecha de entrega:</strong> {new Date(deadline).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {status}</p>
                <div className="task-actions">
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />} 
                    onClick={() => updateTaskStatus(id, "Hecho")} 
                    disabled={status === "Completada"} 
                  />
                  <Button 
                    type="default" 
                    icon={<ClockCircleOutlined />} 
                    onClick={() => updateTaskStatus(id, "En proceso")} 
                  />
                  <Button 
                    type="danger" 
                    icon={<DeleteOutlined />} 
                    onClick={() => deleteTask(id)} 
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Tasks;
