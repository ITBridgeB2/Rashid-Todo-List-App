import React from 'react';
import TaskList from './TaskList';

const PendingTasks = () => {
  return (
    <div>
      
      <TaskList taskStatus="pending" />
    </div>
  );
};

export default PendingTasks;
