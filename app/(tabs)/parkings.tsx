import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  FlatList,
  StatusBar,
  RefreshControl,
  Alert,
  Text,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllParkings, deleteParking, getAllSites } from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { router, useFocusEffect } from "expo-router";
import CustomButton from "@/components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchInput from "@/components/SearchInput"; // Importer SearchInput
import ParkingCard from "@/components/ParkingCard";
import UpdateParking from "@/components/UpdateParking";

interface Parking {
  id_parking: number;
  nom_parking: string;
  adresse_parking: string;
  code_postal_parking: string;
  code_parking: string;
  date_creation: string;
  date_modification: string;
  id_ville: number;
  id_site: number;
  ticket_autorise: [];
}

interface Site {
  id_site: number;
  nom_site: string;
}

const Parking = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [editParking, setEditParking] = useState<any>(null);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sitesData = await getAllSites();
        setSites(sitesData);

        let parkingsData;
        parkingsData = await getAllParkings();

        setParkings(parkingsData);
        setFilteredParkings(parkingsData);
      } catch (error) {
        console.log("Error", "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      const adminStatus = await AsyncStorage.getItem("is_admin");
      setIsAdmin(adminStatus === "1");
    };

    checkAdminStatus();
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetchParkings();
    }, [])
  );

  const refetchParkings = async () => {
    setRefreshing(true);
    try {
      let parkingsData;
      parkingsData = await getAllParkings();
      setParkings(parkingsData);
      setFilteredParkings(parkingsData);
    } catch (error) {
      console.log("Error", "Failed to refresh parkings");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteParking = async (id: number) => {
    try {
      await deleteParking(id);
      refetchParkings();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCloseModal = () => {
    setEditParking(null);
    refetchParkings();
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center px-4 my-6">
        <SearchInput
          initialQuery=""
          placeholder="Rechercher un parking"
          items={parkings}
          searchKey="nom_parking"
          onResultsChange={setFilteredParkings}
        />
      </View>

      <FlatList
        data={filteredParkings}
        keyExtractor={(item) => item.id_parking.toString()}
        renderItem={({ item }) => (
          <ParkingCard
            parking={item}
            site={sites}
            onDelete={handleDeleteParking}
            onEdit={(parking) => setEditParking(parking)}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState title="Aucun parking trouvé" subtitle="" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetchParkings} />
        }
      />
      <View className="w-full justify-center px-4 my-6">
        {isAdmin && (
          <CustomButton
            title="Ajouter un parking"
            handlePress={() => router.push("/parkings/create")}
            containerStyles="w-full my-5"
          />
        )}
      </View>
      <StatusBar backgroundColor="#161622" />
      <Modal visible={!!editParking} onRequestClose={handleCloseModal}>
        <UpdateParking
          id_parking={editParking?.id_parking}
          parking_data={editParking}
          onClose={handleCloseModal}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default Parking;
