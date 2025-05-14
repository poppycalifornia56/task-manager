import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProgressVisualization = ({ tasks }) => {
  const data = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const today = new Date();
    const currentDay = today.getDay(); 
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const completedCount = tasks.filter((task) => {
        if (task.status !== "completed") return false;

        if (task.completedAt) {
          const completedDate = new Date(task.completedAt)
            .toISOString()
            .split("T")[0];
          return completedDate === dateStr;
        } else if (task.dueDate) {
          const dueDate = task.dueDate.split("T")[0];
          return dueDate === dateStr;
        }

        return false;
      }).length;

      return {
        name: dayName,
        completed: completedCount,
        date: dateStr,
        isPast: date <= today,
      };
    });

    let cumulativeCompleted = 0;
    weekData.forEach((day) => {
      cumulativeCompleted += day.completed;
      day.cumulativeCompleted = cumulativeCompleted;
    });

    return weekData;
  }, [tasks]);

  const visibleData = data.filter((day) => day.isPast);

  if (
    visibleData.length === 0 ||
    visibleData.every((day) => day.completed === 0)
  ) {
    return (
      <div className="h-48 flex items-center justify-center">
        No completion data available
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={visibleData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} tasks`, null]} />
          <Line
            type="monotone"
            dataKey="cumulativeCompleted"
            name="Completed Tasks"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressVisualization;
