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
import { getAllTickets, deleteTicket, getAllParkings } from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { useNavigation, useFocusEffect, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import SearchInput from "@/components/SearchInput";
import TicketCard from "@/components/TicketCard";
import UpdateTicket from "@/components/UpdateTicket";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ticket {
  id_ticket: number;
  id_parking: number;
  numero_ticket: string;
  num_plaque: string;
  nom: string;
  is_valid: boolean;
  supprimer: boolean;
}

interface Parking {
  id_parking: number;
  nom_parking: string;
}

const Tickets = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [editTicket, setEditTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkingsData = await getAllParkings();
        setParkings(parkingsData);

        const ticketsData = await getAllTickets();
        setTickets(ticketsData);
        setFilteredTickets(ticketsData);
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
      refetchTickets();
    }, [])
  );

  const refetchTickets = async () => {
    setRefreshing(true);
    try {
      const ticketsData = await getAllTickets();
      setTickets(ticketsData);
      setFilteredTickets(ticketsData);
    } catch (error) {
      Alert.alert("Error", "Failed to refresh tickets");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteTicket = async (id: number) => {
    try {
      await deleteTicket(id);
      refetchTickets();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCloseModal = () => {
    setEditTicket(null);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center px-4 my-6">
        <SearchInput
          initialQuery=""
          placeholder="Rechercher un ticket"
          items={tickets}
          searchKey="numero_ticket"
          onResultsChange={setFilteredTickets}
        />
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id_ticket.toString()}
        renderItem={({ item }) => (
          <TicketCard
            ticket={item}
            parkings={parkings}
            onDelete={handleDeleteTicket}
            onEdit={(ticket) => setEditTicket(ticket)}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState title="Aucun ticket trouvé" subtitle="" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetchTickets} />
        }
      />
      <View className="w-full justify-center px-4 my-6">
        {isAdmin && (
          <CustomButton
            title="Ajouter un ticket"
            handlePress={() => router.push("/tickets/create")}
            containerStyles="w-full my-5"
          />
        )}
      </View>
      <StatusBar backgroundColor="#161622" />
      <Modal visible={!!editTicket} onRequestClose={handleCloseModal}>
        <UpdateTicket
          id_ticket={editTicket?.id_ticket}
          ticket_data={editTicket}
          onClose={handleCloseModal}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default Tickets;
