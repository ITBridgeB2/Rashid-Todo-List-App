// TaskModal.js
import React from 'react';

const overlayStyles = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
};

const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  zIndex: 1001,
};

const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <>
      <div style={overlayStyles} onClick={onClose}></div>
      <div style={modalStyles}>
        <h4 className="mb-3">Task Details</h4>
        <p><strong>Title:</strong> {task.title}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <button className="btn btn-primary mt-3" onClick={onClose}>Close</button>
      </div>
    </>
  );
};

export default TaskModal;
