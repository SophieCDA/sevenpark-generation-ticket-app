import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  View,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { getUserInfo, signOut, updatePassword } from "@/lib/flaskApi";
import FormField from "@/components/FormField";
import icons from "@/constants/icons";

interface Form {
  password: string;
}

const Profile: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Form>({
    password: "",
  });

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

  const updatePass = async () => {
    setIsSubmitting(true);
    try {
      await updatePassword(form.password);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <View className="bg-primary h-full">
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <FormField
            title="Identifiant"
            placeholder="Identifiant"
            value={userInfo?.identifiant}
            otherStyles="mt-7"
            isDisabled={true}
          />
          <FormField
            title="Nom utilisateur"
            placeholder="Mot de passe"
            value={userInfo?.nom_utilisateur}
            otherStyles="mt-7"
            isDisabled={true}
          />
          <FormField
            title="Clé API : fin de validité"
            placeholder="Clé API"
            value={new Date(userInfo?.date_fin_validite).toLocaleDateString()}
            otherStyles="mt-7"
            isDisabled={true}
          />
          <FormField
            title="Mot de passe"
            placeholder="Modifier mon mot de passe"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            isDisabled={false}
          />
          <CustomButton
            title="Modifier mon mot de passe"
            handlePress={updatePass}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <TouchableOpacity
            className="w-full items-center mb-10 mt-10"
            onPress={signout}
          >
            <Image
              source={icons.logout}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Profile;
