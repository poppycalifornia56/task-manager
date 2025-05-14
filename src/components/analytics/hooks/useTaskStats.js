import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../../../contexts/AuthContext";
import {
  processCompletionByDay,
  processTasksByCategory,
  calculateWeeklyCompletionRate,
  generateSummaryStats,
} from "../utils/chartDataHelpers";

/**
 * @returns {Object} 
 */
const useTaskStats = () => {
  const [taskStats, setTaskStats] = useState({
    completionByDay: [],
    tasksByCategory: [],
    completionRate: [],
    summary: {
      totalCompletedRecent: 0,
      mostProductiveDay: "N/A",
      averageCompletionRate: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTaskData = async () => {
      if (!currentUser?.uid) return;

      setIsLoading(true);
      setError(null);

      try {
        const db = getFirestore();
        const tasksRef = collection(db, "tasks");
        const userTasksQuery = query(
          tasksRef,
          where("userId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(userTasksQuery);
        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          completedAt: doc.data().completedAt?.toDate() || null,
        }));

        const completionByDay = processCompletionByDay(tasks);
        const tasksByCategory = processTasksByCategory(tasks);
        const completionRate = calculateWeeklyCompletionRate(tasks);

        const processedStats = {
          completionByDay,
          tasksByCategory,
          completionRate,
        };

        const summary = generateSummaryStats(processedStats);

        setTaskStats({
          ...processedStats,
          summary,
        });
      } catch (err) {
        console.error("Error fetching task data:", err);
        setError("Failed to load task statistics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskData();
  }, [currentUser]);

  return { taskStats, isLoading, error };
};

export default useTaskStats;
