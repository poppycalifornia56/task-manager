import React, { useMemo } from "react";

const StatsSummary = ({ tasks }) => {
  const stats = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return {
        total: 0,
        completed: 0,
        overdue: 0,
        completionRate: 0,
      };
    }

    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((task) => {
      if (task.status === "completed" || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    }).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      overdue,
      completionRate,
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-indigo-50 rounded-lg p-4">
        <div className="text-xs font-medium text-indigo-700 uppercase tracking-wider">
          Total Tasks
        </div>
        <div className="mt-1 flex items-baseline">
          <div className="text-2xl font-bold text-indigo-800">
            {stats.total}
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-xs font-medium text-green-700 uppercase tracking-wider">
          Completed
        </div>
        <div className="mt-1 flex items-baseline">
          <div className="text-2xl font-bold text-green-800">
            {stats.completed}
          </div>
          <div className="ml-2 text-sm text-green-600">
            {stats.completionRate}%
          </div>
        </div>
      </div>

      <div
        className={`${
          stats.overdue > 0 ? "bg-red-50" : "bg-gray-50"
        } rounded-lg p-4 col-span-2`}
      >
        <div
          className={`text-xs font-medium ${
            stats.overdue > 0 ? "text-red-700" : "text-gray-700"
          } uppercase tracking-wider`}
        >
          Overdue
        </div>
        <div className="mt-1 flex items-baseline">
          <div
            className={`text-2xl font-bold ${
              stats.overdue > 0 ? "text-red-800" : "text-gray-800"
            }`}
          >
            {stats.overdue}
          </div>
          {stats.overdue > 0 && (
            <div className="ml-2 text-sm text-red-600">Need attention</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
