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
import ConfirmationDialog from "./ConfirmationDialog";

import {
  getTaskCountByStatus,
  applyFilters,
} from "../services/TaskFilterService";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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
      const newTask = {
        ...task,
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
              <h2 className="text-xl font-semibold">My Tasks</h2>
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
              onDelete={initiateDeleteTask}
              loading={loading}
            />
          </section>
        </div>
      </div>
      <Footer githubUsername="poppycalifornia56" />

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

export default App;
