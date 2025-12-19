import React from 'react';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete, onViewDetail }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
        />
        <span className="todo-text">{todo.text}</span>
      </div>
      <div className="todo-actions">
        <button
          className="detail-btn"
          onClick={() => onViewDetail(todo.id)}
          aria-label="View details"
          title="View details"
        >
          📝
        </button>
        <button
          className="delete-btn"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TodoItem;

