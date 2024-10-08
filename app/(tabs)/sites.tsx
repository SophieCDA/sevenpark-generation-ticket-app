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
import {
  getAllSites,
  deleteSite,
  getAllUsers,
  getUserInfo,
} from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { router, useFocusEffect } from "expo-router";
import CustomButton from "@/components/CustomButton";
import SiteCard from "@/components/SiteCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchInput from "@/components/SearchInput";
import UpdateSite from "@/components/UpdateSite";

interface Site {
  id_site: number;
  nom_site: string;
  code_site: string;
  date_creation: string;
  date_modification: string;
  id_utilisateur: number;
}

interface User {
  id_utilisateur: number;
  nom_utilisateur: string;
}

const Sites = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [editSite, setEditSite] = useState<any>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [filteredSites, setFilteredSites] = useState<Site[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let usersData;
        if (isAdmin) {
          usersData = await getAllUsers();
          setUsers(usersData);
        } else {
          const currentUser = await getUserInfo();
          usersData = [currentUser];
          setUsers(usersData);
        }

        let sitesData;
        sitesData = await getAllSites();

        setSites(sitesData);
        setFilteredSites(sitesData);
      } catch (error: any) {
        Alert.alert("Error", error.message);
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
      let sitesData;
      sitesData = await getAllSites();
      setSites(sitesData);
      setFilteredSites(sitesData);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteSite = async (id: number) => {
    try {
      await deleteSite(id);
      refetchSites();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCloseModal = () => {
    setEditSite(null);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center px-4 my-6">
        <SearchInput
          initialQuery=""
          placeholder="Rechercher un site"
          items={sites}
          searchKey="nom_site"
          onResultsChange={setFilteredSites} // Mettre à jour les résultats filtrés
        />
      </View>

      <FlatList
        data={filteredSites}
        keyExtractor={(item) => item.id_site.toString()}
        renderItem={({ item }) => (
          <SiteCard
            site={item}
            users={users}
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
      <Modal visible={!!editSite} onRequestClose={handleCloseModal}>
        <UpdateSite
          id_site={editSite?.id_site}
          site_data={editSite}
          onClose={handleCloseModal}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default Sites;
