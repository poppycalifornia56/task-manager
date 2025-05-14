import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DailyChart = ({ tasks }) => {
  const data = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const dueTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = task.dueDate.split("T")[0];
        return taskDate === dateStr;
      }).length;

      const completedTasks = tasks.filter((task) => {
        if (task.status !== "completed") return false;
        if (!task.dueDate) return false;
        const taskDate = task.dueDate.split("T")[0];
        return taskDate === dateStr;
      }).length;

      return {
        name: dayName,
        due: dueTasks,
        completed: completedTasks,
      };
    });
  }, [tasks]);

  if (data.every((day) => day.due === 0 && day.completed === 0)) {
    return (
      <div className="h-48 flex items-center justify-center">
        No task data for the last 7 days
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="due" name="Due" fill="#6366F1" barSize={8} />
          <Bar
            dataKey="completed"
            name="Completed"
            fill="#10B981"
            barSize={8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyChart;
