import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import BotonFlotante from '../../Components/BotonFlotante/BotonFlotante';
import Tasks from '../../Components/Tasks/Tasks';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const token = localStorage.getItem('authToken');
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/tasks?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  };

  useEffect(() => {
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
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className='user-card'>
      <h1 className="dashboard-username">Bienvenido, {username}</h1>
      
      </div>

      <Tasks userId={userId} tasks={tasks} fetchTasks={fetchTasks} />
      <BotonFlotante fetchTasks={fetchTasks} /> 
    </div>
  );
};

export default DashboardPage;



