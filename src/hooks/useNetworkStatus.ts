import { useEffect, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useTaskStore } from "../store/taskStore";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const syncTasks = useTaskStore((state) => state.syncTasks);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = async (status: AppStateStatus) => {
    if (status === "active") {
      // Simulate network check - in production, use react-native-netinfo
      setIsOnline(true);
      await syncTasks();
    }
  };

  return { isOnline };
};
