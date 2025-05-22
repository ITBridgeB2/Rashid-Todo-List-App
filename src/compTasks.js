import React from 'react';
import TaskList from './TaskList';

const CompletedTasks = () => {
  return (
    <div>
    
      <TaskList taskStatus="completed" />
    </div>
  );
};

export default CompletedTasks;
