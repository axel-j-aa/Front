import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "antd";
import {
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons"; 
import "./Tasks.css";

const Tasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:3000/api/tasks?userId=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const text = await response.text();

        if (!response.ok) {
          console.log("Response:", text);
          throw new Error(
            `Error al obtener las tareas (HTTP ${response.status}): ${text}`
          );
        }

        const data = JSON.parse(text);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3000/api/task/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      const text = await response.text();

      if (!response.ok) {
        console.log("Response:", text);
        throw new Error(
          `Error al completar la tarea (HTTP ${response.status}): ${text}`
        );
      }

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: "Hecho" } : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePending = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3000/api/task/pending`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      const text = await response.text();

      if (!response.ok) {
        console.log("Response:", text);
        throw new Error(
          `Error al cambiar el estado a En proceso (HTTP ${response.status}): ${text}`
        );
      }

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: "En proceso" } : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3000/api/task/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      const text = await response.text();

      if (!response.ok) {
        console.log("Response:", text);
        throw new Error(
          `Error al eliminar la tarea (HTTP ${response.status}): ${text}`
        );
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tasks-container">
      <h2>Tus Tareas</h2>
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
                    className="action-button"
                    icon={<CheckOutlined />}
                    onClick={() => handleComplete(task.id)}
                    disabled={task.status === "Completada"} 
                  >
                  </Button>

                  <Button
                    type="default"
                    className="action-button"
                    icon={<ClockCircleOutlined />}
                    onClick={() => handlePending(task.id)}
                  ></Button>
                  <Button
                    type="danger"
                    className="action-button"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(task.id)}
                  ></Button>
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
