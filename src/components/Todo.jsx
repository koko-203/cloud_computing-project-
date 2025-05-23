import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
//import { useAuth } from '../contexts/AuthContext';


const style = {
  li: `flex justify-between bg-slate-200 p-4 my-2 capitalize`,
  liComplete: `flex justify-between bg-slate-400 p-4 my-2 capitalize`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
};

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
    //const { currentUser } = useAuth();
     const getCountdown = (dueDate) => {
       if (!dueDate) return null;
         const now = new Date();
         const due = new Date(dueDate);
         const diff = due - now;
    
           if (diff <= 0) return " Overdue!";

          const minutes = Math.floor(diff / 1000 / 60) % 60;
          const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
          const days = Math.floor(diff / 1000 / 60 / 60 / 24);
          return `Due in ${days}d ${hours}h ${minutes}m`;
    };

  return (
    <li className={todo.completed ? style.liComplete : style.li}>
      <div className={style.row}>
        <input onChange={() => toggleComplete(todo)} type='checkbox' checked={todo.completed ? 'checked' : ''} />
        <p onClick={() => toggleComplete(todo)} className={todo.completed ? style.textComplete : style.text}>
          {todo.text}
        </p>
            {todo.dueDate && (
             <p
            className={`text-[10px] mt-1 italic ${ new Date(todo.dueDate) < new Date()? 'text-red-500 font-medium' : 'text-gray-500' }`}
          >     
              {getCountdown(todo.dueDate)}
           </p>
          )}


         <span
             className={`text-xs font-semibold px-2 py-1 rounded ml-2 
               ${todo.priority === 'High' ? 'bg-red-500 text-white' :
                todo.priority === 'Medium' ? 'bg-yellow-400 text-black' :
                'bg-green-400 text-black'}`}
                 >
              {todo.priority}
             </span>
      </div>
      <button onClick={() => deleteTodo(todo.id)}>{<FaRegTrashAlt />}</button>
    </li>
  );
};

export default Todo;