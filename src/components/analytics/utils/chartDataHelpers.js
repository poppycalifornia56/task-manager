/**
 * @returns {Array} 
 */
export const generateLast7Days = () => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    result.push(date);
  }
  return result;
};

/**
 * @param {Array} tasks 
 * @returns {Array} 
 */
export const processCompletionByDay = (tasks) => {
  const last7Days = generateLast7Days();

  return last7Days.map((date) => {
    const dayStr = date.toISOString().split("T")[0];
    const completedTasks = tasks.filter(
      (task) =>
        task.completedAt &&
        task.completedAt.toISOString().split("T")[0] === dayStr
    ).length;

    return {
      day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      completed: completedTasks,
      date: dayStr,
    };
  });
};

/**
 * @param {Array} tasks
 * @returns {Array}
 */
export const processTasksByCategory = (tasks) => {
  const categories = {};

  tasks.forEach((task) => {
    const category = task.category || "Uncategorized";
    if (!categories[category]) {
      categories[category] = { total: 0, completed: 0 };
    }
    categories[category].total += 1;
    if (task.completed) {
      categories[category].completed += 1;
    }
  });

  return Object.keys(categories).map((category) => ({
    name: category,
    total: categories[category].total,
    completed: categories[category].completed,
  }));
};

/**
 * @param {Array} tasks 
 * @returns {Array} 
 */
export const calculateWeeklyCompletionRate = (tasks) => {
  const weeks = {};

  tasks.forEach((task) => {
    const createdAt = task.createdAt || new Date();

    const weekStart = new Date(createdAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = `${weekStart.getFullYear()}-${
      weekStart.getMonth() + 1
    }-${weekStart.getDate()}`;

    if (!weeks[weekKey]) {
      weeks[weekKey] = { total: 0, completed: 0, weekOf: new Date(weekStart) };
    }

    weeks[weekKey].total += 1;
    if (task.completed) {
      weeks[weekKey].completed += 1;
    }
  });

  return Object.keys(weeks)
    .map((week) => {
      const { total, completed, weekOf } = weeks[week];
      const completionRate =
        total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        week: `Week of ${weekOf.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`,
        rate: completionRate,
        total,
        completed,
      };
    })
    .sort(
      (a, b) =>
        new Date(a.week.split(" of ")[1]) - new Date(b.week.split(" of ")[1])
    )
    .slice(-6); 
};

/**
 * @param {Object} taskStats 
 * @returns {Object} 
 */
export const generateSummaryStats = (taskStats) => {
  const totalCompletedRecent = taskStats.completionByDay.reduce(
    (sum, day) => sum + day.completed,
    0
  );

  const mostProductiveDay =
    taskStats.completionByDay.length > 0
      ? taskStats.completionByDay.reduce(
          (max, day) => (day.completed > max.completed ? day : max),
          taskStats.completionByDay[0]
        ).day
      : "N/A";

  const averageCompletionRate =
    taskStats.completionRate.length > 0
      ? Math.round(
          taskStats.completionRate.reduce((sum, week) => sum + week.rate, 0) /
            taskStats.completionRate.length
        )
      : 0;

  return {
    totalCompletedRecent,
    mostProductiveDay,
    averageCompletionRate,
  };
};
