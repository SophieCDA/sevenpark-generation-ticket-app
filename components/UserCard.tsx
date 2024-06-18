import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import images from "@/constants/images";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface UserCardProps {
  user: {
    id_utilisateur: number;
    nom_utilisateur: string;
    as_date_validity: boolean;
    date_fin_validite: string;
    identifiant: string;
    date_creation: string;
    date_modification: string;
    avatar: string;
  };
  onDelete: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  const dateValidityString = user.as_date_validity ? "oui" : "non";

  const userInfoResponse = `
        Nom utilisateur : ${user.nom_utilisateur}\n
        Identifiant : ${user.identifiant}\n
        Date de validité : ${dateValidityString}\n
        Fin de validité : ${user.date_fin_validite}\n
        Date de création : ${user.date_creation} \n
        Date de modification : ${user.date_modification}
    `;

  const handleAlert = () => {
    Alert.alert("User Information", userInfoResponse);
  };

  const renderRightActions = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          backgroundColor: "red",
        }}
      >
        <Text style={{ color: "white" }}>Delete</Text>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => onDelete(user.id_utilisateur)}
    >
      <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
          <View className="justify-center items-center flex-row flex-1">
            <View
              className={`w-[46px] h-[46px] rounded-lg border border-secondary
                        flex justify-center items-center p-0.5`}
            >
              <Image
                source={{ uri: images.profile }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>

            <View className="justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="text-white font-psemibold text-sm"
                numberOfLines={1}
              >
                {user.nom_utilisateur}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                ID: {user.identifiant}
              </Text>
            </View>
          </View>

          <View className="pt-2">
            <TouchableOpacity onPress={handleAlert}>
              <Text className="text-sm text-blue-500">Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

export default UserCard;
