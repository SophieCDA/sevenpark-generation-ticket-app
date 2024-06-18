import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllUsers } from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { useFocusEffect } from "expo-router";
import useFlaskApi from "@/hooks/useFlaskApi";
import UserCard from "@/components/UserCard";

const Users = () => {
  const [refreshing, setRefreshing] = useState(false);
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

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={users}
        keyExtractor={(item) => item.id_utilisateur.toString()}
        renderItem={({ item }) => <UserCard user={item} />}
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
      <StatusBar backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default Users;
