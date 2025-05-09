import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Header from "./Header";
import Footer from "./Footer";
import ConfirmationDialog from "./ConfirmationDialog";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // eslint-disable-next-line no-unused-vars
  const { currentUser, isAuthenticated } = useAuth();

  const fetchPublicTasks = async () => {
    try {
      setLoading(true);
      const tasksCollection = collection(db, "tasks");
      const taskSnapshot = await getDocs(tasksCollection);

      const taskList = taskSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          priority: doc.data().priority || "medium",
        }))
        .filter((task) => !task.userId);

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
    fetchPublicTasks();
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
      await fetchPublicTasks();
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

  const renderAuthenticationBanner = () => {
    if (!isAuthenticated) {
      return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You're viewing public tasks.
                <Link
                  to="/login"
                  className="font-medium underline text-blue-700 hover:text-blue-600 ml-1"
                >
                  Log in
                </Link>{" "}
                or
                <Link
                  to="/signup"
                  className="font-medium underline text-blue-700 hover:text-blue-600 ml-1"
                >
                  Sign up
                </Link>{" "}
                to create private tasks and use other features.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                You're logged in!
                <Link
                  to="/dashboard"
                  className="font-medium underline text-green-700 hover:text-green-600 ml-1"
                >
                  Go to your dashboard
                </Link>{" "}
                to view and manage your private tasks.
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to <span className="text-blue-600">Clearday</span>
            </h1>
            <p className="text-lg text-gray-600">
              The simple way to manage your tasks and stay productive
            </p>
          </div>

          {renderAuthenticationBanner()}

          {error && (
            <div
              className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          <section id="addTaskSection" className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Add a Public Task</h2>
              <p className="text-gray-600 mb-4">
                Tasks created here are public and visible to all users.
                {isAuthenticated &&
                  " For private tasks, please use your dashboard."}
              </p>
              <TaskForm addTask={handleAddTask} isEditMode={false} />
            </div>
          </section>

          <section
            id="yourTasksSection"
            className="bg-white rounded-lg shadow-md p-6 scroll-mt-20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Public Tasks</h2>
            </div>

            <TaskList tasks={tasks} loading={loading} showActions={false} />

            {tasks.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No public tasks available. Be the first to add one!
                </p>
              </div>
            )}
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
    </div>
  );
}

export default Home;
