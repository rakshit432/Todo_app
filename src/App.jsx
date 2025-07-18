import { useState, createContext, useContext } from 'react';
import './App.css';

// ✅ 1. Context Setup
const TodoContext = createContext();

function TodoProvider({ children }) {
  // Each todo is now an object: { text: string, completed: boolean }
  const [todos, setTodos] = useState([]);
  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
}

// ✅ 2. Main App Component
function App() {
  return (
    <TodoProvider>
      <div>
        <h1>Todo App</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AddTodo />
          <DisplayTodo />
        </div>
      </div>
    </TodoProvider>
  );
}

// ✅ 3. Add Todo Component
function AddTodo() {
  const { todos, setTodos } = useContext(TodoContext);
  const [input, setInput] = useState('');

  const addTodo = () => {
    const trimmed = input.trim();
    if (trimmed === '') return;
    setTodos([...todos, { text: trimmed, completed: false }]);
    setInput(''); // clear input after adding
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add a todo"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
    </div>
  );
}

// ✅ 4. Display Todo + Delete & Mark Support
function DisplayTodo() {
  const { todos, setTodos } = useContext(TodoContext);

  const deleteTodo = (index) => {
    const updated = [...todos];
    updated.splice(index, 1); // remove 1 item at 'index'
    setTodos(updated);
  };

  const toggleMark = (index) => {
    const updated = todos.map((todo, idx) =>
      idx === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
  };

  return (
    <div>
      {todos.map((todo, idx) => (
        <div key={idx} className="todo-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => toggleMark(idx)}>
            {todo.completed ? "✅" : "⬜"}
          </button>
          {/* 
            The 'textDecoration' CSS property controls how text is decorated.
            Here, if the todo is completed, we show a line through the text ('line-through').
            Otherwise, we show normal text ('none').
          */}
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
          <button onClick={() => deleteTodo(idx)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
