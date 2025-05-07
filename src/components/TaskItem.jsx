import React, { useState, useEffect, useRef } from "react";

const TaskItem = ({ task, onEdit, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const menuRef = useRef(null);

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

  const handleCardClick = (e) => {
    if (e.target.closest(".toggle-menu") || e.target.closest(".options-menu")) {
      return;
    }
    setShowDetailsDialog(true);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  return (
    <>
      <div
        className={`border rounded-lg p-4 ${statusClasses[task.status]} ${
          priorityBorderClasses[priority]
        } cursor-pointer hover:shadow-md transition-shadow duration-200`}
        onClick={handleCardClick}
      >
        <div className="flex justify-between">
          <h3 className="font-bold mb-2">{task.title}</h3>
          <div className="relative toggle-menu" ref={menuRef}>
            <button
              onClick={handleToggleClick}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="w-5 h-5"
              >
                <circle cx="8" cy="2" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="14" r="1.5" />
              </svg>
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10 options-menu">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-700 mb-2 line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap items-center gap-2">
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
      </div>

      {showDetailsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{task.title}</h2>
              <button
                onClick={() => setShowDetailsDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Description
              </div>
              <div className="text-gray-700">{task.description}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Status
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      statusColors[task.status]
                    }`}
                  ></span>
                  <span>
                    {task.status.charAt(0).toUpperCase() +
                      task.status.slice(1).replace("-", " ")}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Priority
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${priorityColors[priority]}`}
                  ></span>
                  <span>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {formattedDueDate && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Due Date
                </div>
                <div>{formattedDueDate}</div>
              </div>
            )}

            {task.createdAt && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Created
                </div>
                <div>{new Date(task.createdAt).toLocaleString()}</div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowDetailsDialog(false);
                  onEdit(task);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDetailsDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;
