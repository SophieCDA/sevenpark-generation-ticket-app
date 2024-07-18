import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StatusBar,
  RefreshControl,
  Alert,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllTickets, deleteTicket, getAllParkings } from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { useFocusEffect, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import SearchInput from "@/components/SearchInput";
import TicketQRCodeModal from "@/components/TicketQRCodeModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider, Card, Button, useTheme } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

interface Ticket {
  id_ticket: number;
  id_parking: number;
  numero_ticket: string;
  num_plaque: string;
  nom: string;
  prenom: string;
  debut_validite: string;
  fin_validite: string;
  is_valid: boolean;
  supprimer: boolean;
}

interface Parking {
  id_parking: number;
  nom_parking: string;
}

const Tickets = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [exportQRCode, setExportQRCode] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const theme = useTheme();
  const qrCodeRef = useRef<View>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkingsData = await getAllParkings();
        setParkings(parkingsData);

        const ticketsData = await getAllTickets();
        setTickets(ticketsData);
        setFilteredTickets(ticketsData);
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
      console.log("Error", "Failed to refresh tickets");
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

  const handleShowQRCode = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowQRCode(true);
  };

  const handleExportQRCode = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setExportQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
    setSelectedTicket(null);
  };

  useEffect(() => {
    if (exportQRCode && selectedTicket) {
      const timeout = setTimeout(() => {
        captureQRCode();
      }, 1000); // delay to ensure QR code is rendered
      return () => clearTimeout(timeout);
    }
  }, [exportQRCode, selectedTicket]);

  const captureQRCode = async () => {
    if (qrCodeRef.current) {
      try {
        const uri = await captureRef(qrCodeRef.current, {
          format: "png",
          quality: 0.8,
        });
        console.log("QR Code captured, URI:", uri);
        await Sharing.shareAsync(uri);
        console.log("QR Code shared successfully");
      } catch (error: any) {
        console.log("Error sharing QR Code:", error.message);
        Alert.alert("Error", error.message);
      }
    } else {
      console.log("qrCodeRef.current is null");
    }
  };

  const parking = (ticket: Ticket) => {
    return parkings.find((p) => p.id_parking === ticket.id_parking);
  };

  return (
    <PaperProvider>
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
            <Card style={{ margin: 20, backgroundColor: "white" }}>
              <Card.Title
                titleStyle={{ color: "black" }}
                title={
                  "Ticket n° " +
                  item.numero_ticket +
                  " | Parking : " +
                  parking(item)?.nom_parking
                }
                subtitleStyle={{ color: "black" }}
                subtitle={"Client : " + item.nom}
              />
              <Card.Actions>
                <Button
                  style={{
                    backgroundColor: theme.colors.secondary,
                    borderColor: theme.colors.primary[100],
                  }}
                  onPress={() => {
                    setSelectedTicket(item);
                    setShowQRCode(true);
                  }}
                >
                  Voir
                </Button>
                <Button
                  style={{ backgroundColor: "#007BFF", borderColor: "#0056D2" }}
                  onPress={() => {
                    handleExportQRCode(item);
                  }}
                >
                  Envoyer
                </Button>
                <Button
                  style={{ backgroundColor: "#007BFF", borderColor: "#0056D2" }}
                  onPress={() => {
                    handleDeleteTicket(item.id_ticket);
                  }}
                >
                  Supprimer
                </Button>
              </Card.Actions>
            </Card>
          )}
          ListEmptyComponent={() => (
            <EmptyState title="Aucun ticket trouvé" subtitle="" />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refetchTickets}
            />
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
        <TicketQRCodeModal
          visible={showQRCode}
          onClose={handleCloseQRCode}
          num_ticket={selectedTicket?.numero_ticket || ""}
        />
        {selectedTicket && (
          <View style={{ position: "absolute", top: -1000 }}>
            <View ref={qrCodeRef} style={styles.container}>
              <Text style={styles.title}>Votre QR Code</Text>
              <QRCode
                value={`${selectedTicket.num_plaque}|${selectedTicket.debut_validite}|${selectedTicket.fin_validite}|${selectedTicket.nom}|${selectedTicket.prenom}`}
                size={200}
              />
              <View style={styles.details}>
                <Text>Nom: {selectedTicket.nom}</Text>
                <Text>Prénom: {selectedTicket.prenom}</Text>
                <Text>Numéro de plaque: {selectedTicket.num_plaque}</Text>
                <Text>Début validité: {selectedTicket.debut_validite}</Text>
                <Text>Fin validité: {selectedTicket.fin_validite}</Text>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  details: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default Tickets;
