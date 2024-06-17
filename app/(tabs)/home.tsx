import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import images from "@/constants/images";

const Home: React.FC = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState<string | null>(null);

  useEffect(() => {
    const fetchNomUtilisateur = async () => {
      const nom = await AsyncStorage.getItem("nom_utilisateur");
      setNomUtilisateur(nom);
    };

    fetchNomUtilisateur();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            className="w-[330px] h-[104px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Application{"\n"}
              <Text className="text-secondary-200">Génération tickets</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          {nomUtilisateur && (
            <View className="mt-5">
              <Text className="text-xl text-white font-bold">
                Bienvenue, {nomUtilisateur}!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Home;
