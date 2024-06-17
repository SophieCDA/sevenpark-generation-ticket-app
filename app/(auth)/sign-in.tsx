import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "@/components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { signIn } from "../../lib/flaskApi";

interface Form {
  identifiant: string;
  password: string;
  api_key: string;
}

const SignIn: React.FC = () => {
  const [form, setForm] = useState<Form>({
    identifiant: "",
    password: "",
    api_key: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submit = async () => {
    if (!form.identifiant || !form.password || !form.api_key) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await signIn(form.identifiant, form.password, form.api_key);

      // const result = await getCurrentUser();
      // setUser(result);
      // setIsLogged(true);

      router.replace("/home");
      Alert.alert("Connexion réussie");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Log in to Aora
          </Text>
          <FormField
            title="Identifiant"
            placeholder="Identifiant"
            value={form.identifiant}
            handleChangeText={(e) => setForm({ ...form, identifiant: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Mot de passe"
            placeholder="Mot de passe"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Clé API"
            placeholder="Clé API"
            value={form.api_key}
            handleChangeText={(e) => setForm({ ...form, api_key: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            // isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
