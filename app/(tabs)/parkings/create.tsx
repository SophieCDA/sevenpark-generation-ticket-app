import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ScrollView, Alert, Switch, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { addParking, getTypesTickets, getAllSites } from "@/lib/flaskApi";

interface Form {
  nom_parking: string;
  adresse_parking: string;
  code_postal_parking: string;
  code_parking: string;
  id_site: string;
  ticket_autorise: { id_type_ticket: number; autorise: boolean }[];
}

interface TypeTicket {
  id_type_ticket: number;
  libelle_ticket: string;
  code_option: string;
}

interface Site {
  id_site: number;
  nom_site: string;
}

const CreateParking: React.FC = () => {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({
    nom_parking: "",
    adresse_parking: "",
    code_postal_parking: "",
    code_parking: "",
    id_site: "",
    ticket_autorise: [],
  });
  const [typesTickets, setTypesTickets] = useState<TypeTicket[]>([]);
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsData, sitesData] = await Promise.all([
          getTypesTickets(),
          getAllSites(),
        ]);
        setTypesTickets(ticketsData);
        setSites(sitesData);
        setForm((prevForm) => ({
          ...prevForm,
          ticket_autorise: ticketsData.map((ticket: TypeTicket) => ({
            id_type_ticket: ticket.id_type_ticket,
            autorise: false,
          })),
        }));
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
    if (!form.nom_parking.trim()) {
      Alert.alert("Erreur", "Le nom du parking est requis");
      return false;
    }
    if (!form.adresse_parking.trim()) {
      Alert.alert("Erreur", "L'adresse du parking est requise");
      return false;
    }
    if (!form.code_postal_parking.trim()) {
      Alert.alert("Erreur", "Le code postal du parking est requis");
      return false;
    }
    if (!form.code_parking.trim()) {
      Alert.alert("Erreur", "Le code du parking est requis");
      return false;
    }
    if (!form.id_site.trim()) {
      Alert.alert("Erreur", "Le site est requis");
      return false;
    }
    return true;
  };

  const createParking = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(
        form.nom_parking,
        form.adresse_parking,
        form.code_postal_parking,
        form.code_parking,
        parseInt(form.id_site),
        form.ticket_autorise
      );
      await addParking(
        form.nom_parking,
        form.adresse_parking,
        form.code_postal_parking,
        form.code_parking,
        parseInt(form.id_site),
        form.ticket_autorise
      );
      Alert.alert("Succès", "Parking ajouté avec succès");
      router.push("parkings");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumericChange = (field: keyof Form) => (value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSwitchChange = (id_type_ticket: number) => (value: boolean) => {
    setForm((prevForm) => ({
      ...prevForm,
      ticket_autorise: prevForm.ticket_autorise.map((ticket) =>
        ticket.id_type_ticket === id_type_ticket
          ? { ...ticket, autorise: value }
          : ticket
      ),
    }));
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <FormField
            title="Nom du parking"
            placeholder="Nom du parking"
            value={form.nom_parking}
            handleChangeText={(e) => setForm({ ...form, nom_parking: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Adresse"
            placeholder="Adresse"
            value={form.adresse_parking}
            handleChangeText={(e) => setForm({ ...form, adresse_parking: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Code postal"
            placeholder="Code postal"
            value={form.code_postal_parking}
            handleChangeText={(e) =>
              setForm({ ...form, code_postal_parking: e })
            }
            otherStyles="mt-7"
          />
          <FormField
            title="Code parking"
            placeholder="Code parking"
            value={form.code_parking}
            handleChangeText={(e) => setForm({ ...form, code_parking: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Site"
            placeholder="Sélectionnez un site"
            value={form.id_site}
            handleChangeText={handleNumericChange("id_site")}
            isDropdown
            options={sites.map((site) => ({
              label: site.nom_site,
              value: site.id_site.toString(),
            }))}
            otherStyles="mt-7"
          />

          {typesTickets.map((ticket) => (
            <View
              key={ticket.id_type_ticket}
              className="flex-row items-center mt-7"
            >
              <Text className="text-white mr-2">{ticket.libelle_ticket}</Text>
              <Switch
                value={
                  form.ticket_autorise.find(
                    (t) => t.id_type_ticket === ticket.id_type_ticket
                  )?.autorise || false
                }
                onValueChange={handleSwitchChange(ticket.id_type_ticket)}
              />
            </View>
          ))}

          <CustomButton
            title="Ajouter"
            handlePress={createParking}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default CreateParking;
