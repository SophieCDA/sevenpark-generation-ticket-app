import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const API_BASE_URL = "http://192.168.1.15:5000";

interface SignInResponse {
  Authorization: string;
  nom_utilisateur: string;
  id_utilisateur: number;
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
      } = response.data;
      console.log(response.data);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("nom_utilisateur", nom_utilisateur);
      await AsyncStorage.setItem(
        "id_utilisateur",
        JSON.stringify(id_utilisateur)
      );
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
          "Content-Type": "application/json"
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
