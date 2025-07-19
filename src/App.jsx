import { useState, createContext, useContext, useEffect } from "react";
import "./App.css";

// ✅ 1. Context Setup
const TodoContext = createContext();

function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage on initial render
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : true; // true = light
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        editIndex,
        setEditIndex,
        input,
        setInput,
        theme,
        setTheme,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// ✅ 2. Theme Wrapper
function Theme({ children }) {
  const { theme, setTheme } = useContext(TodoContext);

  return (
    <div className={theme ? "light" : "dark"}>
      <div className="container">
        <button
          className="theme-toggle"
          onClick={() => setTheme((prev) => !prev)}
        >
          {theme ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
        {children}
      </div>
    </div>
  );
}

// ✅ 3. App Component
function App() {
  return (
    <TodoProvider>
      <Theme>
        <h1>📝 Todo App</h1>
        <AddTodo />
        <DisplayTodo />
      </Theme>
    </TodoProvider>
  );
}

// ✅ 4. Add + Edit Todo Logic
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
      const updated = [...todos];
      updated[editIndex].text = trimmed;
      setTodos(updated);
      setEditIndex(null);
    } else {
      setTodos([...todos, { text: trimmed, completed: false }]);
    }

    setInput("");
  };

  return (
    <div className="add-todo">
      <input
        type="text"
        placeholder="Add a todo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {editIndex !== null ? "Update" : "Add"}
      </button>
    </div>
  );
}

// ✅ 5. Display, Delete, Edit, Mark
function DisplayTodo() {
  const { todos, setTodos, setEditIndex, setInput } =
    useContext(TodoContext);

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
    <div className="todo-list">
      {todos.map((todo, idx) => (
        <div className="todo-item" key={idx}>
          <button onClick={() => toggleMark(idx)}>
            {todo.completed ? "✅" : "⬜"}
          </button>
          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
              flex: 1,
            }}
          >
            {todo.text}
          </span>
          <button onClick={() => editTodo(idx)}>Edit</button>
          <button onClick={() => deleteTodo(idx)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
