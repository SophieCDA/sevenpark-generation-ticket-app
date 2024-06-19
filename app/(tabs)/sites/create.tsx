import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { addSite } from "@/lib/flaskApi";

interface Form {
  nom_site: string;
  code_site: string; 
  id_utilisateur: string; 
}

const CreateSite: React.FC = () => {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({
    nom_site: "",
    code_site: "",
    id_utilisateur: "",
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const validateForm = () => {
    if (!form.nom_site.trim()) {
      Alert.alert("Erreur", "Le nom du site est requis");
      return false;
    }
    if (!form.code_site.trim() || parseInt(form.code_site) <= 0) {
      Alert.alert(
        "Erreur",
        "Le code du site est requis et doit être supérieur à zéro"
      );
      return false;
    }
    if (!form.id_utilisateur.trim() || parseInt(form.id_utilisateur) <= 0) {
      Alert.alert(
        "Erreur",
        "L'ID utilisateur est requis et doit être supérieur à zéro"
      );
      return false;
    }
    return true;
  };

  const createSite = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addSite(
        form.nom_site,
        parseInt(form.code_site),
        parseInt(form.id_utilisateur)
      );
      Alert.alert("Succès", "Site ajouté avec succès");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumericChange = (field: keyof Form) => (value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <FormField
            title="Nom du site"
            placeholder="Nom du site"
            value={form.nom_site}
            handleChangeText={(e) => setForm({ ...form, nom_site: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Code du site"
            placeholder="Code du site"
            value={form.code_site}
            handleChangeText={handleNumericChange("code_site")}
            keyboardType="numeric"
            otherStyles="mt-7"
          />
          <FormField
            title="ID utilisateur"
            placeholder="ID utilisateur"
            value={form.id_utilisateur}
            handleChangeText={handleNumericChange("id_utilisateur")}
            keyboardType="numeric"
            otherStyles="mt-7"
          />
          <CustomButton
            title="Ajouter"
            handlePress={createSite}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default CreateSite;
