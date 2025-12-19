import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import { todoService } from '../services/storageService';

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if running in Messenger Extensions
  const isMessenger = () => {
    return typeof window !== 'undefined' && window.MessengerExtensions;
  };

  // Close the webview when done (Messenger Extensions)
  const closeWebview = () => {
    if (isMessenger()) {
      window.MessengerExtensions.requestCloseBrowser(
        function success() {
          console.log('Webview closed');
        },
        function error(err) {
          console.error('Error closing webview:', err);
        }
      );
    }
  };

  // Fetch todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await todoService.getAll();
      // Sort by creation date, newest first
      setTodos(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async (text) => {
    try {
      const newTodo = await todoService.create({ text });
      setTodos([newTodo, ...todos]);
      return true;
    } catch (error) {
      console.error('Error adding todo:', error);
      return false;
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, completed) => {
    try {
      const updated = await todoService.update(id, { completed: !completed });
      setTodos(todos.map(todo => todo.id === id ? updated : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await todoService.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Navigate to detail page
  const viewDetail = (id) => {
    navigate(`/todo/${id}`);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📝 Todo List</h1>
          {isMessenger() && (
            <button className="close-btn" onClick={closeWebview}>
              ✕ Close
            </button>
          )}
        </header>
        
        <TodoForm onAdd={addTodo} />
        
        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onViewDetail={viewDetail}
          />
        )}
      </div>
    </div>
  );
}

export default TodoListPage;
