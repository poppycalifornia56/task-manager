/**
 * @param {Array} tasks
 * @returns {Object}
 */
export const getTaskCountByStatus = (tasks) => {
  const defaultCounts = {
    all: 0,
    pending: 0,
    "in-progress": 0,
    completed: 0,
    priorities: {
      all: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    dueDates: {
      all: 0,
      today: 0,
      week: 0,
      month: 0,
      overdue: 0,
      noDueDate: 0,
    },
  };

  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return defaultCounts;
  }

  const counts = {
    all: tasks.length,
    pending: 0,
    "in-progress": 0,
    completed: 0,
    priorities: {
      all: tasks.length,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    dueDates: {
      all: tasks.length,
      today: 0,
      week: 0,
      month: 0,
      overdue: 0,
      noDueDate: 0,
    },
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);

  const monthFromNow = new Date(today);
  monthFromNow.setMonth(today.getMonth() + 1);

  tasks.forEach((task) => {
    if (!task) return;

    if (task.status && counts.hasOwnProperty(task.status.toLowerCase())) {
      counts[task.status.toLowerCase()]++;
    }

    const priority = task.priority?.toLowerCase() || "medium";
    if (counts.priorities.hasOwnProperty(priority)) {
      counts.priorities[priority]++;
    }

    if (!task.dueDate) {
      counts.dueDates.noDueDate++;
    } else {
      try {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() === today.getTime()) {
          counts.dueDates.today++;
        }

        if (dueDate >= today && dueDate <= weekFromNow) {
          counts.dueDates.week++;
        }

        if (dueDate >= today && dueDate <= monthFromNow) {
          counts.dueDates.month++;
        }

        if (dueDate < today) {
          counts.dueDates.overdue++;
        }
      } catch (error) {
        counts.dueDates.noDueDate++;
      }
    }
  });

  return counts;
};

/**
 * @param {Array} tasks
 * @param {string} statusFilter
 * @returns {Array}
 */
export const filterTasksByStatus = (tasks, statusFilter) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  if (!statusFilter || statusFilter === "all") {
    return tasks;
  }

  return tasks.filter((task) => {
    if (!task) return false;
    return (
      task.status && task.status.toLowerCase() === statusFilter.toLowerCase()
    );
  });
};

/**
 * @param {Array} tasks
 * @param {string} priorityFilter
 * @returns {Array}
 */
export const filterTasksByPriority = (tasks, priorityFilter) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  if (!priorityFilter || priorityFilter === "all") {
    return tasks;
  }

  return tasks.filter((task) => {
    if (!task) return false;
    // Use task.priority || "medium" to handle undefined priority
    const taskPriority = task.priority || "medium";
    return taskPriority.toLowerCase() === priorityFilter.toLowerCase();
  });
};

/**
 * @param {Array} tasks
 * @param {string} dueDateFilter
 * @returns {Array}
 */
export const filterTasksByDueDate = (tasks, dueDateFilter) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  if (!dueDateFilter || dueDateFilter === "all") {
    return tasks;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);

  const monthFromNow = new Date(today);
  monthFromNow.setMonth(today.getMonth() + 1);

  const normalizedFilter = dueDateFilter.toLowerCase();

  const filterMap = {
    "this-week": "week",
    "this-month": "month",
    "no-date": "noDueDate",
  };

  const standardFilter = filterMap[normalizedFilter] || normalizedFilter;

  return tasks.filter((task) => {
    if (!task) return false;

    if (standardFilter === "noDueDate") {
      return !task.dueDate;
    }

    if (!task.dueDate) return false;

    try {
      const dueDate =
        task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);

      if (isNaN(dueDate.getTime())) return false;

      const dueDateOnly = new Date(dueDate);
      dueDateOnly.setHours(0, 0, 0, 0);

      switch (standardFilter) {
        case "today":
          return dueDateOnly.getTime() === today.getTime();
        case "week":
          return dueDateOnly >= today && dueDateOnly <= weekFromNow;
        case "month":
          return dueDateOnly >= today && dueDateOnly <= monthFromNow;
        case "overdue":
          return dueDateOnly < today;
        default:
          return true;
      }
    } catch (error) {
      return false;
    }
  });
};

/**
 * @param {Array} tasks
 * @param {string} searchTerm
 * @returns {Array}
 */
