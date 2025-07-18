import { useState, createContext, useContext } from 'react';
import './App.css';

// ✅ 1. Context Setup
const TodoContext = createContext();

function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // null when not editing
  const [input, setInput] = useState('');

  return (
    <TodoContext.Provider
      value={{ todos, setTodos, editIndex, setEditIndex, input, setInput }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// ✅ 2. App Wrapper
function App() {
  return (
    <TodoProvider>
      <div>
        <h1>Todo App</h1>
        <AddTodo />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DisplayTodo />
        </div>
      </div>
    </TodoProvider>
  );
}

// ✅ 3. Add + Edit Todo Logic
function AddTodo() {
  const {
    todos,
    setTodos,
    editIndex,
    setEditIndex,
    input,
    setInput,
  } = useContext(TodoContext);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (editIndex !== null) {
      // Editing an existing todo
      const updated = [...todos];
      updated[editIndex].text = trimmed;
      setTodos(updated);
      setEditIndex(null);
    } else {
      // Adding a new todo
      setTodos([...todos, { text: trimmed, completed: false }]);
    }

    setInput('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add a todo"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>{editIndex !== null ? 'Update' : 'Add'}</button>
    </div>
  );
}

// ✅ 4. Display, Delete, Edit, Mark
function DisplayTodo() {
  const {
    todos,
    setTodos,
    setEditIndex,
    setInput,
  } = useContext(TodoContext);

  const deleteTodo = (index) => {
    const updated = [...todos];
    updated.splice(index, 1);
    setTodos(updated);
  };

  const toggleMark = (index) => {
    const updated = todos.map((todo, idx) =>
      idx === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
  };

  const editTodo = (index) => {
    setEditIndex(index);
    setInput(todos[index].text);
  };

  return (
    <div>
      {todos.map((todo, idx) => (
        <div
          key={idx}
          className="todo-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px',
          }}
        >
          <button onClick={() => toggleMark(idx)}>
            {todo.completed ? '✅' : '⬜'}
          </button>
          <span
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
            }}
          >
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(idx)}>Delete</button>
          <button onClick={() => editTodo(idx)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default App;
