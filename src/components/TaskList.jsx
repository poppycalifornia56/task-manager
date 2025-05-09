import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const TaskList = ({ tasks, onEdit, onDelete, loading, showActions = true }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [sortField, setSortField] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const itemsPerPage = 10;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const sortTasks = (tasksToSort) => {
    const sortedTasks = [...tasksToSort];

    sortedTasks.sort((a, b) => {
      switch (sortField) {
        case "status":
          if (a.status < b.status) return sortDirection === "asc" ? -1 : 1;
          if (a.status > b.status) return sortDirection === "asc" ? 1 : -1;
          return 0;

        case "priority": {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          const priorityA = priorityOrder[a.priority] || 2; 
          const priorityB = priorityOrder[b.priority] || 2;

          return sortDirection === "asc"
            ? priorityA - priorityB
            : priorityB - priorityA;
        }

        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return sortDirection === "asc" ? 1 : -1;
          if (!b.dueDate) return sortDirection === "asc" ? -1 : 1;

          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);

          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;

        default: 
          if (a.title.toLowerCase() < b.title.toLowerCase())
            return sortDirection === "asc" ? -1 : 1;
          if (a.title.toLowerCase() > b.title.toLowerCase())
            return sortDirection === "asc" ? 1 : -1;
          return 0;
      }
    });

    return sortedTasks;
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIndicator = (field) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-300">↓</span>;
    }

    return (
      <span className="ml-1 text-gray-600">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

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

  const sortedTasks = sortTasks(tasks);
  const pageCount = Math.ceil(sortedTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {!isMobile && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-2/5 cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      <span>Task</span>
                      {getSortIndicator("title")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-1/6 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center justify-center">
                      <span>Status</span>
                      {getSortIndicator("status")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-1/6 cursor-pointer"
                    onClick={() => handleSort("priority")}
                  >
                    <div className="flex items-center justify-center">
                      <span>Priority</span>
                      {getSortIndicator("priority")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/4 cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    <div className="flex items-center">
                      <span>Due Date</span>
                      {getSortIndicator("dueDate")}
                    </div>
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
                    className={`cursor-pointer hover:bg-gray-50 ${getRowBackgroundClass(
                      task
                    )}`}
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
      )}

      {isMobile && (
        <div>
          <div className="mb-4">
            <div className="flex items-center bg-white rounded-lg shadow p-3">
              <div className="text-sm font-medium text-gray-700 mr-3">
                Sort by:
              </div>
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split("-");
                  setSortField(field);
                  setSortDirection(direction);
                  setCurrentPage(1);
                }}
                className="flex-grow py-1 px-2 text-sm border border-gray-300 rounded"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="status-asc">Status (A-Z)</option>
                <option value="status-desc">Status (Z-A)</option>
                <option value="priority-desc">Priority (High-Low)</option>
                <option value="priority-asc">Priority (Low-High)</option>
                <option value="dueDate-asc">Due Date (Earliest)</option>
                <option value="dueDate-desc">Due Date (Latest)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {currentTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow p-4 ${getRowBackgroundClass(
                  task
                )}`}
                onClick={() => handleRowClick(task)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-lg font-medium text-gray-900">
                    {task.title}
                  </div>
                  {showActions && (
                    <div
                      className="flex space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(task);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(task.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {task.description && (
                  <div className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {task.description}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(
                        task.status
                      )}`}
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Priority</div>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getPriorityBadgeClass(
                        task.priority
                      )}`}
                    >
                      {task.priority
                        ? task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)
                        : "Medium"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Due Date</div>
                  <div
                    className={`text-sm ${
                      isOverdue(task.dueDate)
                        ? "text-red-600 font-medium"
                        : "text-gray-700"
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 px-4">
          <div className="text-sm text-gray-500 mb-2 md:mb-0">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, sortedTasks.length)} of{" "}
            {sortedTasks.length} tasks
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
