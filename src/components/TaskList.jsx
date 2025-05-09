import React, { useState } from "react";
import { format } from "date-fns";

const TaskList = ({ tasks, onEdit, onDelete, loading, showActions = true }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found. Try adding one!</p>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // eslint-disable-next-line 
  const getRowBackgroundClass = (task) => {
    if (isOverdue(task.dueDate)) {
      return "bg-red-50";
    }
    return "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      console.error("Invalid date format:", e);
      return "Invalid date";
    }
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    try {
      const dueDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today;
    } catch (e) {
      return false;
    }
  };

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setShowDetailsDialog(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-blue-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const pageCount = Math.ceil(tasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        <div className="w-full">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-2/5"
                >
                  Task
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-1/6"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-1/6"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/4"
                >
                  Due Date
                </th>
                {showActions && (
                  <th
                    scope="col"
                    className="px-4 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider w-1/6"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => handleRowClick(task)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-gray-900">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(
                        task.status
                      )}`}
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getPriorityBadgeClass(
                        task.priority
                      )}`}
                    >
                      {task.priority
                        ? task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)
                        : "Medium"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-sm ${
                        isOverdue(task.dueDate)
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {formatDate(task.dueDate)}
                      {task.dueTime && (
                        <span className="ml-1">at {task.dueTime}</span>
                      )}
                      {isOverdue(task.dueDate) && (
                        <span className="ml-2 text-xs font-medium text-red-600">
                          (Overdue)
                        </span>
                      )}
                    </span>
                  </td>
                  {showActions && (
                    <td
                      className="px-4 py-5 text-right text-sm font-medium whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(task);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(task.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pageCount > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, tasks.length)} of {tasks.length} tasks
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-300"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
              let pageNum;
              if (pageCount <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pageCount - 2) {
                pageNum = pageCount - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                pageNum > 0 &&
                pageNum <= pageCount && (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              );
            })}

            <button
              onClick={() => paginate(Math.min(currentPage + 1, pageCount))}
              disabled={currentPage === pageCount}
              className={`px-3 py-1 rounded ${
                currentPage === pageCount
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showDetailsDialog && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedTask.title}</h2>
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
              <div className="text-gray-700">
                {selectedTask.description || "No description provided"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Status
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(
                      selectedTask.status
                    )}`}
                  ></span>
                  <span>
                    {selectedTask.status === "in-progress"
                      ? "In Progress"
                      : selectedTask.status.charAt(0).toUpperCase() +
                        selectedTask.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Priority
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${getPriorityColor(
                      selectedTask.priority
                    )}`}
                  ></span>
                  <span>
                    {selectedTask.priority
                      ? selectedTask.priority.charAt(0).toUpperCase() +
                        selectedTask.priority.slice(1)
                      : "Medium"}
                  </span>
                </div>
              </div>
            </div>

            {selectedTask.dueDate && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Due Date
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(selectedTask.dueDate)}
                    {isOverdue(selectedTask.dueDate) && (
                      <span className="ml-2 text-xs font-medium text-red-600">
                        (Overdue)
                      </span>
                    )}
                  </div>
                </div>

                {selectedTask.dueTime && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Due Time
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {selectedTask.dueTime}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTask.createdAt && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Created
                </div>
                <div>{new Date(selectedTask.createdAt).toLocaleString()}</div>
              </div>
            )}

            <div className="flex justify-end mt-6">
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
    </div>
  );
};

export default TaskList;
