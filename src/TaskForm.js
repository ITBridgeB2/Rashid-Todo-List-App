import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');

    try {
      const res = await axios.post('http://localhost:5000/tasks', { title, description });
      setTitle('');
      setDescription('');
      onTaskAdded(res.data); // send task back to parent
      alert('Task added successfully!');
    } catch (error) {
      console.error(error);
      alert('Error adding task');
    }
  };

  return (
    <div>
      {/* Header: ToDo List */}
      <header className="bg-primary text-white text-center py-3 mb-4">
        <h2>ToDo List</h2>
      </header>

      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white mb-4">
        <h4 className="mb-3">Add New Task</h4>
        <div className="mb-3">
          <input
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task Title"
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Task Description"
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
