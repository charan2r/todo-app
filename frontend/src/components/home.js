/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [expirationTimes, setExpirationTimes] = useState({});

  useEffect(() => {
    fetchTasks();
    if (confirmationMessage) {
        setShowToast(true);
        const timer = setTimeout(() => {
          setShowToast(false);
        }, 3000); 
  
        return () => clearTimeout(timer); 
      }
  }, [confirmationMessage]);

  // API to fetch tasks
  const fetchTasks = () => {
    fetch('http://localhost:5000/tasks')
      .then(response => response.json())
      .then(data => {
        setTasks(data.tasks);
        if (data.upcomingTasks && data.upcomingTasks.length > 0) {
          notifyUpcomingTasks(data.upcomingTasks);
        }
      })
      .catch(error => console.error('Error fetching tasks:', error));
  };

  // API to add tasks
  const addTask = () => {
    fetch('http://localhost:5000/addTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate, priority }),
    })
      .then(response => response.json())
      .then(data => {
        const newTaskId = data.tasks[data.tasks.length - 1].id;
        const expirationDateTime = prompt(
          'Set an expiration date and time for this task (YYYY-MM-DDTHH:MM format):'
        );
        if (expirationDateTime) {
          saveExpiration(newTaskId, expirationDateTime);
        }
        setTasks(data.tasks);
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('');
        setTaskId('');
        setConfirmationMessage('Task added successfully');
      });
  };

  const renderTasks = () => {
    const now = new Date();
    return tasks.map((task) => {
      const expirationDateTimeStr = expirationTimes[task.id];
      const expirationDateTime = expirationDateTimeStr
        ? new Date(expirationDateTimeStr)
        : null;
      const isExpired = expirationDateTime && expirationDateTime < now;
      return (
        <div
          className={`bg-white p-4 rounded shadow mb-4 ${
            isExpired ? 'bg-gray-400' : ''
          }`}
          key={task.id}
        >
          <h2 className="text-xl font-bold mb-2">Title: {task.title}</h2>
          <p className="text-base text-gray-600 font-mono font-semibold">
            Description: {task.description}
          </p>
          <p className="text-base text-gray-600 font-mono font-semibold">
            Due Date: {task.due_date}
          </p>
          <p className="text-base text-gray-600 mb-5 font-mono font-semibold">
            Priority: {task.priority}
          </p>
          {expirationDateTime && (
            <p className="text-base text-red-500 mb-5 font-mono font-semibold">
              Expires On: {expirationDateTime.toLocaleString()}
            </p>
          )}
          {isExpired ? (
            <span className="bg-red-500 text-white px-2 py-1 rounded mr-2">
              Expired
            </span>
          ) : (
            ''
          )}
          <button
            className="bg-red-500 text-white px-2 py-1 rounded mr-2"
            onClick={() => editTask(task.id)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded mb-2"
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </button>
          {task.completed ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded ml-2">
              Completed
            </span>
          ) : (
            <button
              className="bg-green-500 text-white px-2 py-1 rounded ml-2"
              onClick={() => markCompleted(task.id)}
            >
              Mark as Completed
            </button>
          )}
        </div>
      );
    });
  };

  // API to delete tasks
  const deleteTask = (id) => {
    fetch('http://localhost:5000/deleteTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.tasks);
        setConfirmationMessage('Task deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        setConfirmationMessage('Failed to delete task.');
      });
  };

  // API to edit tasks
  const editTask = (id) => {
    fetch(`http://localhost:5000/task/${id}`)
      .then((response) => response.json())
      .then((task) => {
        setTaskId(task.id);
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date);
        setPriority(task.priority);
      })
      .catch((error) => console.error('Error fetching task:', error));
  };

  // API to update tasks
  const updateTask = () => {
    fetch('http://localhost:5000/updateTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, title, description, dueDate, priority }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.tasks);
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('');
        setTaskId('');
        setConfirmationMessage('Task updated successfully!');
      });
  };

  // API to mark tasks as completed
  const markCompleted = (id) => {
    fetch('http://localhost:5000/markCompleted', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.tasks);
        setConfirmationMessage('Task is completed!');
      })
      .catch((error) => console.error('Error marking task as completed:', error));
  };

  const saveExpiration = (taskId, expirationDateTime) => {
    const updatedExpirationTimes = { ...expirationTimes, [taskId]: expirationDateTime };
    setExpirationTimes(updatedExpirationTimes);
    localStorage.setItem('expirationTimes', JSON.stringify(updatedExpirationTimes));
  };

  const notifyUpcomingTasks = (upcomingTasks) => {
    upcomingTasks.forEach((task) => {
      setConfirmationMessage(`Reminder: Task "${task.title}" is due soon!`);
    });
  };

  // API to search tasks
  const searchTasks = (query) => {
    fetch(`http://localhost:5000/searchTasks?query=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.tasks);
      })
      .catch((error) => console.error('Error searching tasks:', error));
  };

  return (
    <div className="min-h-screen p-4" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-2xl mx-auto bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm mt-20">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Todo List</h1>
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-1.5 border rounded text-sm"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-1.5 border rounded text-sm"
            rows="2"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 p-1.5 border rounded text-sm"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="flex-1 p-1.5 border rounded text-sm"
            >
              <option value="">Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            className="w-full bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 transition text-sm"
            onClick={taskId ? updateTask : addTask}
          >
            {taskId ? 'Update Task' : 'Add Task'}
          </button>
        </div>
        <div className="space-y-3">
          {renderTasks()}
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg text-sm">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
}

export default ToDo;
