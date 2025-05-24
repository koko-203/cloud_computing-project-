import React, { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import Todo from "./Todo";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";


const style = {
  bg: `absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0] flex justify-center items-center p-4`,
  container: `bg-slate-100 w-full max-w-xl rounded-md shadow-xl p-6`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
 
};

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
    if (!currentUser) {
      console.log("No user found");
      return;
    }
    
    console.log("Current user:", currentUser.uid);
    const q = query(collection(db, "todos", currentUser.uid, "userTodos"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Snapshot received:", snapshot.size, "documents");
      const todosArr = [];
      snapshot.forEach((doc) => {
        console.log("Todo item:", doc.data());
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    }, (error) => {
      console.error("Error fetching todos:", error);
      setError("Error loading tasks");
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Migrate old todos
  useEffect(() => {
    const migrateTodos = async () => {
      if (!currentUser) return;
      
      try {
        // Check old location
        const oldTodosRef = collection(db, "users", currentUser.uid, "todos");
        const oldTodosSnapshot = await getDocs(oldTodosRef);
        
        if (!oldTodosSnapshot.empty) {
          console.log("Found old todos, migrating...");
          
          // Create new location
          const newTodosRef = collection(db, "todos", currentUser.uid, "userTodos");
          
          // Move each todo
          for (const doc of oldTodosSnapshot.docs) {
            const todoData = doc.data();
            await addDoc(newTodosRef, {
              ...todoData,
              createdAt: todoData.createdAt || new Date().toISOString()
            });
            await deleteDoc(doc.ref);
          }
          
          console.log("Migration complete");
        }
      } catch (err) {
        console.error("Migration error:", err);
      }
    };
    
    migrateTodos();
  }, [currentUser]);

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const todoRef = collection(db, "todos", currentUser.uid, "userTodos");
      await addDoc(todoRef, {
        text: input,
        completed: false,
        priority,
        dueDate,
        createdAt: new Date().toISOString(),
      });
      setInput("");
      setDueDate("");
      setPriority("Medium");
    } catch (err) {
      console.error("Error creating todo:", err);
      setError("Failed to create task");
    }
  };

  // Toggle complete
  const toggleComplete = async (todo) => {
    try {
      await updateDoc(doc(db, "todos", currentUser.uid, "userTodos", todo.id), {
        completed: !todo.completed,
      });
    } catch (err) {
      console.error("Error toggling todo:", err);
      setError("Failed to update task");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", currentUser.uid, "userTodos", id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete task");
    }
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
   <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <h3 className="text-xl font-semibold text-center mt-2">
          Welcome, {currentUser?.displayName || currentUser?.email}
        </h3>
        {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}

      {/*Update Email or Password */}
      <div className="text-center mb-4">
       <Link to="/update-profile" className="text-blue-600 underline text-sm">
       Update Email or Password
        </Link>
        </div>

        {/*logout */}
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

        {/* Filter and search
        Search */}
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
            .map((todo) => (
              <Todo
                key={todo.id}
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