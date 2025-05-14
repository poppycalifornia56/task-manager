import React from "react";
import DailyChart from "./DailyChart";
import CompletionRateChart from "./CompletionRateChart";
import StatsSummary from "./StatsSummary";
import ProgressVisualization from "./ProgressVisualization";

const AnalyticsPreview = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded">
        <p className="text-gray-500">Add tasks to see your analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsSummary tasks={tasks} />
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Completion Rate
        </h3>
        <CompletionRateChart tasks={tasks} />
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Daily Tasks</h3>
        <DailyChart tasks={tasks} />
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Weekly Progress
        </h3>
        <ProgressVisualization tasks={tasks} />
      </div>
    </div>
  );
};

export default AnalyticsPreview;
