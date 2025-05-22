import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import TaskForm from './TaskForm';
import { useNavigate } from 'react-router-dom';

const TaskList = ({ taskStatus }) => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  
  const SUBMISSION_PERIOD_DAYS = 3;

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/tasks');
    const fetchedTasks = res.data;
    setTasks(fetchedTasks);

    const now = moment();
    const pendingWithinPeriod = fetchedTasks.some(task => {
      const submissionDate = moment(task.submission_date);
      return !task.completed && now.diff(submissionDate, 'days') <= SUBMISSION_PERIOD_DAYS;
    });

    if (pendingWithinPeriod) {
      setShowPopup(true);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = (task) => {
    setTasks(prev => [task, ...prev]);
  };

  const toggleComplete = async (task) => {
    await axios.put(`http://localhost:5000/tasks/${task.id}`, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const updateTask = async (task) => {
    await axios.put(`http://localhost:5000/tasks/${task.id}`, {
      ...task,
      title: editTitle,
      description: editDescription,
    });
    setEditTask(null);
    fetchTasks();
  };

  const visibleTasks = showAll
    ? tasks
    : taskStatus === 'pending'
      ? tasks.filter(t => !t.completed)
      : tasks.filter(t => t.completed);

  const renderTask = (task) => {
    const isEditing = editTask && editTask.id === task.id;

    return (
      <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row bg-light border mb-2 shadow-sm hover-shadow">
        <div className="me-3 text-start w-100">
          {isEditing ? (
            <>
              <input
                className="form-control mb-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                className="form-control"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </>
          ) : (
            <>
              <h5 className={`mb-1 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                {task.title}
              </h5>
              <small className="text-muted">
                {moment(task.submission_date).format('MMM DD, YYYY [at] h:mm A')}
              </small>
              <p className={`mb-1 ${task.completed ? 'text-muted' : ''}`}>
                {task.description.length > 100 ? (
                  <>
                    {task.description.slice(0, 100)}...
                    <span
                      className="text-primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => alert(task.description)}
                    >
                      Read More
                    </span>
                  </>
                ) : task.description}
              </p>
            </>
          )}
        </div>

        <div className="btn-group mt-2 mt-md-0">
          {isEditing ? (
            <>
              <button className="btn btn-sm btn-outline-primary" onClick={() => updateTask(task)}>
                Save
              </button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditTask(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => alert(` Title: ${task.title}\n\n📝 Description: ${task.description}`)}
              >
                View
              </button>
              <button
                className={`btn btn-sm ${task.completed ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                onClick={() => toggleComplete(task)}
              >
                {task.completed ? 'Mark Pending' : 'Complete'}
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setEditTask(task);
                  setEditTitle(task.title);
                  setEditDescription(task.description);
                }}
              >
                Edit
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x p-4"
          style={{ zIndex: 9999 }}
        >
          <div className="alert alert-warning alert-dismissible fade show shadow" role="alert">
            <strong>⚠️ Pending Tasks Alert:</strong> You have tasks that are pending and due within the submission period!
            <button type="button" className="btn-close" onClick={handleClosePopup}></button>
          </div>
        </div>
      )}

      <TaskForm onTaskAdded={handleTaskAdded} />

      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <button className="btn btn-warning" onClick={() => navigate('/pending')}>View Pending Tasks</button>
        <button className="btn btn-success" onClick={() => navigate('/completed')}>View Completed Tasks</button>
        <button className="btn btn-info" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Hide All Tasks' : 'View All Tasks'}
        </button>
      </div>

      <div className="mb-5">
        <div className="list-group">
          {visibleTasks.length > 0
            ? visibleTasks.sort((a, b) => moment(b.submission_date).diff(moment(a.submission_date)))
              .map(renderTask)
            : <p className="text-muted">No tasks</p>}
        </div>
      </div>
    </>
  );
};

export default TaskList;
