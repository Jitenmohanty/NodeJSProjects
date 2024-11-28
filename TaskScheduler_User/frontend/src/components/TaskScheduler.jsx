import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskScheduler = ({ user }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get(`/api/tasks?userId=${user.id}`).then((res) => setTasks(res.data));

  }, [user]);

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="border p-4 rounded-lg shadow-md space-y-2"
        >
          <h1 className="text-xl font-semibold">{task.title}</h1>
          <p className="text-gray-700">{task.description}</p>
          <span
            className={`inline-block px-3 py-1 text-white rounded-full ${
              task.status === "Overdue" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {task.status}
          </span>
          <button
            className={`mt-2 px-4 py-2 text-white rounded-md ${
              task.status === "Completed"
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={() => {
              axios.patch(`/api/tasks/${task.id}`, { status: "Completed" }).then(() => {
                setTasks((prevTasks) =>
                  prevTasks.map((t) =>
                    t.id === task.id ? { ...t, status: "Completed" } : t
                  )
                );
              });
            }}
            disabled={task.status === "Completed"}
          >
            Mark as Completed
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskScheduler;
