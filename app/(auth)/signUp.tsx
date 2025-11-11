import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signup = useAuthStore((state) => state.signup);

  const handleSignup = async () => {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-[5%]"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center mx-[3%]">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-lg text-gray-500">
              Sign up to get started
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <Text className="text-red-700 font-medium">{error}</Text>
            </View>
          )}

          {/* Name Input - ✅ Add this */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </Text>
            <TextInput
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              editable={!loading}
              autoCapitalize="words"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
              placeholderTextColor="#999"
            />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email
            </Text>
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
              placeholderTextColor="#999"
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Password
            </Text>
            <View className="border border-gray-300 rounded-lg px-4 flex-row items-center bg-white">
              <TextInput
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                secureTextEntry={!showPassword}
                className="flex-1 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#9CA3AF"
                  // style={{ paddingTop: 15 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </Text>
            <View className="border border-gray-300 rounded-lg px-4 flex-row items-center bg-white">
              <TextInput
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
                secureTextEntry={!showConfirmPassword}
                className="flex-1 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            className={`rounded-lg py-4 items-center mb-4 ${loading ? "bg-green-400" : "bg-green-600"}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-blue-600 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
