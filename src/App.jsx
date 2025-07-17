import { useState, createContext, useContext } from 'react';
import './App.css';

// ✅ 1. Context Setup
const TodoContext = createContext();

function TodoProvider({ children }) {
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
        <AddTodo />
        <DisplayTodo />
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
    setTodos([...todos, trimmed]);
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

// ✅ 4. Display Todo + Delete Support
function DisplayTodo() {
  const { todos, setTodos } = useContext(TodoContext);

  const deleteTodo = (index) => {
    const updated = [...todos];
    updated.splice(index, 1); // remove 1 item at 'index'
    setTodos(updated);
  };

  return (
    <div>
      {todos.map((todo, idx) => (
        <div key={idx} className="todo-item">
          <span>{todo}</span>
          <button onClick={() => deleteTodo(idx)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
