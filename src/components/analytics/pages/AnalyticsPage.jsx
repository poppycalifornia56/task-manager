import React from "react";
import Header from "../../Header";
import ProgressVisualization from "../components/ProgressVisualization";

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Task Analytics</h1>

        <div className="grid gap-6">
          <ProgressVisualization />

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Productivity Insights</h2>
            <p className="text-gray-600 mb-4">
              Track your task completion patterns and identify trends to
              optimize your productivity. The charts above provide
              visualizations of your task management habits.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
              <h3 className="font-medium text-blue-800 mb-2">Pro Tip</h3>
              <p className="text-sm text-blue-700">
                Try categorizing your tasks consistently to get more meaningful
                insights from the category breakdown chart.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
