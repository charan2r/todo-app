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
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Todo App</h1>
        {showToast && (
          <div
            className={`fixed top-0 right-0 m-4 p-2 rounded shadow-lg ${
              confirmationMessage.includes('success')
                ? 'bg-green-500'
                : confirmationMessage.includes('error')
                ? 'bg-red-500'
                : 'bg-yellow-500'
            }`}
          >
            {confirmationMessage}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            taskId ? updateTask() : addTask();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
          <input
            type="datetime-local"
            id="due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Date"
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {taskId ? 'Update Task' : 'Add Task'}
          </button>
        </form>

        <div className="mt-6">{renderTasks()}</div>
      </div>
    </div>
  );
}

export default ToDo;
