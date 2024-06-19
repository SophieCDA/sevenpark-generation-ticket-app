import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { updateSite } from "@/lib/flaskApi";

interface Form {
  nom_site: string;
  code_site: string;
  id_utilisateur: string;
}

interface UpdateSiteProps {
  id_site: string;
  site_data: any;
  onClose: () => void;
}

const UpdateSite: React.FC<UpdateSiteProps> = ({
  id_site,
  site_data,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    if (site_data) {
      setForm({
        nom_site: site_data.nom_site || "",
        code_site: site_data.code_site || "",
        id_utilisateur: site_data.id_utilisateur || "",
      });
    }
  }, [site_data]);

  if (!form) {
    return null; // ou afficher un spinner/loading
  }

  const modifySite = async () => {
    setIsSubmitting(true);
    try {
      await updateSite(
        id_site,
        form.nom_site,
        form.code_site,
        form.id_utilisateur
      );
      Alert.alert("Succès", "Site modifié avec succès");
      onClose();
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
            title="Modifier"
            handlePress={modifySite}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Annuler"
            handlePress={onClose}
            containerStyles="mt-7 bg-warn"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default UpdateSite;
