"use client";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TaskListScreen() {
  const {
    tasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    loadTasks,
    loading,
  } = useTaskStore();

  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !task.completed) ||
      (filter === "completed" && task.completed);

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const renderItem = useCallback(
    ({ item }: any) => <TaskItem task={item} />,
    []
  );

  const renderHeader = () => (
    <View className="mb-6">
      {/* Search Bar */}
      <View className="mb-4 flex-row items-center bg-gray-100 rounded-lg px-[5%] mx-[3%]">
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search tasks..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 ml-2 py-3 text-gray-900"
        />
      </View>

      {/* Filter & Sort */}
      <View className="px-[5%] mx-[3%] flex-row justify-between items-center mb-4">
        <View className="flex-row gap-2">
          {["all", "pending", "completed"].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg ${filter === f ? "bg-blue-600" : "bg-gray-200"}`}
            >
              <Text
                className={`font-medium capitalize ${filter === f ? "text-white" : "text-gray-700"}`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setSortBy(sortBy === "date" ? "priority" : "date")}
          className="bg-gray-200 px-3 py-2 rounded-lg"
        >
          <Ionicons
            name={sortBy === "date" ? "calendar" : "alert-circle"}
            size={18}
            color="#374151"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-12 px-[5%] mx-[3%]">
      <Ionicons name="checkbox-outline" size={48} color="#d1d5db" />
      <Text className="text-lg font-semibold text-gray-600 mt-4">
        No tasks found
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        {filter !== "all"
          ? `No ${filter} tasks`
          : "Create your first task to get started"}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1">
        {loading && (
          <View className="absolute inset-0 justify-center items-center bg-black/10 z-50">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        )}

        <FlatList
          data={sortedTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        {/* FAB */}
        <TouchableOpacity
          onPress={() => router.push("/create-task")}
          className="absolute bottom-6 right-6 bg-blue-600 rounded-full w-16 h-16 justify-center items-center shadow-lg"
          style={{ elevation: 5 }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
