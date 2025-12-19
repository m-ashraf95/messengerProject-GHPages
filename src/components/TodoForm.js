import React, { useState } from 'react';
import './TodoForm.css';

function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAdd(text.trim());
    
    if (success) {
      setText('');
    }
    setIsSubmitting(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new todo item..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="add-btn"
          disabled={!text.trim() || isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
}

export default TodoForm;

