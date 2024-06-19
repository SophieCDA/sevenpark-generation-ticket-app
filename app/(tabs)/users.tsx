import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllUsers, deleteUser, getCurrentUser } from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { router, useFocusEffect } from "expo-router";
import UserCard from "@/components/UserCard";
import CustomButton from "@/components/CustomButton";
import UpdateUser from "@/components/UpdateUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchInput from "@/components/SearchInput";

interface User {
  id_utilisateur: number;
  nom_utilisateur: string;
  as_date_validity: boolean;
  date_fin_validite: string;
  identifiant: string;
  date_creation: string;
  date_modification: string;
}

const Users = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
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
      refetchUsers();
    }, [])
  );

  const refetchUsers = async () => {
    setRefreshing(true);
    try {
      let usersData;
      usersData = await getAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      Alert.alert("Error", "Failed to refresh sites");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      refetchUsers();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCloseModal = () => {
    setEditUser(null);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center px-4 my-6">
        <SearchInput
          initialQuery=""
          placeholder="Rechercher un utilisateur"
          items={users}
          searchKey="nom_utilisateur"
          onResultsChange={setFilteredUsers}
        />
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id_utilisateur.toString()}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onDelete={handleDeleteUser}
            onEdit={(user) => setEditUser(user)}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Aucun utilisateur trouvé"
            subtitle="Vous pouvez créer un nouvel utilisateur"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetchUsers} />
        }
      />
      <View className="w-full justify-center px-4 my-6">
        <CustomButton
          title="Ajouter un utilisateur"
          handlePress={() => router.push("/users/create")}
          containerStyles="w-full my-5"
        />
      </View>

      <StatusBar backgroundColor="#161622" />

      <Modal visible={!!editUser} onRequestClose={handleCloseModal}>
        <UpdateUser
          id_utilisateur={editUser?.id_utilisateur}
          user_data={editUser}
          onClose={handleCloseModal}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default Users;
