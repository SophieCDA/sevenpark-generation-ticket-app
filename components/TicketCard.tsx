import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface TicketCardProps {
  ticket: {
    id_ticket: number;
    id_parking: number;
    numero_ticket: string;
    num_plaque: string;
    nom: string;
    is_valid: boolean;
    supprimer: boolean;
  };
  parkings: {
    id_parking: number;
    nom_parking: string;
  }[];
  onDelete: (id: number) => void;
  onEdit: (ticket: any) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  parkings,
  onDelete,
  onEdit,
}) => {
  const parking = parkings.find((p) => p.id_parking === ticket.id_parking);

  const ticketInfoResponse = `
    Numéro du ticket : ${ticket.numero_ticket}\n
    Plaque : ${ticket.num_plaque}\n
    Nom : ${ticket.nom}\n
    Valide : ${ticket.is_valid ? "Oui" : "Non"}\n
    Parking : ${parking ? parking.nom_parking : "Parking non trouvé"}
  `;

  const handleAlert = () => {
    Alert.alert("Informations du ticket", ticketInfoResponse);
  };

  const handleEdit = () => {
    onEdit(ticket); // Appeler la fonction de modification avec les données du ticket
  };

  const renderRightActions = () => {
    return (
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          width: 160,
          backgroundColor: "red",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 80,
            backgroundColor: "red",
          }}
          onPress={() => onDelete(ticket.id_ticket)}
        >
          <Text style={{ color: "white" }}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
          <View className="justify-center items-center flex-row flex-1">
            <View className="justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="text-white font-psemibold text-sm"
                numberOfLines={1}
              >
                {ticket.numero_ticket}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                Plaque: {ticket.num_plaque}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                Parking: {parking ? parking.nom_parking : "Parking non trouvé"}
              </Text>
            </View>
          </View>
          <View className="pt-2">
            <TouchableOpacity onPress={handleAlert}>
              <Text className="text-sm text-blue-500">Info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit}>
              <Text className="text-sm text-blue-500">Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

export default TicketCard;
