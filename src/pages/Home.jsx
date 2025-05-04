import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username || 'User');
      } catch (err) {
        console.error('Error fetching user data:', err);
        window.location.href = '/login';
      }
    };

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data.tasks || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchUserData();
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/add`,
        { title: taskTitle, description: taskDescription, date: taskDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks([...tasks, response.data.task]);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDate('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${editingTask._id}`,
        { title: taskTitle, description: taskDescription, date: taskDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? response.data.task : task
        )
      );
      setEditingTask(null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDate('');
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const startEditingTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDate(task.date);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">👋 Hello, {username}!</h1>
        <p className="text-gray-600 mb-6">Welcome to your personalized To-Do List Dashboard.</p>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-300 mb-6"
        >
          Sign Out
        </button>

        {/* Task Form */}
        <form onSubmit={editingTask ? handleEditTask : handleAddTask} className="mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-4">
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
        </form>

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tasks</h2>
          {tasks.length > 0 ? (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="p-4 bg-gray-100 rounded-lg shadow-md text-left flex justify-between items-center hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>
                    <p className="text-gray-500 italic">Date: {task.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditingTask(task)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No tasks yet. Add your first task!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;