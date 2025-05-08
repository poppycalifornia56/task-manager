import React, { useState, useEffect } from "react";

const TaskForm = ({
  addTask,
  updateTask,
  editTask,
  isEditMode,
  cancelEdit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [errors, setErrors] = useState({});

  const statusColors = {
    pending: "bg-gray-500",
    "in-progress": "bg-yellow-500",
    completed: "bg-green-500",
  };

  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-blue-500",
    high: "bg-yellow-500",
    critical: "bg-red-500",
  };

  useEffect(() => {
    if (isEditMode && editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setStatus(editTask.status || "pending");
      setPriority(editTask.priority || "low");
      setDueDate(editTask.dueDate || "");
      setDueTime(editTask.dueTime || "");
    } else {
      resetForm();
    }
  }, [isEditMode, editTask]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setPriority("low");
    setDueDate("");
    setDueTime("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (!dueTime) newErrors.dueTime = "Due time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const task = {
      title,
      description,
      status,
      priority,
      dueDate,
      dueTime,
    };

    if (isEditMode) {
      updateTask(task);
    } else {
      addTask(task);
      resetForm();
    }
  };

  const handleTimeChange = (e) => {
    setDueTime(e.target.value);
    if (errors.dueTime) {
      setErrors({ ...errors, dueTime: "" });
    }
  };

  const CustomSelect = ({
    id,
    value,
    options,
    onChange,
    label,
    required = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = React.useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [selectRef]);

    const selectedOption = options.find((option) => option.value === value);
    const colorMap = id === "status" ? statusColors : priorityColors;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative" ref={selectRef}>
          <div
            className={`w-full border ${
              errors[id] ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-8 pr-10 py-2 bg-white cursor-pointer flex items-center justify-between`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center">
              <span
                className={`absolute left-3 inline-block w-3 h-3 rounded-full ${colorMap[value]}`}
              ></span>
              <span>{selectedOption?.label}</span>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <select id={id} value={value} onChange={onChange} className="sr-only">
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`${
                    value === option.value ? "bg-gray-100" : ""
                  } cursor-pointer select-none relative py-2 pl-8 pr-4 hover:bg-gray-100`}
                  onClick={() => {
                    onChange({ target: { value: option.value } });
                    setIsOpen(false);
                  }}
                >
                  <span
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 inline-block w-3 h-3 rounded-full ${
                      colorMap[option.value]
                    }`}
                  ></span>
                  {option.label}
                </div>
              ))}
            </div>
          )}
          {errors[id] && (
            <p className="mt-1 text-sm text-red-600">{errors[id]}</p>
          )}
        </div>
      </div>
    );
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Task" : "Add New Task"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors({ ...errors, title: "" });
              }
            }}
            className={`w-full ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            placeholder="Enter task title"
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter task description"
            rows="3"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="grid grid-cols-1 gap-4">
            <CustomSelect
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
              options={statusOptions}
              required
            />

            <CustomSelect
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
              options={priorityOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (errors.dueDate) {
                      setErrors({ ...errors, dueDate: "" });
                    }
                  }}
                  className={`w-full ${
                    errors.dueDate ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-8`}
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
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
                </div>
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="dueTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="dueTime"
                  value={dueTime}
                  onChange={handleTimeChange}
                  className={`w-full ${
                    errors.dueTime ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-8`}
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
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
                </div>
              </div>
              {errors.dueTime && (
                <p className="mt-1 text-sm text-red-600">{errors.dueTime}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          {isEditMode && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditMode ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
