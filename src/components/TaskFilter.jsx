import React, { useState } from "react";

const TaskFilter = ({
  onFilterChange,
  currentFilter,
  onPriorityFilterChange,
  currentPriorityFilter,
  onDueDateFilterChange,
  currentDueDateFilter,
  taskCounts,
}) => {
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  const dueDateOptions = [
    { value: "all", label: "All Due Dates" },
    { value: "today", label: "Due Today" },
    { value: "week", label: "Due This Week" },
    { value: "month", label: "Due This Month" },
    { value: "overdue", label: "Overdue" },
  ];

  const statusColors = {
    pending: "bg-gray-500",
    "in-progress": "bg-yellow-500",
    completed: "bg-green-500",
    all: "bg-blue-600",
  };

  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-blue-500",
    high: "bg-yellow-500",
    critical: "bg-red-500",
    all: "bg-blue-600",
  };

  const CustomSelect = ({ value, options, onChange, label, colorMap }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = React.useRef(null);

    React.useEffect(() => {
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
    const getCountText = (option) => {
      if (option.value === "all") {
        if (label.includes("Priority")) return `(${taskCounts.priorities.all})`;
        if (label.includes("Due Date")) return `(${taskCounts.dueDates.all})`;
        return `(${taskCounts.all})`;
      } else {
        if (label.includes("Priority"))
          return `(${taskCounts.priorities[option.value] || 0})`;
        if (label.includes("Due Date"))
          return `(${taskCounts.dueDates[option.value] || 0})`;
        return `(${taskCounts[option.value] || 0})`;
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative" ref={selectRef}>
          <div
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-8 pr-10 py-2 bg-white cursor-pointer flex items-center justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center">
              <span
                className={`absolute left-3 inline-block w-3 h-3 rounded-full ${colorMap[value]}`}
              ></span>
              <span>
                {selectedOption?.label} {getCountText(selectedOption)}
              </span>
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

          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} {getCountText(option)}
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
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 inline-block w-3 h-3 rounded-full ${
                      colorMap[option.value]
                    }`}
                  ></span>
                  {option.label} {getCountText(option)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              currentFilter === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                statusColors[option.value]
              }`}
            ></span>
            {option.label}{" "}
            {option.value === "all"
              ? `(${taskCounts.all})`
              : `(${taskCounts[option.value] || 0})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          value={currentPriorityFilter}
          onChange={onPriorityFilterChange}
          label="Filter by Priority"
          options={priorityOptions}
          colorMap={priorityColors}
        />

        <CustomSelect
          value={currentDueDateFilter}
          onChange={onDueDateFilterChange}
          label="Filter by Due Date"
          options={dueDateOptions}
          colorMap={{
            all: "bg-blue-600",
            today: "bg-green-500",
            week: "bg-yellow-500",
            month: "bg-orange-500",
            overdue: "bg-red-500",
          }}
        />
      </div>
    </div>
  );
};

export default TaskFilter;
