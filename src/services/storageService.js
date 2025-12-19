// localStorage service - acts like a JSON database
const STORAGE_KEY = 'messenger_todo_app_data';

// Get all data from localStorage
const getData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { todos: [], subTodos: [] };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { todos: [], subTodos: [] };
  }
};

// Save data to localStorage
const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some data.');
    }
    return false;
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Todos API
export const todoService = {
  // Get all todos
  getAll: () => {
    const data = getData();
    return Promise.resolve(data.todos || []);
  },

  // Get single todo
  getById: (id) => {
    const data = getData();
    const todo = data.todos.find(t => t.id === id);
    if (todo) {
      // Include sub-todos
      const subTodos = (data.subTodos || []).filter(st => st.todoId === id);
      return Promise.resolve({ ...todo, subTodos });
    }
    return Promise.reject(new Error('Todo not found'));
  },

  // Create todo
  create: (todoData) => {
    const data = getData();
    const newTodo = {
      id: generateId(),
      text: todoData.text,
      description: todoData.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.todos.push(newTodo);
    saveData(data);
    return Promise.resolve(newTodo);
  },

  // Update todo
  update: (id, updates) => {
    const data = getData();
    const index = data.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      data.todos[index] = {
        ...data.todos[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveData(data);
      return Promise.resolve(data.todos[index]);
    }
    return Promise.reject(new Error('Todo not found'));
  },

  // Delete todo
  delete: (id) => {
    const data = getData();
    data.todos = data.todos.filter(t => t.id !== id);
    // Also delete related sub-todos
    data.subTodos = (data.subTodos || []).filter(st => st.todoId !== id);
    saveData(data);
    return Promise.resolve();
  },
};

// Sub-Todos API
export const subTodoService = {
  // Get all sub-todos for a todo
  getByTodoId: (todoId) => {
    const data = getData();
    const subTodos = (data.subTodos || []).filter(st => st.todoId === todoId);
    return Promise.resolve(subTodos);
  },

  // Create sub-todo
  create: (subTodoData) => {
    const data = getData();
    const newSubTodo = {
      id: generateId(),
      text: subTodoData.text,
      todoId: subTodoData.todoId,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!data.subTodos) data.subTodos = [];
    data.subTodos.push(newSubTodo);
    saveData(data);
    return Promise.resolve(newSubTodo);
  },

  // Update sub-todo
  update: (id, updates) => {
    const data = getData();
    if (!data.subTodos) data.subTodos = [];
    const index = data.subTodos.findIndex(st => st.id === id);
    if (index !== -1) {
      data.subTodos[index] = {
        ...data.subTodos[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveData(data);
      return Promise.resolve(data.subTodos[index]);
    }
    return Promise.reject(new Error('Sub-todo not found'));
  },

  // Delete sub-todo
  delete: (id) => {
    const data = getData();
    if (!data.subTodos) data.subTodos = [];
    data.subTodos = data.subTodos.filter(st => st.id !== id);
    saveData(data);
    return Promise.resolve();
  },
};

