import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const CompletionRateChart = ({ tasks }) => {
  const data = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const inProgress = tasks.filter(
      (task) => task.status === "in-progress"
    ).length;
    const pending = tasks.filter((task) => task.status === "pending").length;

    return [
      { name: "Completed", value: completed, color: "#10B981" }, // green
      { name: "In Progress", value: inProgress, color: "#F59E0B" }, // yellow
      { name: "Pending", value: pending, color: "#6B7280" }, // gray
    ].filter((item) => item.value > 0);
  }, [tasks]);

  if (!data.length) {
    return (
      <div className="h-48 flex items-center justify-center">
        No data available
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} tasks`, null]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionRateChart;
