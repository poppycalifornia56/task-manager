import React from "react";

const TaskItem = ({ task, onEdit, onDelete }) => {
  const statusClasses = {
    pending: "bg-white",
    "in-progress": "bg-yellow-50",
    completed: "bg-green-50",
  };

  const statusColors = {
    pending: "bg-gray-500",
    "in-progress": "bg-yellow-500",
    completed: "bg-green-500",
  };

  const statusBadgeClasses = {
    pending: "text-gray-800",
    "in-progress": "text-yellow-800",
    completed: "text-green-800",
  };

  const priorityBorderClasses = {
    low: "border-l-4 border-green-400",
    medium: "border-l-4 border-blue-400",
    high: "border-l-4 border-yellow-400",
    critical: "border-l-4 border-red-400",
  };

  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-blue-500",
    high: "bg-yellow-500",
    critical: "bg-red-500",
  };

  const priorityBadgeClasses = {
    low: "text-green-800",
    medium: "text-blue-800",
    high: "text-yellow-800",
    critical: "text-red-800",
  };

  const priority = task.priority || "medium";

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  return (
    <div
      className={`border rounded-lg p-4 ${statusClasses[task.status]} ${
        priorityBorderClasses[priority]
      }`}
    >
      <h3 className="font-bold mb-2">{task.title}</h3>
      <p className="text-gray-700 mb-2">{task.description}</p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`px-2 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 flex items-center ${
            statusBadgeClasses[task.status]
          }`}
        >
          <span
            className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
              statusColors[task.status]
            }`}
          ></span>
          {task.status.charAt(0).toUpperCase() +
            task.status.slice(1).replace("-", " ")}
        </span>

        <span
          className={`px-2 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 flex items-center ${priorityBadgeClasses[priority]}`}
        >
          <span
            className={`inline-block w-2 h-2 rounded-full mr-1.5 ${priorityColors[priority]}`}
          ></span>
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </span>

        {formattedDueDate && (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-50 border border-gray-200">
            Due: {formattedDueDate}
          </span>
        )}
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
