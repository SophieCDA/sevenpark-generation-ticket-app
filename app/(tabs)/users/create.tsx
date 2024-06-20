import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { addUser } from "@/lib/flaskApi";

interface Form {
  nom_utilisateur: string;
  as_date_validity: boolean;
  date_fin_validite: string;
  api_key: string;
  identifiant: string;
  password: string;
  is_admin: boolean;
}

const CreateUser: React.FC = () => {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({
    nom_utilisateur: "",
    as_date_validity: false,
    date_fin_validite: "",
    api_key: "",
    identifiant: "",
    password: "",
    is_admin: false,
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const validateForm = () => {
    if (!form.nom_utilisateur.trim()) {
      Alert.alert("Erreur", "Le nom d'utilisateur est requis");
      return false;
    }
    if (!form.identifiant.trim()) {
      Alert.alert("Erreur", "L'identifiant est requis");
      return false;
    }
    if (!form.password.trim()) {
      Alert.alert("Erreur", "Le mot de passe est requis");
      return false;
    }
    if (!form.api_key.trim()) {
      Alert.alert("Erreur", "La clé API est requise");
      return false;
    }
    if (form.as_date_validity && !form.date_fin_validite.trim()) {
      Alert.alert("Erreur", "La date de fin de validité est requise");
      return false;
    }
    return true;
  };

  const createUser = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addUser(
        form.nom_utilisateur,
        form.identifiant,
        form.password,
        form.api_key,
        form.is_admin,
        form.as_date_validity,
        form.date_fin_validite
      );
      Alert.alert("Succès", "Utilisateur ajouté avec succès");
      router.push("users");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <FormField
            title="Nom utilisateur"
            placeholder="Nom utilisateur"
            value={form.nom_utilisateur}
            handleChangeText={(e) => setForm({ ...form, nom_utilisateur: e })}
            otherStyles="mt-7"
          />
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
            title="API Key"
            placeholder="API Key"
            value={form.api_key}
            handleChangeText={(e) => setForm({ ...form, api_key: e })}
            otherStyles="mt-7"
          />
          <View className="flex-row items-center mt-7">
            <Text className="text-white mr-2">Admin</Text>
            <Switch
              value={form.is_admin}
              onValueChange={(value) => setForm({ ...form, is_admin: value })}
            />
          </View>
          <View className="flex-row items-center mt-7">
            <Text className="text-white mr-2">Date de validité</Text>
            <Switch
              value={form.as_date_validity}
              onValueChange={(value) =>
                setForm({ ...form, as_date_validity: value })
              }
            />
          </View>
          {form.as_date_validity && (
            <FormField
              title="Date de fin de validité"
              placeholder="AAAA-MM-JJ"
              value={form.date_fin_validite}
              handleChangeText={(e) =>
                setForm({ ...form, date_fin_validite: e })
              }
              otherStyles="mt-7"
            />
          )}
          <CustomButton
            title="Ajouter"
            handlePress={createUser}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default CreateUser;
