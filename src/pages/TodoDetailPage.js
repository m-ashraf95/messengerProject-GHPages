import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import './TodoDetailPage.css';
import { todoService, subTodoService } from '../services/storageService';

function TodoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [subTodos, setSubTodos] = useState([]);
  const [description, setDescription] = useState('');
  const [subTodoText, setSubTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch todo and sub-todos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch todo (includes subTodos from service)
        const todoData = await todoService.getById(id);
        setTodo(todoData);
        setDescription(todoData.description || '');
        
        // Fetch sub-todos separately
        const subTodosData = await subTodoService.getByTodoId(id);
        setSubTodos(subTodosData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setTodo(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Save description
  const saveDescription = async () => {
    setSaving(true);
    try {
      const updated = await todoService.update(id, { description });
      setTodo(updated);
    } catch (error) {
      console.error('Error saving description:', error);
    } finally {
      setSaving(false);
    }
  };

  // Add sub-todo
  const addSubTodo = async (e) => {
    e.preventDefault();
    if (!subTodoText.trim()) return;

    try {
      const newSubTodo = await subTodoService.create({
        text: subTodoText.trim(),
        todoId: id,
      });
      setSubTodos([...subTodos, newSubTodo]);
      setSubTodoText('');
    } catch (error) {
      console.error('Error adding sub-todo:', error);
    }
  };

  // Toggle sub-todo completion
  const toggleSubTodo = async (subTodoId, completed) => {
    try {
      const updated = await subTodoService.update(subTodoId, { completed: !completed });
      setSubTodos(subTodos.map(st =>
        st.id === subTodoId ? updated : st
      ));
    } catch (error) {
      console.error('Error updating sub-todo:', error);
    }
  };

  // Delete sub-todo
  const deleteSubTodo = async (subTodoId) => {
    try {
      await subTodoService.delete(subTodoId);
      setSubTodos(subTodos.filter(st => st.id !== subTodoId));
    } catch (error) {
      console.error('Error deleting sub-todo:', error);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="container">
          <div className="loading">Loading todo details...</div>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="App">
        <div className="container">
          <div className="loading">Todo not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container detail-container">
        <header className="header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h1>{todo.text}</h1>
        </header>

        {/* Description Section */}
        <section className="detail-section">
          <h2>Description</h2>
          <textarea
            className="description-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this todo..."
            rows={4}
          />
          <button
            className="save-btn"
            onClick={saveDescription}
            disabled={saving || description === (todo.description || '')}
          >
            {saving ? 'Saving...' : 'Save Description'}
          </button>
        </section>

        {/* Sub-Todos Section */}
        <section className="detail-section">
          <h2>Sub-Action Items</h2>
          
          <form className="subtodo-form" onSubmit={addSubTodo}>
            <input
              type="text"
              className="subtodo-input"
              value={subTodoText}
              onChange={(e) => setSubTodoText(e.target.value)}
              placeholder="Add a sub-action item..."
            />
            <button type="submit" className="add-subtodo-btn">
              Add
            </button>
          </form>

          <div className="subtodo-list">
            {subTodos.length === 0 ? (
              <p className="empty-subtodos">No sub-action items yet. Add one above!</p>
            ) : (
              subTodos.map((subTodo) => (
                <div key={subTodo.id} className={`subtodo-item ${subTodo.completed ? 'completed' : ''}`}>
                  <div className="subtodo-content">
                    <input
                      type="checkbox"
                      className="subtodo-checkbox"
                      checked={subTodo.completed}
                      onChange={() => toggleSubTodo(subTodo.id, subTodo.completed)}
                    />
                    <span className="subtodo-text">{subTodo.text}</span>
                  </div>
                  <button
                    className="delete-subtodo-btn"
                    onClick={() => deleteSubTodo(subTodo.id)}
                    aria-label="Delete sub-todo"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TodoDetailPage;
