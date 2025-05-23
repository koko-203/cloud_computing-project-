import React, { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import Todo from "./Todo";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
    const navigate = useNavigate();


  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [dueDate, setDueDate] = useState("");

  // Fetch todos
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "users", currentUser.uid, "todos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosArr = [];
      snapshot.forEach((doc) =>
        todosArr.push({ ...doc.data(), id: doc.id })
      );
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addDoc(collection(db, "users", currentUser.uid, "todos"), {
      text: input,
      completed: false,
      priority,
      dueDate,
    });
    setInput("");
    setDueDate("");
    setPriority("Medium");
  };

  // Toggle complete
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "users", currentUser.uid, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "users", currentUser.uid, "todos", id));
  };

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-400">
      <div className="bg-white max-w-xl w-full mx-auto rounded-md shadow-xl p-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome, {currentUser?.email}</h2>
        {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}

        {/* Logout */}
        <div className="text-center mb-4">
          <button onClick={handleLogout} className="text-red-600 text-sm underline">
            Log Out
          </button>
        </div>

        {/* Create Todo */}
        <form onSubmit={createTodo} className="flex flex-wrap items-center gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 rounded text-sm flex-1"
            type="text"
            placeholder="Add Todo"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded text-xs"
          />
          <button className="bg-purple-600 text-white p-2 rounded">
            <AiOutlinePlus size={20} />
          </button>
        </form>

        {/* Filter/Search */}
        <div className="flex flex-col md:flex-row justify-between gap-2 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border rounded w-full md:w-1/4"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Todo List */}
        <ul>
          {todos
            .filter((todo) =>
              todo.text.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((todo) =>
              filterPriority === "All" ? true : todo.priority === filterPriority
            )
            .map((todo, index) => (
              <Todo
                key={index}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
              />
            ))}
        </ul>

        {todos.length > 0 && (
          <p className="text-center text-sm mt-4 text-gray-600">
            You have {todos.length} tasks
          </p>
        )}
      </div>
    </div>
  );
}