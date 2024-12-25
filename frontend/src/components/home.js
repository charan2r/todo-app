import React, { useState } from 'react';

const ToDo = () => {
  // State to manage tasks, form inputs, and search query
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // Add or update a task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title.trim()) {
      if (form.id) {
        // Update task
        setTasks((prev) =>
          prev.map((task) => (task.id === form.id ? { ...form } : task))
        );
      } else {
        // Add new task
        setTasks((prev) => [
          ...prev,
          { ...form, id: Date.now().toString() },
        ]);
      }
      resetForm();
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "Low",
    });
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Edit a task
  const editTask = (task) => {
    setForm(task);
  };

  // Search functionality
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1493809842364-78817add7ffb')",
      }}
    >
      <div className="w-full max-w-md mx-auto">
        <header className="bg-blue-500 text-white p-6 mb-5 rounded-lg shadow-lg mt-5">
          <h1 className="text-4xl font-bold text-center">ToDo</h1>
        </header>
        <form
          className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <input type="hidden" id="task-id" value={form.id} />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <i className="fa fa-tasks mr-2"></i>Title
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <i className="fa fa-info-circle mr-2"></i>Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <i className="fa fa-clock mr-2"></i>Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <i className="fa fa-bolt mr-2"></i>Priority
            </label>
            <select
              id="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex justify-center pt-5 mb-5">
            <button
              id="submit-btn"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
              type="submit"
            >
              {form.id ? "Update Task" : "Add Task"}
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <i className="fa fa-search mr-2"></i>Search
            </label>
            <input
              type="text"
              id="search-query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
            />
          </div>
        </form>
        <div id="task-list" className="mt-10">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">
                  Due: {task.dueDate || "No due date"} | Priority:{" "}
                  {task.priority}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => editTask(task)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteTask(task.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToDo;
