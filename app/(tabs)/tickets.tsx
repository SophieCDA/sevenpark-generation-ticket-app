import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import {
  View,
  FlatList,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
  StyleSheet,
  Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllTickets, deleteTicket, getAllParkings } from "@/lib/flaskApi";
import EmptyState from "@/components/EmptyState";
import { useFocusEffect, router } from "expo-router";
import SearchInput from "@/components/SearchInput";
import TicketQRCode from "@/components/TicketQRCode/TicketQRCode.component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider, IconButton, Button, Card, Switch } from "react-native-paper";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { Camera } from "expo-camera";
import TicketCard from "@/components/TicketCard";
import CameraModal from "@/components/CameraModal/CameraModal.component";

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

const Tickets: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [exportQRCode, setExportQRCode] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [manualScan, setManualScan] = useState(false);
  const qrCodeRef = useRef<View>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkingsData = await getAllParkings();
        setParkings(parkingsData);

        refetchTickets();
      } catch (error: any) {
        Alert.alert("Erreur : ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      const adminStatus = await AsyncStorage.getItem("is_admin");
      const isAdmin = adminStatus === "1";
      setIsAdmin(isAdmin);
      setIncludeDeleted(false);
    };

    checkAdminStatus();
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetchTickets();
    }, [])
  );

  useEffect(() => {
    refetchTickets();
  }, [includeDeleted]);

  const refetchTickets = async () => {
    setRefreshing(true);
    try {
      let ticketsData = await getAllTickets();
      if (!includeDeleted) {
        ticketsData = ticketsData.filter(
          (ticket: Ticket) => ticket.supprimer == false
        );
      }
      setTickets(ticketsData);
      setFilteredTickets(ticketsData);
    } catch (error: any) {
      Alert.alert("Erreur :", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteTicket = async (ticket: Ticket) => {
    try {
      await deleteTicket(ticket.id_ticket);
      refetchTickets();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleShowQRCode = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowQRCode(true);
    if (!ticket.is_valid) {
      Alert.alert("Ticket non valide");
    }
  };

  const handleExportQRCode = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setExportQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
    setSelectedTicket(null);
  }

  useEffect(() => {
    if (exportQRCode && selectedTicket) {
      const timeout = setTimeout(() => {
        captureQRCode();
      }, 1000);
      return () => clearTimeout(timeout)
    }
  }, [exportQRCode, selectedTicket])

  const captureQRCode = async () => {
    if (qrCodeRef.current) {
      try {
        const uri = await captureRef(qrCodeRef.current, {
          format: "png",
          quality: 0.8
        })
        await Sharing.shareAsync(uri);
        setExportQRCode(false);
      } catch (error: any) {
        Alert.alert("Erreur : ", error.message)
      }
    }
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) {
      setCameraVisible(false);
      const [num_plaque, debut_validite, fin_validite, nom, prenom] = data.split("|");
      const ticket = tickets.find(
        (t) =>
          t.num_plaque === num_plaque &&
          t.debut_validite === debut_validite &&
          t.fin_validite === fin_validite &&
          t.nom === nom &&
          t.prenom === prenom
      );

      if (ticket) {
        handleShowQRCode(ticket);
      } else {
        Alert.alert("Erreur", "Ticket non trouvé");
      }
    }
  };


  const openCamera = async () => {
    setScanned(false);
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    if (status === "granted") {
      setCameraVisible(true);
    } else {
      Alert.alert("Erreur", "Permission refusée");
    }
  };
  
  const handleManualScan = () => {
    setScanned(true); 
  };


  return (
    <SafeAreaView className="bg-primary h-full flex-1">
      <PaperProvider>
        <View className="w-full justify-center px-4 my-6">
          <SearchInput
            initialQuery=""
            placeholder="Rechercher un ticket"
            items={tickets}
            searchKey="numero_ticket"
            onResultsChange={setFilteredTickets}
          />
        </View>
        {isAdmin && (
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Inclure ticket supprimés</Text>
            <Switch
              value={includeDeleted}
              onValueChange={(value) => {
                setIncludeDeleted(value);
              }}
            />
          </View>
        )}
        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id_ticket.toString()}
          renderItem={({ item }) => (
            <TicketCard
              ticket={item}
              parkings={parkings}
              handleDeleteTicket={() => handleDeleteTicket(item)}
              handleShowQRCode={() => handleShowQRCode(item)}
              handleExportQRCode={() => handleExportQRCode(item)}

            />
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
        <PaperProvider>
          <View className="w-full flex-row justify-center">
            {isAdmin && (
              <IconButton
                style={{ backgroundColor: "#007BFF" }}
                icon="plus"
                onPress={() => router.push("/tickets/create")}
              />
            )}
            <IconButton
              style={{ backgroundColor: "#007BFF" }}
              icon="camera"
              onPress={openCamera}
            />
          </View>
        </PaperProvider>
        <StatusBar backgroundColor="#161622" />
        {selectedTicket && (
          <Modal
            visible={showQRCode}
            onRequestClose={handleCloseQRCode}
            animationType="slide"
          >
            <View style={styles.container}>
              <TicketQRCode ticket={selectedTicket} ticketExport={false} />
              <Button onPress={handleCloseQRCode}>Fermer</Button>
            </View>
          </Modal>
        )}
        {selectedTicket && (
          <View style={{ position: "absolute", top: -1000 }}>
            <View ref={qrCodeRef} style={styles.container}>
              <TicketQRCode ticket={selectedTicket} ticketExport={true} />
            </View>
          </View>
        )}
        {cameraVisible && hasPermission && (
          <CameraModal
            visible={cameraVisible}
            onClose={() => setCameraVisible(false)}
            onScan={handleBarCodeScanned}
            onManualScan={handleManualScan}
          />
        )}
      </PaperProvider>
    </SafeAreaView>
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
  cameraContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 70,
  },
  cameraActions: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    columnGap: 3,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  toggleLabel: {
    fontSize: 16,
    color: "white"
  }
});

export default Tickets;
