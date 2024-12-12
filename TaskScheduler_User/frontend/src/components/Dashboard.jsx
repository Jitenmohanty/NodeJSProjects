import React, { useContext, useEffect, useState } from 'react';
import { TodoContext } from '../context/todoContext';
import { UserContext } from '../context/userContext';

const Dashboard = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [todo, setTodo] = useState({
    title: '',
    description: '',
    assigneeId: '', // This will hold the selected user name
    dueDate: '',
  });
  const { addTodos,todos,getAllTodos } = useContext(TodoContext);
  const { getAllUser, allUser } = useContext(UserContext);

  useEffect(() => {
    getAllUser();
    getAllTodos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo({
      ...todo,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Todo Added:', todo);
    await addTodos(todo);
    setIsFormVisible(false); // Hide the form after submission
    setTodo({ title: '', description: '', assigneeId: '', dueDate: '' }); // Clear the form
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <button
        onClick={() => setIsFormVisible(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
      >
        Add Todo
      </button>

      {todos && todos.map((todo) => (
          <div
            key={todo._id}
            className="bg-purple-400 p-6 rounded-lg m-8 shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{todo.title}</h2>
            <p className="text-gray-600 mt-2">{todo.description}</p>
            <div className="mt-4">
              <span className="text-sm text-gray-300">Due Date:</span>
              <p className="text-lg font-semibold">{todo.dueDate}</p>
            </div>

            <div className="mt-4">
              <span className="text-sm text-gray-300">Time Left:</span>
              <p className="text-lg font-semibold text-red-500">
                { 'Calculating...'}
              </p>
            </div>
          </div>
        ))}

      {isFormVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-center mb-4">Add New Todo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={todo.title}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  id="description"
                  value={todo.description}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User</label>
                <select
                  name="assigneeId"
                  id="assigneeId"
                  value={todo.assigneeId}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select User</option>
                  {allUser && allUser.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={todo.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Add Todo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
