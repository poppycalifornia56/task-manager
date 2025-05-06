/**
 * @param {Array} tasks
 * @param {string} statusFilter
 * @returns {Array}
 */
export const filterTasksByStatus = (tasks, statusFilter) => {
  if (!statusFilter || statusFilter === "all") {
    return tasks;
  }
  return tasks.filter((task) => task.status === statusFilter);
};

/**
 * @param {Array} tasks
 * @param {string} priorityFilter
 * @returns {Array}
 */
export const filterTasksByPriority = (tasks, priorityFilter) => {
  if (!priorityFilter || priorityFilter === "all") {
    return tasks;
  }

  return tasks.filter((task) => task.priority === priorityFilter);
};

/**
 * @param {Array} tasks
 * @param {string} dueDateFilter 
 * @returns {Array}
 */
export const filterTasksByDueDate = (tasks, dueDateFilter) => {
  if (!dueDateFilter || dueDateFilter === "all") {
    return tasks;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);

  const monthFromNow = new Date(today);
  monthFromNow.setMonth(today.getMonth() + 1);

  return tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    switch (dueDateFilter) {
      case "today":
        return dueDate.getTime() === today.getTime();
      case "week":
        return dueDate >= today && dueDate <= weekFromNow;
      case "month":
        return dueDate >= today && dueDate <= monthFromNow;
      case "overdue":
        return dueDate < today;
      default:
        return true;
    }
  });
};

/**
 * @param {Array} tasks
 * @returns {Object}
 */
export const getTaskCountByStatus = (tasks) => {
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
    if (counts.hasOwnProperty(task.status)) {
      counts[task.status]++;
    }

    const priority = task.priority || "medium";
    if (counts.priorities.hasOwnProperty(priority)) {
      counts.priorities[priority]++;
    }

    if (task.dueDate) {
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
    } else {
      counts.dueDates.noDueDate++;
    }
  });

  return counts;
};

/**
 * @param {Array} tasks
 * @param {Object} filters
 * @param {string} filters.status
 * @param {string} filters.priority
 * @param {string} filters.dueDate
 * @param {string} filters.searchTerm
 * @returns {Array}
 */
export const applyFilters = (tasks, filters = {}) => {
  let filteredTasks = [...tasks];

  if (filters.status && filters.status !== "all") {
    filteredTasks = filteredTasks.filter(
      (task) => task.status === filters.status
    );
  }

  if (filters.priority && filters.priority !== "all") {
    filteredTasks = filteredTasks.filter((task) => {
      const taskPriority = task.priority || "medium";
      return taskPriority === filters.priority;
    });
  }

  if (filters.dueDate && filters.dueDate !== "all") {
    filteredTasks = filterTasksByDueDate(filteredTasks, filters.dueDate);
  }

  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm))
    );
  }

  return filteredTasks;
};
