import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import './DashboardPage.css';
import BotonFlotante from '../../Components/BotonFlotante/BotonFlotante';
import Tasks from '../../Components/Tasks/Tasks';
import { message } from 'antd';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [tasks, setTasks] = useState([]);

  // Obtener tareas del usuario autenticado
  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!userId || !token) return;

    try {
      const { data } = await axiosInstance.get(`tasks?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
      message.error("Error al cargar las tareas");
    }
  }, [userId]); // Dependencia en userId

  // Crear una nueva tarea
  const createTask = async (taskData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        message.error("Sesión expirada. Inicia sesión nuevamente.");
        navigate("/login");
        return;
      }

      await axiosInstance.post("/task", taskData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      message.success("Tarea creada exitosamente");
      fetchTasks(); // Recargar las tareas después de crear una
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      message.error(error.response?.data?.message || "Error al crear la tarea");
    }
  };

  useEffect(() => {
    // Verificar autenticación y obtener usuario
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        setUsername(decodedToken.username || 'Usuario');
        setUserId(decodedToken.uid);
        fetchTasks(); // Cargar tareas al obtener el userId
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  }, [navigate, fetchTasks]); // Añadido fetchTasks como dependencia

  return (
    <div className="dashboard-container">
      <div className='user-card'>
        <h1 className="dashboard-username">Bienvenido, {username}</h1>
      </div>

      <Tasks userId={userId} tasks={tasks} fetchTasks={fetchTasks} createTask={createTask} />
      <BotonFlotante createTask={createTask} fetchTasks={fetchTasks} />
    </div>
  );
};

export default DashboardPage;
