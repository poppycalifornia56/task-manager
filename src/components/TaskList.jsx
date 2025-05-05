import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onDelete, loading }) => {
  if (loading && tasks.length === 0) {
    return <p className="text-center text-gray-500">Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No tasks found. Add a new task to get started!
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
