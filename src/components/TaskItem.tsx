import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { Alert, Animated, Text, TouchableOpacity, View } from "react-native";
import { useTaskStore } from "../store/taskStore";
import type { Task } from "../types";
import { cn } from "../utils/cn";

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onImagePress?: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onImagePress,
}) => {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const scaleAnim = new Animated.Value(1);

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteTask(task.id) },
    ]);
  };

  const handleToggle = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    await toggleComplete(task.id);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        className={cn(
          "mx-[3%] px-[5%] py-4 mb-3 rounded-lg border flex-row items-center justify-between",
          task.status === "completed"
            ? "bg-gray-100 border-gray-200"
            : "bg-white border-blue-200"
        )}
      >
        <View className="flex-1">
          <Text
            className={cn(
              "text-base font-semibold",
              task.status === "completed" && "line-through text-gray-400"
            )}
          >
            {task.title}
          </Text>
          {task.description && (
            <Text className="text-sm text-gray-500 mt-1">
              {task.description}
            </Text>
          )}
          {task.tags && task.tags.length > 0 && (
            <View className="flex-row gap-1 mt-2">
              {task.tags.map((tag) => (
                <Text
                  key={tag}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  {tag}
                </Text>
              ))}
            </View>
          )}
          {task.dueDate && (
            <Text className="text-xs text-gray-400 mt-1">
              Due: {task.dueDate}
            </Text>
          )}
        </View>

        <View className="flex-row gap-2 ml-4">
          {task.imageUri && (
            <TouchableOpacity onPress={onImagePress} className="p-2">
              <Ionicons name="image" size={20} color="#3b82f6" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleToggle}
            className={cn(
              "p-2",
              task.status === "completed" ? "bg-green-100" : "bg-blue-100"
            )}
          >
            <Ionicons
              name={
                task.status === "completed" ? "checkmark-done" : "checkmark"
              }
              size={20}
              color={task.status === "completed" ? "#10b981" : "#3b82f6"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="p-2">
            <Ionicons name="trash" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
