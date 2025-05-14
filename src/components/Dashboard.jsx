import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth, signOut } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  getTaskCountByStatus,
  filterTasksByStatus,
  filterTasksByPriority,
  filterTasksByDueDate,
  searchTasks,
} from "../services/TaskFilterService";

import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import TaskFilter from "./TaskFilter";
import Header from "./Header";
import Footer from "./Footer";
import ConfirmationDialog from "./ConfirmationDialog";
import AnalyticsPreview from "./analytics/components/AnalyticsPreview";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    pending: 0,
    "in-progress": 0,
    completed: 0,
    priorities: {
      all: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    dueDates: {
      all: 0,
      today: 0,
      week: 0,
      month: 0,
      overdue: 0,
      noDueDate: 0,
    },
  });

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const applyFilters = (tasks, filters) => {
    let filteredTasks = [...tasks];

    if (filters.status !== "all") {
      filteredTasks = filterTasksByStatus(filteredTasks, filters.status);
    }

    if (filters.priority !== "all") {
      filteredTasks = filterTasksByPriority(filteredTasks, filters.priority);
    }

    if (filters.dueDate !== "all") {
      filteredTasks = filterTasksByDueDate(filteredTasks, filters.dueDate);
    }

    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      filteredTasks = searchTasks(filteredTasks, filters.searchTerm);
    }

    return filteredTasks;
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setAnalyticsLoading(true);
      const tasksCollection = collection(db, "tasks");
      const q = query(tasksCollection, where("userId", "==", currentUser.uid));
      const taskSnapshot = await getDocs(q);
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        priority: doc.data().priority || "medium",
      }));
      setTasks(taskList);

      const counts = getTaskCountByStatus(taskList);
      setTaskCounts(counts);

      setError("");
      setAnalyticsLoading(false);
    } catch (err) {
      console.error("Error fetching tasks: ", err);
      setError("Failed to load tasks. Please try again.");
      setAnalyticsLoading(false);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser, fetchTasks]);

  const handleAddTask = async (task) => {
    if (!task.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      const newTask = {
        ...task,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, "tasks"), newTask);
      await fetchTasks();
      setError("");
      setSuccessMessage("Task added successfully!");
      setShowSuccessDialog(true);
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
      await fetchTasks();
      setError("");
      setSuccessMessage("Task updated successfully!");
      setShowSuccessDialog(true);
    } catch (err) {
      console.error("Error updating task: ", err);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initiateDeleteTask = (id) => {
    setTaskToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "tasks", taskToDelete));
      await fetchTasks();
      setShowDeleteDialog(false);
      setTaskToDelete(null);
      setSuccessMessage("Task deleted successfully!");
      setShowSuccessDialog(true);
    } catch (err) {
      console.error("Error deleting task: ", err);
      setError("Failed to delete task. Please try again.");
      setShowDeleteDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      setError("Failed to log out");
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setEditMode(true);

    const editFormSection = document.getElementById("addTaskSection");
    if (editFormSection) {
      window.scrollTo({
        top: editFormSection.offsetTop - 80,
        behavior: "smooth",
      });
    }
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Log Out
            </button>
          </div>

          {error && (
            <div
              className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Your Tasks</h2>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                </div>

                <TaskFilter
                  statusFilter={statusFilter}
                  priorityFilter={priorityFilter}
                  dueDateFilter={dueDateFilter}
                  onStatusFilterChange={handleStatusFilterChange}
                  onPriorityFilterChange={handlePriorityFilterChange}
                  onDueDateFilterChange={handleDueDateFilterChange}
                  taskCounts={taskCounts}
                />

                <div className="mt-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No tasks found. Add your first task above!</p>
                    </div>
                  ) : (
                    <TaskList
                      tasks={filteredTasks}
                      onEdit={handleEditTask}
                      onDelete={initiateDeleteTask}
                    />
                  )}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Task Summary</h2>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-semibold">
                      {taskCounts.completed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress:</span>
                    <span className="font-semibold">
                      {taskCounts["in-progress"]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-semibold">{taskCounts.pending}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span>Total:</span>
                    <span className="font-semibold">{taskCounts.all}</span>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Analytics Preview</h2>
                {analyticsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <AnalyticsPreview tasks={tasks} />
                )}
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/analytics")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    View Full Analytics
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <ConfirmationDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Success"
        message={successMessage}
        confirmLabel="OK"
        type="success"
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="delete"
      />
    </div>
  );
}

export default Dashboard;
