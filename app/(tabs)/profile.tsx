import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-[5%] mx-[3%] py-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-blue-600 rounded-full justify-center items-center mb-4">
            <Ionicons name="person" size={40} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.email?.split("@")[0] || "User"}
          </Text>
          <Text className="text-gray-500 mt-1">{user?.email}</Text>
        </View>

        {/* Account Settings */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Account Settings
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <View className="flex-row items-center">
              <Ionicons name="notifications" size={20} color="#2563eb" />
              <Text className="text-gray-900 font-medium ml-3">
                Notifications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="settings" size={20} color="#2563eb" />
              <Text className="text-gray-900 font-medium ml-3">Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 rounded-lg py-4 items-center"
        >
          <Text className="text-white font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
