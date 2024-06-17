import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "http://10.81.200.132:5000"; // Remplacez par l'URL de votre API Flask

interface SignInResponse {
  Authorization: string;
  nom_utilisateur: string;
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
      const { Authorization: token, nom_utilisateur } = response.data;
      console.log(response.data);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("nom_utilisateur", nom_utilisateur);
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
};

export const getCurrentUser = async (): Promise<any> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return null;
  const nomUtilisateur = await AsyncStorage.getItem("nom_utilisateur");
  return { token, nomUtilisateur };
};
