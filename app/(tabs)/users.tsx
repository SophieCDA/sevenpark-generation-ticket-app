import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllUsers, deleteUser } from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { router, useFocusEffect } from "expo-router";
import useFlaskApi from "@/hooks/useFlaskApi";
import UserCard from "@/components/UserCard";
import CustomButton from "@/components/CustomButton";

const Users = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const { data: users, isLoading, refetch } = useFlaskApi(getAllUsers);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      refetch();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={users}
        keyExtractor={(item) => item.id_utilisateur.toString()}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onDelete={handleDeleteUser}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Aucun utilisateur trouvé"
            subtitle="Vous pouvez créer un nouvel utilisateur"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View className="w-full justify-center px-4 my-6">
        <CustomButton
          title="Ajouter un utilisateur"
          handlePress={() => router.push("/(tabs)/create-user")}
          containerStyles="w-full my-5"
        />
      </View>

      <StatusBar backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default Users;
