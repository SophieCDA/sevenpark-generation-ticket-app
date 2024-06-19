import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface ParkingCardProps {
  parking: {
    id_parking: number;
    nom_parking: string;
    adresse_parking: string;
    code_postal_parking: string;
    code_parking: number;
    date_creation: string;
    date_modification: string;
    id_ville: number;
    id_site: number;
  };
  onDelete: (id: number) => void;
  onEdit: (site: any) => void;
}

const SiteCard: React.FC<ParkingCardProps> = ({
  parking,
  onDelete,
  onEdit,
}) => {
  const siteInfoResponse = `
    Nom du parking : ${parking.nom_parking}\n
    Code du parking : ${parking.code_parking}\n
    Date de création : ${parking.date_creation}\n
    Date de modification : ${parking.date_modification}\n
  `;

  const handleAlert = () => {
    Alert.alert("Informations du site", siteInfoResponse);
  };

  const handleEdit = () => {
    onEdit(parking); // Appeler la fonction de modification avec les données du site
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
          onPress={() => onDelete(parking.id_parking)}
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
            <View
              className={`w-[46px] h-[46px] rounded-lg border border-secondary
                    flex justify-center items-center p-0.5`}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/46" }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>

            <View className="justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="text-white font-psemibold text-sm"
                numberOfLines={1}
              >
                {parking.nom_parking}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                Code: {parking.code_parking}
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

export default SiteCard;
