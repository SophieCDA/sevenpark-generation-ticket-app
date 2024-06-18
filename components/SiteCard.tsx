import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface SiteCardProps {
  site: {
    id_site: number;
    nom_site: string;
    code_site: string;
    date_creation: string;
    date_modification: string;
    id_utilisateur: number;
  };
  users: {
    id_utilisateur: number;
    nom_utilisateur: string;
  }[];
  onDelete: (id: number) => void;
  onEdit: (site: any) => void;
}

const SiteCard: React.FC<SiteCardProps> = ({
  site,
  users,
  onDelete,
  onEdit,
}) => {
  const user = users.find((u) => u.id_utilisateur === site.id_utilisateur);

  const siteInfoResponse = `
    Nom du site : ${site.nom_site}\n
    Code du site : ${site.code_site}\n
    Date de création : ${site.date_creation}\n
    Date de modification : ${site.date_modification}\n
    Nom de l'utilisateur : ${
      user ? user.nom_utilisateur : "Utilisateur non trouvé"
    }
  `;

  const handleAlert = () => {
    Alert.alert("Informations du site", siteInfoResponse);
  };

  const handleEdit = () => {
    onEdit(site); // Appeler la fonction de modification avec les données du site
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
          onPress={() => onDelete(site.id_site)}
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
                {site.nom_site}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                Code: {site.code_site}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                Utilisateur:{" "}
                {user ? user.nom_utilisateur : "Utilisateur non trouvé"}
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
