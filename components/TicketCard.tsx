import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface Ticket {
  id_ticket: number;
  id_parking: number;
  numero_ticket: string;
  num_plaque: string;
  nom: string;
  is_valid: boolean;
  supprimer: boolean;
}

interface Parking {
  id_parking: number;
  nom_parking: string;
}

interface TicketCardProps {
  ticket: Ticket;
  parkings: Parking[];
  onDelete: (id: number) => void;
  onShowQRCode: (num_ticket: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  parkings,
  onDelete,
  onShowQRCode,
}) => {
  const parking = parkings.find((p) => p.id_parking === ticket.id_parking);

  const renderRightActions = () => {
    return (
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          width: 80,
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
            <TouchableOpacity
              onPress={() => onShowQRCode(ticket.numero_ticket)}
            >
              <Text className="text-sm text-blue-500">Voir QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

export default TicketCard;
