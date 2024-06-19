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
import { getAllParkings, deleteParking } from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { router, useFocusEffect } from "expo-router";
import CustomButton from "@/components/CustomButton";
import SiteCard from "@/components/SiteCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchInput from "@/components/SearchInput"; // Importer SearchInput
import UpdateSite from "@/components/UpdateSite";
import ParkingCard from "@/components/ParkingCard";

interface Parking {
  id_parking: number;
  nom_parking: string;
  adresse_parking: string;
  code_postal_parking: string;
  code_parking: number;
  date_creation: string;
  date_modification: string;
  id_ville: number;
  id_site: number;
}

const Parking = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [editParking, setEditParking] = useState<any>(null);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let parkingsData;
        parkingsData = await getAllParkings();
        setParkings(parkingsData);
        setFilteredParkings(parkingsData);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data");
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
      refetchSites();
    }, [])
  );

  const refetchSites = async () => {
    setRefreshing(true);
    try {
      let parkingsData;
      parkingsData = await getAllParkings();
      setParkings(parkingsData);
      setFilteredParkings(parkingsData);
    } catch (error) {
      Alert.alert("Error", "Failed to refresh sites");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteSite = async (id: number) => {
    try {
      await deleteParking(id);
      refetchSites();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

//   const handleCloseModal = () => {
//     setEditSite(null);
//   };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center px-4 my-6">
        <SearchInput
          initialQuery=""
          placeholder="Rechercher un site"
          items={parkings}
          searchKey="nom_parking"
          onResultsChange={setFilteredParkings} // Mettre à jour les résultats filtrés
        />
      </View>

      <FlatList
        data={filteredParkings}
        keyExtractor={(item) => item.id_parking.toString()}
        renderItem={({ item }) => (
          <ParkingCard
            parking={item}
            onDelete={handleDeleteSite}
            onEdit={(parking) => setEditParking(parking)}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Aucun site trouvé"
            subtitle="Vous pouvez créer un nouveau site"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetchSites} />
        }
      />
      <View className="w-full justify-center px-4 my-6">
        {isAdmin && (
          <CustomButton
            title="Ajouter un site"
            handlePress={() => router.push("/sites/create")}
            containerStyles="w-full my-5"
          />
        )}
      </View>
      <StatusBar backgroundColor="#161622" />
      {/* <Modal visible={!!editSite} onRequestClose={handleCloseModal}>
        <UpdateSite
          id_site={editSite?.id_site}
          site_data={editSite}
          onClose={handleCloseModal}
        />
      </Modal> */}
    </SafeAreaView>
  );
};

export default Parking;
