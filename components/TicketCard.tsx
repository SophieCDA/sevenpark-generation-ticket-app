import React from "react";
import { Card, Button } from "react-native-paper";

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

interface TicketCardProps {
  ticket: Ticket;
  parkings: Parking[];
  handleDeleteTicket: (ticket: Ticket) => void;
  handleShowQRCode: (ticket: Ticket) => void;
  handleExportQRCode: (ticket: Ticket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  parkings,
  handleDeleteTicket,
  handleShowQRCode,
  handleExportQRCode
}) => {
  const parking = parkings.find((p) => p.id_parking === ticket.id_parking);

  return (

    <Card style={{ margin: 20, backgroundColor: "white" }}>
      <Card.Title
        titleStyle={{ color: "black" }}
        title={
          "Ticket n ° " + ticket.numero_ticket + " | Parking : " + parking?.nom_parking
        }
        subtitleStyle={{ color: "black" }}
        subtitle={
          "Client : " + ticket.nom
        }
      />
      <Card.Actions>
        <Button
          textColor="white"
          style={{ backgroundColor: "#007BFF", borderColor: "#0056D2" }}
          onPress={() => handleShowQRCode(ticket)}
        >
          Voir
        </Button>
        <Button
          textColor="white"
          style={{ backgroundColor: "#007BFF", borderColor: "#0056D2" }}
          onPress={() => handleExportQRCode(ticket)}
        >
          Envoyer
        </Button>
        <Button
          textColor="white"
          style={{ backgroundColor: "#007BFF", borderColor: "#0056D2" }}
          onPress={() => handleDeleteTicket(ticket)}
        >
          Supprimer
        </Button>
      </Card.Actions>

    </Card>
  );
};

export default TicketCard;
