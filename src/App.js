import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import TodoListPage from './pages/TodoListPage';
import TodoDetailPage from './pages/TodoDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoListPage />} />
        <Route path="/todo/:id" element={<TodoDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
