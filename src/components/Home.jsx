import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../App.css";

import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import TaskFilter from "./TaskFilter";
import Header from "./Header";
import Footer from "./Footer";

import {
  getTaskCountByStatus,
  applyFilters,
} from "../services/TaskFilterService";

const firebaseConfig = {
  apiKey: "AIzaSyC6ckv8X6wJjl6SvOJ_mdc1Tr3FhmHhytY",
  authDomain: "task-manager-dbe5b.firebaseapp.com",
  projectId: "task-manager-dbe5b",
  storageBucket: "task-manager-dbe5b.firebasestorage.app",
  messagingSenderId: "246347715981",
  appId: "1:246347715981:web:0f2e1769de22737b41d9c4",
  measurementId: "G-MM6D7S4VV1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksCollection = collection(db, "tasks");
      const taskSnapshot = await getDocs(tasksCollection);
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        priority: doc.data().priority || "medium",
      }));
      setTasks(taskList);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks: ", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (task) => {
    if (!task.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "tasks"), task);
      fetchTasks();
      setError("");
    } catch (err) {
      console.error("Error adding task: ", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (task) => {
    if (!task.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      const taskRef = doc(db, "tasks", currentTask.id);
      await updateDoc(taskRef, task);
      setEditMode(false);
      setCurrentTask(null);
      fetchTasks();
      setError("");
    } catch (err) {
      console.error("Error updating task: ", err);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "tasks", id));
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task: ", err);
        setError("Failed to delete task. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setCurrentTask(null);
    setEditMode(false);
  };

  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
  };

  const handlePriorityFilterChange = (filter) => {
    setPriorityFilter(filter);
  };

  const handleDueDateFilterChange = (filter) => {
    setDueDateFilter(filter);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTasks = applyFilters(tasks, {
    status: statusFilter,
    priority: priorityFilter,
    dueDate: dueDateFilter,
    searchTerm: searchTerm,
  });

  const taskCounts = getTaskCountByStatus(tasks);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {error && (
            <div
              className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          <section id="addTaskSection">
            <TaskForm
              addTask={handleAddTask}
              updateTask={handleUpdateTask}
              editTask={currentTask}
              isEditMode={editMode}
              cancelEdit={handleCancelEdit}
            />
          </section>

          <section
            id="yourTasksSection"
            className="bg-white rounded-lg shadow-md p-6 scroll-mt-20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Tasks</h2>
              <div className="w-64">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <TaskFilter
              onFilterChange={handleStatusFilterChange}
              currentFilter={statusFilter}
              onPriorityFilterChange={handlePriorityFilterChange}
              currentPriorityFilter={priorityFilter}
              onDueDateFilterChange={handleDueDateFilterChange}
              currentDueDateFilter={dueDateFilter}
              taskCounts={taskCounts}
            />

            <TaskList
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              loading={loading}
            />
          </section>
        </div>
      </div>
      <Footer githubUsername="poppycalifornia56" />
    </div>
  );
}

export default App;
