import React from "react";
import { View, Text } from "react-native";
import { styles } from "./TicketQRCode.style";
import QRCode from "react-native-qrcode-svg";

const TicketQRCode: React.FC<TicketQRCodeModalProps> = ({
    ticket,
    ticketExport,
}) => {
    return (
        <View style={styles.container}>
            {ticket ? (
                <>
                    <Text style={styles.title}>Votre QR Code</Text>
                    <Text style={styles.title}>Ticket n°{ticket.numero_ticket}</Text>
                    <QRCode
                        value={`${ticket.num_plaque}|${ticket.debut_validite}|${ticket.fin_validite}|${ticket.nom}|${ticket.prenom}`}
                        size={200}
                    />
                    {!ticketExport ? (
                        <View style={styles.details}>
                            <Text>Nom : {ticket.nom}</Text>
                            <Text>Prénom : {ticket.prenom}</Text>
                            <Text>Immatriculation : {ticket.num_plaque}</Text>
                            <Text>Début de validité : {ticket.debut_validite}</Text>
                            <Text>Fin de validité : {ticket.fin_validite}</Text>
                        </View>
                    ) : (
                        <Text></Text>
                    )}
                </>
            ) : (
                <View style={styles.error}>
                    <Text>Erreur lors du chargement du ticket</Text>
                </View>
            )}
        </View>
    );
};

export default TicketQRCode;
