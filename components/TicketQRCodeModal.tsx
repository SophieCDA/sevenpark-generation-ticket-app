import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Alert,
  Button,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { getTicketByNumTicket } from "@/lib/flaskApi"; // Assurez-vous d'avoir une fonction pour appeler votre API

interface TicketQRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  num_ticket: string | null;
}

interface TicketData {
  num_plaque: string;
  debut_validite: string;
  fin_validite: string;
  nom: string;
  prenom: string;
}

const TicketQRCodeModal: React.FC<TicketQRCodeModalProps> = ({
  visible,
  onClose,
  num_ticket,
}) => {
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  useEffect(() => {
    if (visible && num_ticket) {
      const fetchTicket = async () => {
        try {
          const data = await getTicketByNumTicket(num_ticket);
          setTicketData(data);
        } catch (error) {
          Alert.alert(
            "Erreur",
            "Impossible de récupérer les données du ticket"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchTicket();
    }
  }, [visible, num_ticket]);

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : ticketData ? (
          <>
            <Text style={styles.title}>Votre QR Code</Text>
            <QRCode
              value={`${ticketData.num_plaque}|${ticketData.debut_validite}|${ticketData.fin_validite}|${ticketData.nom}|${ticketData.prenom}`}
              size={200}
            />
            <View style={styles.details}>
              <Text>Nom: {ticketData.nom}</Text>
              <Text>Prénom: {ticketData.prenom}</Text>
              <Text>Numéro de plaque: {ticketData.num_plaque}</Text>
              <Text>Début validité: {ticketData.debut_validite}</Text>
              <Text>Fin validité: {ticketData.fin_validite}</Text>
            </View>
            <Button title="Fermer" onPress={onClose} />
          </>
        ) : (
          <View style={styles.details}>
            <Text>Erreur lors du chargement des données du ticket</Text>
            <Button title="Fermer" onPress={onClose} />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default TicketQRCodeModal;
