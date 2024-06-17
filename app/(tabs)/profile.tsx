import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { signOut } from "@/lib/flaskApi";

const Profile: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const signout = async () => {
    setIsSubmitting(true);
    try {
      await signOut();
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <CustomButton
            title="Déconnexion"
            handlePress={signout}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Profile;
