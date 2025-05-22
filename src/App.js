import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PendingTasks from './pendingTasks';
import CompletedTasks from './compTasks';



const App = () => {
  return (
    <Router>
      <div className="container mt-4">
       

        <Routes>
          <Route path="/" element={<Navigate to="/pending" />} />
          <Route path="/pending" element={<PendingTasks />} />
          <Route path="/completed" element={<CompletedTasks />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
