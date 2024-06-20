import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { updateTicket, getAllParkings } from "@/lib/flaskApi";

interface Form {
  numero_ticket: string;
  num_plaque: string;
  nom: string;
  is_valid: boolean;
  supprimer: boolean;
  id_parking: string;
}

interface Parking {
  id_parking: number;
  nom_parking: string;
}

interface UpdateTicketProps {
  id_ticket: string;
  ticket_data: any;
  onClose: () => void;
}

const UpdateTicket: React.FC<UpdateTicketProps> = ({
  id_ticket,
  ticket_data,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<Form | null>(null);
  const [parkings, setParkings] = useState<Parking[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkingsData = await getAllParkings();
        setParkings(parkingsData);

        if (ticket_data) {
          setForm({
            numero_ticket: ticket_data.numero_ticket || "",
            num_plaque: ticket_data.num_plaque || "",
            nom: ticket_data.nom || "",
            is_valid: ticket_data.is_valid || false,
            supprimer: ticket_data.supprimer || false,
            id_parking: ticket_data.id_parking.toString() || "",
          });
        }
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      }
    };

    fetchData();
  }, [ticket_data]);

  if (!form) {
    return null; // or display a loading spinner
  }

  const modifyTicket = async () => {
    setIsSubmitting(true);
    try {
      await updateTicket(id_ticket, form.is_valid, form.supprimer);
      Alert.alert("Succès", "Ticket modifié avec succès");
      onClose();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchChange = (field: keyof Form) => (value: boolean) => {
    setForm({ ...form!, [field]: value });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <FormField
            title="Numéro du ticket"
            placeholder="Numéro du ticket"
            value={form.numero_ticket}
            handleChangeText={(e) => setForm({ ...form!, numero_ticket: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Plaque"
            placeholder="Plaque"
            value={form.num_plaque}
            handleChangeText={(e) => setForm({ ...form!, num_plaque: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Nom"
            placeholder="Nom"
            value={form.nom}
            handleChangeText={(e) => setForm({ ...form!, nom: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Parking"
            placeholder="Sélectionnez un parking"
            value={form.id_parking}
            handleChangeText={(e) => setForm({ ...form!, id_parking: e })}
            isDropdown
            options={parkings.map((parking) => ({
              label: parking.nom_parking,
              value: parking.id_parking.toString(),
            }))}
            otherStyles="mt-7"
          />
          <View className="flex-row items-center mt-7">
            <Text className="text-white mr-2">Valide</Text>
            <Switch
              value={form.is_valid}
              onValueChange={handleSwitchChange("is_valid")}
            />
          </View>
          <View className="flex-row items-center mt-7">
            <Text className="text-white mr-2">Supprimer</Text>
            <Switch
              value={form.supprimer}
              onValueChange={handleSwitchChange("supprimer")}
            />
          </View>

          <CustomButton
            title="Modifier"
            handlePress={modifyTicket}
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

export default UpdateTicket;
