import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ScrollView, Alert, Switch, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { addTicket, getAllParkings, getTypesTickets } from "@/lib/flaskApi";

interface Form {
  numero_ticket: string;
  num_plaque: string;
  nom: string;
  prenom: string;
  is_valid: boolean;
  id_parking: string;
  type_ticket: string;
  code_option: string;
  debut_validite: string;
  fin_validite: string;
}

interface Parking {
  nom_parking: string;
  id_parking: number;
  ticket_autorise: TypeTicket[];
}

interface TypeTicket {
  id_type_ticket: number;
  libelle_ticket: string;
  code_option: string;
}

const CreateTicket: React.FC = () => {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialFormState: Form = {
    numero_ticket: "",
    num_plaque: "",
    nom: "",
    prenom: "",
    is_valid: false,
    id_parking: "",
    type_ticket: "",
    code_option: "",
    debut_validite: "",
    fin_validite: "",
  };
  const [form, setForm] = useState<Form>(initialFormState);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [typesTickets, setTypesTickets] = useState<TypeTicket[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkingsData = await getAllParkings();
        setParkings(parkingsData);
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      }
    };

    fetchData();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const validateForm = () => {
    if (!form.numero_ticket.trim()) {
      Alert.alert("Erreur", "Le numéro du ticket est requis");
      return false;
    }
    if (!form.num_plaque.trim()) {
      Alert.alert("Erreur", "Le numéro de plaque est requis");
      return false;
    }
    if (!form.nom.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return false;
    }
    if (!form.prenom.trim()) {
      Alert.alert("Erreur", "Le prénom est requis");
      return false;
    }
    if (!form.id_parking.trim()) {
      Alert.alert("Erreur", "Le parking est requis");
      return false;
    }
    if (!form.type_ticket.trim()) {
      Alert.alert("Erreur", "Le type de ticket est requis");
      return false;
    }
    return true;
  };

  const createTicket = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addTicket(
        parseInt(form.id_parking),
        form.numero_ticket,
        form.num_plaque,
        form.nom,
        form.prenom,
        form.is_valid,
        form.code_option,
        form.debut_validite,
        form.fin_validite
      );
      Alert.alert("Succès", "Ticket ajouté avec succès");
      handleClose();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParkingChange = (value: string) => {
    const selectedParking = parkings.find(
      (parking) => parking.nom_parking === value
    );
    if (selectedParking) {
      setForm((prevForm) => ({
        ...prevForm,
        id_parking: selectedParking.id_parking.toString(),
      }));
      setTypesTickets(selectedParking.ticket_autorise);
    }
  };

  const handleTypeTicketChange = (value: string) => {
    const selectedTicket = typesTickets.find(
      (ticket) => ticket.libelle_ticket === value
    );
    if (selectedTicket) {
      setForm((prevForm) => ({
        ...prevForm,
        type_ticket: selectedTicket.libelle_ticket,
        code_option: selectedTicket.code_option,
      }));
    }
  };

  const handleSwitchChange = (field: keyof Form) => (value: boolean) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setForm(initialFormState); // Réinitialise le formulaire
    router.push("/tickets");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <FormField
            title="Numéro du ticket"
            placeholder="Numéro du ticket"
            value={form.numero_ticket}
            handleChangeText={(e) => setForm({ ...form, numero_ticket: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Plaque"
            placeholder="Plaque"
            value={form.num_plaque}
            handleChangeText={(e) => setForm({ ...form, num_plaque: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Nom"
            placeholder="Nom"
            value={form.nom}
            handleChangeText={(e) => setForm({ ...form, nom: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Prenom"
            placeholder="Prenom"
            value={form.prenom}
            handleChangeText={(e) => setForm({ ...form, prenom: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Parking"
            placeholder="Sélectionnez un parking"
            value={
              parkings.find(
                (parking) => parking.id_parking.toString() === form.id_parking
              )?.nom_parking || ""
            }
            handleChangeText={handleParkingChange}
            isDropdown
            options={parkings.map((parking) => ({
              label: parking.nom_parking,
              value: parking.nom_parking,
            }))}
            otherStyles="mt-7"
          />
          <FormField
            title="Type de ticket"
            placeholder="Sélectionnez un type de ticket"
            value={
              typesTickets.find(
                (ticket) => ticket.libelle_ticket === form.type_ticket
              )?.libelle_ticket || ""
            }
            handleChangeText={handleTypeTicketChange}
            isDropdown
            options={typesTickets.map((ticket) => ({
              label: ticket.libelle_ticket,
              value: ticket.libelle_ticket,
            }))}
            otherStyles="mt-7"
          />
          <FormField
            title="Début validité"
            placeholder="YYYY-MM-DD"
            value={form.debut_validite}
            handleChangeText={(e) => setForm({ ...form, debut_validite: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Fin validité"
            placeholder="YYYY-MM-DD"
            value={form.fin_validite}
            handleChangeText={(e) => setForm({ ...form, fin_validite: e })}
            otherStyles="mt-7"
          />
          <View className="flex-row items-center mt-7">
            <Text className="text-white mr-2">Valide</Text>
            <Switch
              value={form.is_valid}
              onValueChange={handleSwitchChange("is_valid")}
            />
          </View>

          <CustomButton
            title="Ajouter"
            handlePress={createTicket}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Annuler"
            handlePress={handleClose}
            containerStyles="mt-7 bg-warn"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default CreateTicket;
