import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  FlatList,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllSites, deleteSite, getAllUsers } from "@/lib/flaskApi"; // Assurez-vous d'importer la fonction pour obtenir les utilisateurs
import EmptyState from "@/components/EmptyState";
import { router, useFocusEffect } from "expo-router";
import useFlaskApi from "@/hooks/useFlaskApi";
import CustomButton from "@/components/CustomButton";
import SiteCard from "@/components/SiteCard";

const Sites = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [editSite, setEditSite] = useState<any>(null);
  const { data: sites, isLoading, refetch } = useFlaskApi(getAllSites);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  const handleDeleteSite = async (id: number) => {
    try {
      await deleteSite(id);
      refetch();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCloseModal = () => {
    setEditSite(null);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={sites}
        keyExtractor={(item) => item.id_site.toString()}
        renderItem={({ item }) => (
          <SiteCard
            site={item}
            users={users} // Passer la liste des utilisateurs
            onDelete={handleDeleteSite}
            onEdit={(site) => setEditSite(site)}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Aucun site trouvé"
            subtitle="Vous pouvez créer un nouveau site"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View className="w-full justify-center px-4 my-6">
        <CustomButton
          title="Ajouter un site"
          handlePress={() => router.push("/(tabs)/create-user")}
          containerStyles="w-full my-5"
        />
      </View>
      <StatusBar backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default Sites;
