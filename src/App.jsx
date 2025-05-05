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
import "./App.css";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksCollection = collection(db, "tasks");
      const taskSnapshot = await getDocs(tasksCollection);
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "tasks"), newTask);
      setNewTask({ title: "", description: "", status: "pending" });
      fetchTasks();
      setError("");
    } catch (err) {
      console.error("Error adding task: ", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      const taskRef = doc(db, "tasks", currentId);
      await updateDoc(taskRef, newTask);
      setNewTask({ title: "", description: "", status: "pending" });
      setEditMode(false);
      fetchTasks();
      setError("");
    } catch (err) {
      console.error("Error updating task: ", err);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
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

  const editTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setCurrentId(task.id);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setNewTask({ title: "", description: "", status: "pending" });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          <p className="text-gray-600">
            Keep track of your tasks with Firebase
          </p>
        </header>

        {error && (
          <div
            className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? "Edit Task" : "Add New Task"}
          </h2>
          <form onSubmit={editMode ? updateTask : addTask}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Task title"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Task description"
                rows="3"
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : editMode
                  ? "Update Task"
                  : "Add Task"}
              </button>

              {editMode && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

          {loading && !tasks.length ? (
            <p className="text-center text-gray-500">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-500">
              No tasks found. Add a new task to get started!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 ${
                    task.status === "completed"
                      ? "bg-green-50"
                      : task.status === "in-progress"
                      ? "bg-yellow-50"
                      : "bg-white"
                  }`}
                >
                  <h3 className="font-bold mb-2">{task.title}</h3>
                  <p className="text-gray-700 mb-2">{task.description}</p>
                  <div className="flex items-center mb-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : task.status === "in-progress"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => editTask(task)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
