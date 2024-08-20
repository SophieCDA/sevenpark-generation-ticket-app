interface TicketQRCodeModalProps {
    ticket: Ticket;
    ticketExport: boolean;
}

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