export const searchTasks = (tasks, searchTerm) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  if (!searchTerm || searchTerm.trim() === "") {
    return tasks;
  }

  const term = searchTerm.toLowerCase().trim();

  return tasks.filter((task) => {
    if (!task) return false;

    const title = (task.title || "").toLowerCase();
    const description = (task.description || "").toLowerCase();

    return title.includes(term) || description.includes(term);
  });
};

/**
 * @param {Array} tasks
 * @param {string} groupBy
 * @returns {Object}
 */
export const groupTasks = (tasks, groupBy = "status") => {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return {};
  }

  const grouped = {};

  tasks.forEach((task) => {
    if (!task) return;

    let groupKey;

    switch (groupBy) {
      case "status":
        groupKey = task.status || "no-status";
        break;

      case "priority":
        groupKey = task.priority || "medium";
        break;

      case "dueDate":
        if (!task.dueDate) {
          groupKey = "no-date";
        } else {
          try {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);

            if (dueDate < today) {
              groupKey = "overdue";
            } else if (dueDate.getTime() === today.getTime()) {
              groupKey = "today";
            } else if (dueDate < tomorrow) {
              groupKey = "tomorrow";
            } else if (dueDate <= weekFromNow) {
              groupKey = "this-week";
            } else {
              groupKey = "future";
            }
          } catch (error) {
            groupKey = "invalid-date";
          }
        }
        break;

      default:
        groupKey = "default";
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }

    grouped[groupKey].push(task);
  });

  return grouped;
};

/**
 * @param {Array} tasks
 * @param {string} sortBy
 * @param {string} sortOrder
 * @returns {Array}
 */
export const sortTasks = (tasks, sortBy = "dueDate", sortOrder = "asc") => {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return [];
  }

  const sortedTasks = [...tasks];

  const priorityValues = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  const statusValues = {
    pending: 1,
    "in-progress": 2,
    completed: 3,
  };

  sortedTasks.sort((a, b) => {
    if (!a || !b) return 0;

    let valueA, valueB;

    switch (sortBy) {
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return sortOrder === "asc" ? 1 : -1;
        if (!b.dueDate) return sortOrder === "asc" ? -1 : 1;

        valueA = new Date(a.dueDate).getTime();
        valueB = new Date(b.dueDate).getTime();
        break;

      case "priority":
        valueA = priorityValues[a.priority?.toLowerCase() || "medium"];
        valueB = priorityValues[b.priority?.toLowerCase() || "medium"];
        break;

      case "status":
        valueA = statusValues[a.status?.toLowerCase()] || 0;
        valueB = statusValues[b.status?.toLowerCase()] || 0;
        break;

      case "title":
        valueA = (a.title || "").toLowerCase();
        valueB = (b.title || "").toLowerCase();
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);

      case "createdAt":
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return sortOrder === "asc" ? 1 : -1;
        if (!b.createdAt) return sortOrder === "asc" ? -1 : 1;

        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;

      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  return sortedTasks;
};

/**
 * @param {Array} tasks
 * @param {Object} filters
 * @returns {Array}
 */
export const applyFilters = (tasks, filters = {}) => {
  if (!tasks || !Array.isArray(tasks)) return [];

  let filteredTasks = [...tasks];

  if (filters.status && filters.status !== "all") {
    filteredTasks = filterTasksByStatus(filteredTasks, filters.status);
  }

  if (filters.priority && filters.priority !== "all") {
    filteredTasks = filterTasksByPriority(filteredTasks, filters.priority);
  }

  if (filters.dueDate && filters.dueDate !== "all") {
    filteredTasks = filterTasksByDueDate(filteredTasks, filters.dueDate);
  }

  if (filters.searchTerm && filters.searchTerm.trim() !== "") {
    filteredTasks = searchTasks(filteredTasks, filters.searchTerm);
  }

  return filteredTasks;
};

/**
 *
 * @param {Array} tasks
 * @param {Object} filters
 * @param {string} filters.status
 * @param {string} filters.priority
 * @param {string} filters.dueDate
 * @param {string} filters.searchTerm
 * @param {string} filters.sortBy
 * @param {string} filters.sortOrder
 * @returns {Array}
 */
export const applyAllFilters = (tasks, filters = {}) => {
  if (!tasks || !Array.isArray(tasks)) return [];

  const { status, priority, dueDate, searchTerm, sortBy, sortOrder } = filters;

  let filteredTasks = applyFilters(tasks, {
    status,
    priority,
    dueDate,
    searchTerm,
  });

  if (sortBy) {
    filteredTasks = sortTasks(filteredTasks, sortBy, sortOrder || "asc");
  }

  return filteredTasks;
};
