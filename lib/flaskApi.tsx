import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const API_BASE_URL = "http://192.168.1.82:5000"; // maison
// const API_BASE_URL = "http://10.81.200.6:5000"; // campus

interface SignInResponse {
  Authorization: string;
  nom_utilisateur: string;
  id_utilisateur: number;
  is_admin: boolean;
}

export const signIn = async (
  identifiant: string,
  password: string,
  api_key: string
): Promise<SignInResponse> => {
  try {
    const response = await axios.post<SignInResponse>(`${API_BASE_URL}/login`, {
      identifiant,
      password,
      api_key,
    });
    if (response.status === 202) {
      const {
        Authorization: token,
        nom_utilisateur,
        id_utilisateur,
        is_admin,
      } = response.data;
      console.log(response.data);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("nom_utilisateur", nom_utilisateur);
      await AsyncStorage.setItem(
        "id_utilisateur",
        JSON.stringify(id_utilisateur)
      );
      await AsyncStorage.setItem("is_admin", JSON.stringify(is_admin));
      return response.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async (): Promise<void> => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("nom_utilisateur");
  await AsyncStorage.removeItem("id_utilisateur");
};

export const getCurrentUser = async (): Promise<any> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return null;
  const nomUtilisateur = await AsyncStorage.getItem("nom_utilisateur");
  const idUtilisateur = await AsyncStorage.getItem("id_utilisateur");
  return { token, nomUtilisateur, idUtilisateur };
};

export const getUserInfo = async (): Promise<any> => {
  try {
    const idUtilisateur = await AsyncStorage.getItem("id_utilisateur");
    if (!idUtilisateur) throw new Error("User ID not found");

    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/utilisateurs`, {
      params: { id_utilisateur: idUtilisateur },
      headers: {
        Authorization: `${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch user info");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllUsers = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/utilisateurs`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addUser = async (
  nom_utilisateur: string,
  identifiant: string,
  password: string,
  api_key: string,
  is_admin: boolean,
  as_date_validity: boolean,
  date_fin_validite?: string
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      nom_utilisateur,
      identifiant,
      password,
      api_key,
      is_admin,
      as_date_validity,
      ...(as_date_validity && { date_fin_validite }), // Add date_fin_validite only if as_date_validity is true
    };

    const response = await axios.post(`${API_BASE_URL}/utilisateurs`, data, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      Alert.alert("Utilisateur créé");
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (id_utilisateur: number): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    await axios.delete(`${API_BASE_URL}/utilisateurs`, {
      params: {
        id_utilisateur: id_utilisateur,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updatePassword = async (password: string): Promise<any> => {
  try {
    const idUtilisateur = await AsyncStorage.getItem("id_utilisateur");
    if (!idUtilisateur) throw new Error("User ID not found");

    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.patch(
      `${API_BASE_URL}/utilisateurs`,
      { password },
      {
        params: { id_utilisateur: idUtilisateur },
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      Alert.alert("Mot de passe modifié avec succès");
    } else {
      throw new Error("Failed to update password");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUser = async (
  id_utilisateur: string,
  nom_utilisateur: string,
  identifiant: string,
  password: string,
  api_key: string,
  is_admin: boolean,
  as_date_validity: boolean,
  date_fin_validite?: string
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      nom_utilisateur,
      identifiant,
      password,
      api_key,
      is_admin,
      as_date_validity,
      ...(as_date_validity && { date_fin_validite }),
    };

    const response = await axios.patch(`${API_BASE_URL}/utilisateurs`, data, {
      params: {
        id_utilisateur: id_utilisateur,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllSites = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/sites`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    } 
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteSite = async (id_site: number): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    await axios.delete(`${API_BASE_URL}/sites`, {
      params: {
        id_site: id_site,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addSite = async (
  nom_site: string,
  code_site: number,
  id_utilisateur: number
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      nom_site,
      code_site,
      id_utilisateur,
    };

    const response = await axios.post(`${API_BASE_URL}/sites`, data, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      Alert.alert("Site créé");
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateSite = async (
  id_site: string,
  nom_site: string,
  code_site: string,
  id_utilisateur: string
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      nom_site,
      code_site,
      id_utilisateur,
    };

    const response = await axios.patch(`${API_BASE_URL}/sites`, data, {
      params: {
        id_site: id_site,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update site");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllParkings = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/parking`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } 
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteParking = async (id_parking: number): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    await axios.delete(`${API_BASE_URL}/parking`, {
      params: {
        id_parking: id_parking,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addParking = async (
  nom_parking: string,
  adresse_parking: string,
  code_postal_parking: string,
  code_parking: string,
  id_site: number,
  ticket_autorise: { id_type_ticket: number; autorise: boolean }[]
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      nom_parking,
      adresse_parking,
      code_postal_parking,
      code_parking,
      id_site,
      ticket_autorise,
    };

    const response = await axios.post(`${API_BASE_URL}/parking`, data, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      Alert.alert("Parking créé");
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTypesTickets = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/type-tickets`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getParkingTypesTickets = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/type-tickets`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      throw new Error("Failed to fetch types tickets");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateParking = async (
  id_parking: string,
  nom_parking: string,
  adresse_parking: string,
  code_postal_parking: string,
  code_parking: string,
  id_site: number,
  ticket_autorise: { id_type_ticket: number; autorise: boolean }[]
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      nom_parking,
      adresse_parking,
      code_postal_parking,
      code_parking,
      id_site,
      ticket_autorise,
    };

    const response = await axios.patch(`${API_BASE_URL}/parking`, data, {
      params: {
        id_parking: id_parking,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update parking");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllTickets = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${API_BASE_URL}/tickets`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch tickets");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addTicket = async (
  id_parking: number,
  numero_ticket: string,
  num_plaque: string,
  nom: string,
  prenom: string,
  is_valid: boolean,
  code_option: string,
  debut_validite: string,
  fin_validite: string
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      id_parking,
      numero_ticket,
      num_plaque,
      nom,
      prenom,
      is_valid,
      code_option,
      debut_validite,
      fin_validite,
    };

    let url = `${API_BASE_URL}/tickets`;

    switch (code_option) {
      case "2":
        url = `${url}/ticket-congres`;
        break;
      case "0":
        url = `${url}/ticket-gratuit`;
        break;
      case "3":
        url = `${url}/ticket-reduction`;
        break;
      default:
        throw new Error("Invalid ticket type");
    }

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      Alert.alert("Ticket créé");
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateTicket = async (
  id_ticket: string,
  is_valid: boolean,
  supprimer: boolean
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const data = {
      is_valid,
      supprimer,
    };

    const response = await axios.patch(`${API_BASE_URL}/tickets`, data, {
      params: {
        id_ticket: id_ticket,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update ticket");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteTicket = async (id_ticket: number): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    await axios.delete(`${API_BASE_URL}/ticket`, {
      params: {
        id_ticket: id_ticket,
      },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
