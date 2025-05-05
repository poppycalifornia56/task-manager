import React from "react";

const TaskItem = ({ task, onEdit, onDelete }) => {
  const statusClasses = {
    pending: "bg-white",
    "in-progress": "bg-yellow-50",
    completed: "bg-green-50",
  };

  const statusBadgeClasses = {
    pending: "bg-gray-200 text-gray-800",
    "in-progress": "bg-yellow-200 text-yellow-800",
    completed: "bg-green-200 text-green-800",
  };

  return (
    <div className={`border rounded-lg p-4 ${statusClasses[task.status]}`}>
      <h3 className="font-bold mb-2">{task.title}</h3>
      <p className="text-gray-700 mb-2">{task.description}</p>
      <div className="flex items-center mb-3">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            statusBadgeClasses[task.status]
          }`}
        >
          {task.status}
        </span>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
