import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "antd";
import { CheckOutlined, ClockCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "./Tasks.css";
import axiosInstance from '../../axiosConfig';  // Importa axios configurado

const Tasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axiosInstance.get(`/tasks?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleStatusUpdate = async (taskId, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const endpoint = status === "Hecho" ? "/complete" : "/pending";
      await axiosInstance.post(`/task${endpoint}`, 
        { taskId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.delete(`/task/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { taskId },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
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
          {tasks.map((task) => (
            <Col span={8} key={task.id}>
              <Card title={task.nameTask} className="task-card">
                <p>
                  <strong>Descripción:</strong> {task.description}
                </p>
                <p>
                  <strong>Categoría:</strong> {task.category}
                </p>
                <p>
                  <strong>Fecha de entrega:</strong>{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p>
                  <strong>Estado:</strong> {task.status}
                </p>

                <div className="task-actions">
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleStatusUpdate(task.id, "Hecho")}
                    disabled={task.status === "Completada"}
                  />
                  <Button
                    type="default"
                    icon={<ClockCircleOutlined />}
                    onClick={() => handleStatusUpdate(task.id, "En proceso")}
                  />
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(task.id)}
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
