import { useTaskStore } from "@/src/store/taskStore";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker"; // ✅ added
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Priority = "low" | "medium" | "high";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [showPicker, setShowPicker] = useState(false); // ✅ added

  const { addTask } = useTaskStore();

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    try {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        status: "pending",
      });

      alert("Task created successfully!");
      router.back();
    } catch (error) {
      alert("Failed to create task");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setDueDate(formatted);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1 px-[5%] mx-[3%]"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center py-4">
          <Text className="text-2xl font-bold text-gray-900">New Task</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Title
          </Text>
          <TextInput
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
            placeholderTextColor="#999"
          />
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Description
          </Text>
          <TextInput
            placeholder="Add task description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
            placeholderTextColor="#999"
            textAlignVertical="top"
          />
        </View>

        {/* Priority Selection */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Priority
          </Text>
          <View className="flex-row gap-3">
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                className={`flex-1 py-3 rounded-lg border-2 items-center ${
                  priority === p
                    ? "bg-blue-50 border-blue-600"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <Text
                  className={`font-semibold capitalize ${
                    priority === p ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ✅ Due Date Input with Calendar */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Due Date (Optional)
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <Ionicons name="calendar" size={20} color="#2563eb" />
              <Text className="ml-2 text-gray-900">
                {dueDate ? dueDate : "Select a due date"}
              </Text>
            </View>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={dueDate ? new Date(dueDate) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreate}
          className="bg-blue-600 rounded-lg py-4 items-center mb-6"
        >
          <Text className="text-white font-bold text-lg">Create Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
