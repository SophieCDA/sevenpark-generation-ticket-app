import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "http://10.81.200.132:5000"; // Remplacez par l'URL de votre API Flask

interface SignInResponse {
  Authorization: string;
  // Ajoutez d'autres propriétés de la réponse si nécessaire
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
      const token = response.data.Authorization;
      await AsyncStorage.setItem("token", token);
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
};

export const getCurrentUser = async (): Promise<any> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return null;
};
